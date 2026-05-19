import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

// Mapping status DB ↔ angka step untuk UI
const statusToStep = {
  pending: 1,
  verified: 2,
  at_counter: 3,
  completed: 4,
};

const stepToStatus = {
  1: 'pending',
  2: 'verified',
  3: 'at_counter',
  4: 'completed',
};

const getStepLabel = (step) => {
  switch (step) {
    case 1: return '📝 Dilaporkan';
    case 2: return '🔍 Diverifikasi';
    case 3: return '🏢 Di Loket';
    case 4: return '✅ Selesai (Arsip)';
    default: return 'Diproses';
  }
};

const AdminDashboard = () => {
  const [laporanMasuk, setLaporanMasuk] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(null); // ID item yang sedang diupdate

  useEffect(() => {
    fetchAllLaporan();
  }, []);

  const fetchAllLaporan = async () => {
    setIsLoading(true);
    setError('');
    try {
      // Fetch semua found_item dan lost_item secara paralel
      const [{ data: foundItems, error: e1 }, { data: lostItems, error: e2 }] =
        await Promise.all([
          supabase
            .from('found_item')
            .select('found_id, user_id, nama_barang, lokasi_ditemukan, tanggal_ditemukan, status, created_at')
            .order('created_at', { ascending: false }),
          supabase
            .from('lost_item')
            .select('lost_id, user_id, nama_barang, lokasi_hilang, tanggal_hilang, status, created_at')
            .order('created_at', { ascending: false }),
        ]);

      if (e1) throw e1;
      if (e2) throw e2;

      // Kumpulkan semua user_id unik untuk fetch nama pelapor
      const allUserIds = [
        ...new Set([
          ...(foundItems || []).map((i) => i.user_id),
          ...(lostItems || []).map((i) => i.user_id),
        ]),
      ];

      let userMap = {};
      if (allUserIds.length > 0) {
        const { data: usersData } = await supabase
          .from('users')
          .select('user_id, nama')
          .in('user_id', allUserIds);

        (usersData || []).forEach((u) => {
          userMap[u.user_id] = u.nama;
        });
      }

      // Format tanggal ke bahasa Indonesia
      const formatTanggal = (dateStr) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });
      };

      // Normalisasi found_item
      const foundMapped = (foundItems || []).map((i) => ({
        id: `F-${i.found_id}`,
        dbId: i.found_id,
        dbTable: 'found_item',
        dbPK: 'found_id',
        nama: i.nama_barang,
        lokasi: i.lokasi_ditemukan,
        status: 'found',
        tanggal: formatTanggal(i.tanggal_ditemukan),
        step: statusToStep[i.status] || 1,
        pelapor: userMap[i.user_id] || `User-${i.user_id?.slice(0, 6)}`,
      }));

      // Normalisasi lost_item
      const lostMapped = (lostItems || []).map((i) => ({
        id: `L-${i.lost_id}`,
        dbId: i.lost_id,
        dbTable: 'lost_item',
        dbPK: 'lost_id',
        nama: i.nama_barang,
        lokasi: i.lokasi_hilang,
        status: 'lost',
        tanggal: formatTanggal(i.tanggal_hilang),
        step: statusToStep[i.status] || 1,
        pelapor: userMap[i.user_id] || `User-${i.user_id?.slice(0, 6)}`,
      }));

      // Gabung dan urutkan berdasarkan step ascending (yang belum selesai duluan)
      const combined = [...foundMapped, ...lostMapped].sort(
        (a, b) => a.step - b.step
      );

      setLaporanMasuk(combined);
    } catch (err) {
      console.error('Gagal fetch laporan:', err.message);
      setError('Gagal memuat data: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Update status di DB dan state lokal
  const handleUpdateStep = async (item, newStep) => {
    if (newStep < 1 || newStep > 4) return;

    const newStatus = stepToStatus[newStep];
    setUpdating(item.id);

    try {
      const { error: updateError } = await supabase
        .from(item.dbTable)
        .update({ status: newStatus })
        .eq(item.dbPK, item.dbId);

      if (updateError) throw updateError;

      // Update state lokal tanpa fetch ulang (optimistic update)
      setLaporanMasuk((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, step: newStep } : i))
      );
    } catch (err) {
      alert('Gagal update status: ' + err.message);
    } finally {
      setUpdating(null);
    }
  };

  // Filter berdasarkan ID, nama pelapor, atau nama barang
  const filteredLaporan = laporanMasuk.filter(
    (item) =>
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.pelapor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nama.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      {/* HEADER */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.5rem',
        }}
      >
        <h2>Pusat Kendali Logistik (Admin)</h2>
        <span
          style={{
            background: '#fef2f2',
            color: '#ef4444',
            padding: '0.4rem 0.8rem',
            borderRadius: '8px',
            fontSize: '0.8rem',
            fontWeight: 'bold',
            border: '1px solid #fca5a5',
          }}
        >
          🔒 Akses Laboran Tekkom
        </span>
      </div>
      <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>
        Otorisasi pembaruan status fisik barang temuan dan verifikasi kepemilikan tiket antrean.
      </p>

      {/* ERROR BANNER */}
      {error && (
        <div
          style={{
            background: '#fee2e2',
            color: '#dc2626',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            fontSize: '0.85rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {error}
          <button
            onClick={fetchAllLaporan}
            style={{
              background: '#dc2626',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              padding: '0.3rem 0.7rem',
              cursor: 'pointer',
              fontSize: '0.8rem',
            }}
          >
            Refresh
          </button>
        </div>
      )}

      {/* SEARCH BAR */}
      <div style={{ marginBottom: '1.5rem' }}>
        <input
          type="text"
          className="form-input"
          placeholder="🔍 Cari berdasarkan ID (ex: F-3), nama pelapor, atau nama barang..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ background: '#ffffff' }}
        />
      </div>

      {/* TABEL MANAJEMEN */}
      {isLoading ? (
        <div
          style={{
            background: '#fff',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '3rem',
            textAlign: 'center',
            color: 'var(--muted)',
          }}
        >
          ⏳ Memuat data laporan...
        </div>
      ) : (
        <div
          style={{
            background: '#ffffff',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
          }}
        >
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              textAlign: 'left',
              fontSize: '0.9rem',
            }}
          >
            <thead>
              <tr
                style={{
                  background: 'var(--cream)',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                <th style={{ padding: '1rem' }}>ID Laporan</th>
                <th style={{ padding: '1rem' }}>Nama Barang / Pelapor</th>
                <th style={{ padding: '1rem' }}>Lokasi / Tanggal</th>
                <th style={{ padding: '1rem' }}>Tahapan Logistik</th>
                <th style={{ padding: '1rem', textAlign: 'center' }}>Aksi Kendali Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredLaporan.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    style={{
                      padding: '3rem',
                      textAlign: 'center',
                      color: 'var(--muted)',
                      fontStyle: 'italic',
                    }}
                  >
                    {laporanMasuk.length === 0
                      ? '📭 Belum ada laporan masuk.'
                      : `❌ Tidak ada laporan cocok dengan kata kunci "${searchQuery}"`}
                  </td>
                </tr>
              ) : (
                filteredLaporan.map((item) => (
                  <tr
                    key={item.id}
                    style={{
                      borderBottom: '1px solid var(--border)',
                      transition: 'background 0.2s',
                      opacity: updating === item.id ? 0.6 : 1,
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = '#f8fafc')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = 'transparent')
                    }
                  >
                    {/* ID + TIPE */}
                    <td style={{ padding: '1rem' }}>
                      <div
                        style={{
                          fontWeight: 'bold',
                          fontFamily: 'monospace',
                          color: 'var(--ink)',
                        }}
                      >
                        {item.id}
                      </div>
                      <span
                        className={`badge badge-${item.status}`}
                        style={{ fontSize: '0.7rem', marginTop: '0.3rem' }}
                      >
                        {item.status === 'found' ? 'Temuan' : 'Kehilangan'}
                      </span>
                    </td>

                    {/* NAMA BARANG & PELAPOR */}
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: '600', marginBottom: '0.2rem' }}>
                        {item.nama}
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                        👤 {item.pelapor}
                      </span>
                    </td>

                    {/* LOKASI & TANGGAL */}
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontSize: '0.85rem', marginBottom: '0.2rem' }}>
                        📍 {item.lokasi}
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                        📅 {item.tanggal}
                      </span>
                    </td>

                    {/* STATUS STEP */}
                    <td style={{ padding: '1rem' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '0.3rem 0.6rem',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          background:
                            item.step === 4 ? '#d1fae5' : 'var(--accent-light)',
                          color:
                            item.step === 4 ? '#065f46' : 'var(--accent-mid)',
                        }}
                      >
                        {getStepLabel(item.step)}
                      </span>
                    </td>

                    {/* TOMBOL AKSI */}
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', gap: '0.3rem' }}>
                        <button
                          onClick={() => handleUpdateStep(item, item.step - 1)}
                          disabled={item.step === 1 || updating === item.id}
                          style={{
                            padding: '0.3rem 0.6rem',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            background: '#fff',
                            cursor:
                              item.step === 1 || updating === item.id
                                ? 'not-allowed'
                                : 'pointer',
                            fontSize: '0.8rem',
                            opacity: item.step === 1 ? 0.5 : 1,
                          }}
                        >
                          ◀ Mundur
                        </button>
                        <button
                          onClick={() => handleUpdateStep(item, item.step + 1)}
                          disabled={item.step === 4 || updating === item.id}
                          style={{
                            padding: '0.3rem 0.6rem',
                            borderRadius: '6px',
                            border: '1px solid var(--accent)',
                            background:
                              item.step === 4 ? '#cbd5e1' : 'var(--accent)',
                            color: item.step === 4 ? '#94a3b8' : '#fff',
                            cursor:
                              item.step === 4 || updating === item.id
                                ? 'not-allowed'
                                : 'pointer',
                            fontSize: '0.8rem',
                            fontWeight: '500',
                          }}
                        >
                          {updating === item.id
                            ? '⏳'
                            : item.step === 3
                            ? 'Selesaikan ✓'
                            : 'Maju ▶'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* SUMMARY FOOTER */}
      {!isLoading && laporanMasuk.length > 0 && (
        <div
          style={{
            marginTop: '1rem',
            fontSize: '0.8rem',
            color: 'var(--muted)',
            textAlign: 'right',
          }}
        >
          Total: {laporanMasuk.length} laporan |{' '}
          {laporanMasuk.filter((i) => i.step < 4).length} aktif |{' '}
          {laporanMasuk.filter((i) => i.step === 4).length} selesai
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
