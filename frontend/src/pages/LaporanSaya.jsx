import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

// Mapping status DB → label logistik yang tampil di UI
const statusToLabel = {
  pending: 'Dilaporkan',
  verified: 'Diverifikasi',
  at_counter: 'Di Loket',
  completed: 'Selesai',
};

const LaporanSaya = () => {
  const [activeTab, setActiveTab] = useState('aktif');
  const [myReports, setMyReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    fetchMyReports();
  }, []);

  const fetchMyReports = async () => {
    setIsLoading(true);
    setError('');
    try {
      // Ambil user yang sedang login
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) throw new Error('Sesi tidak valid, silakan login ulang.');

      // Ambil profil nama user
      const { data: profile } = await supabase
        .from('users')
        .select('nama')
        .eq('user_id', user.id)
        .single();

      setUserName(profile?.nama || user.email);

      // Fetch found_item dan lost_item milik user ini secara paralel
      const [{ data: foundItems, error: e1 }, { data: lostItems, error: e2 }] =
        await Promise.all([
          supabase
            .from('found_item')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false }),
          supabase
            .from('lost_item')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false }),
        ]);

      if (e1) throw e1;
      if (e2) throw e2;

      // Normalisasi found_item
      const foundMapped = (foundItems || []).map((i) => ({
        id: `F-${i.found_id}`,
        dbId: i.found_id,
        dbTable: 'found_item',
        nama: i.nama_barang,
        lokasi: i.lokasi_ditemukan,
        status: 'found',
        tanggal: i.tanggal_ditemukan,
        logistik: statusToLabel[i.status] || 'Dilaporkan',
        dbStatus: i.status,
        deskripsi: i.deskripsi || '-',
        foto: i.foto,
        // Laporan selesai jika status = completed
        kategori: i.status === 'completed' ? 'selesai' : 'aktif',
        tglSelesai:
          i.status === 'completed'
            ? new Date(i.created_at).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })
            : null,
      }));

      // Normalisasi lost_item
      const lostMapped = (lostItems || []).map((i) => ({
        id: `L-${i.lost_id}`,
        dbId: i.lost_id,
        dbTable: 'lost_item',
        nama: i.nama_barang,
        lokasi: i.lokasi_hilang,
        status: 'lost',
        tanggal: i.tanggal_hilang,
        logistik: statusToLabel[i.status] || 'Dilaporkan',
        dbStatus: i.status,
        deskripsi: i.deskripsi || '-',
        foto: i.foto,
        kategori: i.status === 'completed' ? 'selesai' : 'aktif',
        tglSelesai:
          i.status === 'completed'
            ? new Date(i.created_at).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })
            : null,
      }));

      // Gabung dan urutkan terbaru dulu
      const combined = [...foundMapped, ...lostMapped].sort(
        (a, b) => new Date(b.tanggal) - new Date(a.tanggal)
      );

      setMyReports(combined);
    } catch (err) {
      console.error('Gagal fetch laporan saya:', err.message);
      setError('Gagal memuat laporan: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Simulasi cetak Berita Acara (alert informatif)
  const handleCetakPDF = (report) => {
    alert(
      `📄 Mendownload Berita Acara Resmi LostLynk Undip...\n\nID Dokumen: BA-${report.id}\nBarang: ${report.nama}\nStatus: Telah Sukses Dikembalikan ke Pemilik Sah.\n\nFile PDF sukses disimpan di folder Downloads!`
    );
  };

  const filteredReports = myReports.filter((r) => r.kategori === activeTab);
  const aktifCount = myReports.filter((r) => r.kategori === 'aktif').length;
  const selesaiCount = myReports.filter((r) => r.kategori === 'selesai').length;

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.5rem',
        }}
      >
        <h2>Riwayat Laporan Saya</h2>
        {userName && (
          <span
            style={{
              background: 'var(--cream)',
              color: 'var(--accent-mid)',
              padding: '0.4rem 0.8rem',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 'bold',
              border: '1px solid var(--accent-light)',
            }}
          >
            USER: {userName}
          </span>
        )}
      </div>
      <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>
        Pantau status verifikasi logistik barang milikmu atau cetak bukti serah terima resmi di
        sini.
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
            onClick={fetchMyReports}
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
            Coba Lagi
          </button>
        </div>
      )}

      {/* TAB FILTER */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          borderBottom: '2px solid var(--border)',
          marginBottom: '2rem',
        }}
      >
        <button
          onClick={() => setActiveTab('aktif')}
          style={{
            padding: '0.8rem 1.5rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: activeTab === 'aktif' ? '600' : '400',
            color: activeTab === 'aktif' ? 'var(--accent)' : 'var(--muted)',
            borderBottom: activeTab === 'aktif' ? '3px solid var(--accent)' : '3px solid transparent',
            marginBottom: '-2px',
            transition: 'all 0.2s',
          }}
        >
          ⏳ Laporan Aktif ({aktifCount})
        </button>
        <button
          onClick={() => setActiveTab('selesai')}
          style={{
            padding: '0.8rem 1.5rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: activeTab === 'selesai' ? '600' : '400',
            color: activeTab === 'selesai' ? 'var(--accent)' : 'var(--muted)',
            borderBottom:
              activeTab === 'selesai' ? '3px solid var(--accent)' : '3px solid transparent',
            marginBottom: '-2px',
            transition: 'all 0.2s',
          }}
        >
          ✅ Selesai / Arsip ({selesaiCount})
        </button>
      </div>

      {/* LOADING SKELETON */}
      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              style={{
                background: '#fff',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                padding: '1.5rem',
                height: '120px',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.8rem',
              }}
            >
              <div
                className="shimmer"
                style={{ width: '40%', height: '20px', background: '#e2e8f0', borderRadius: '4px' }}
              />
              <div
                className="shimmer"
                style={{ width: '70%', height: '16px', background: '#f1f5f9', borderRadius: '4px' }}
              />
            </div>
          ))}
        </div>
      ) : (
        /* LIST KARTU LAPORAN */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredReports.length === 0 ? (
            <p
              style={{
                textAlign: 'center',
                color: 'var(--muted)',
                padding: '3rem',
                background: '#fff',
                borderRadius: '12px',
                border: '1px dashed var(--border)',
              }}
            >
              {myReports.length === 0
                ? '📭 Kamu belum membuat laporan apapun.'
                : 'Tidak ada riwayat laporan di kategori ini.'}
            </p>
          ) : (
            filteredReports.map((report) => (
              <div
                key={report.id}
                style={{
                  background: '#ffffff',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  display: 'grid',
                  gridTemplateColumns: report.foto ? 'auto 1fr auto' : '1fr auto',
                  alignItems: 'center',
                  gap: '1.5rem',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateX(4px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.04)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateX(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Foto thumbnail jika ada */}
                {report.foto && (
                  <img
                    src={report.foto}
                    alt={report.nama}
                    style={{
                      width: '80px',
                      height: '80px',
                      objectFit: 'cover',
                      borderRadius: '10px',
                      flexShrink: 0,
                    }}
                  />
                )}

                {/* Informasi Laporan */}
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.8rem',
                      marginBottom: '0.5rem',
                      flexWrap: 'wrap',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'monospace',
                        fontSize: '0.8rem',
                        background: 'var(--cream)',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                        fontWeight: 'bold',
                        color: 'var(--ink)',
                      }}
                    >
                      {report.id}
                    </span>
                    <span className={`badge badge-${report.status}`}>
                      {report.status === 'found' ? 'Temuan' : 'Kehilangan'}
                    </span>
                    <span
                      style={{
                        fontSize: '0.8rem',
                        color: 'var(--accent-mid)',
                        fontWeight: '600',
                        background: 'var(--accent-light)',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '4px',
                      }}
                    >
                      📦 Status: {report.logistik}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '1.05rem', margin: '0 0 0.3rem 0' }}>{report.nama}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--muted)', margin: '0 0 0.4rem 0' }}>
                    📍 {report.lokasi} | 📅 {report.tanggal}
                  </p>
                  <p
                    style={{
                      fontSize: '0.85rem',
                      color: 'var(--ink)',
                      margin: 0,
                      fontStyle: 'italic',
                    }}
                  >
                    "{report.deskripsi}"
                  </p>

                  {report.tglSelesai && (
                    <p
                      style={{
                        fontSize: '0.8rem',
                        color: '#10b981',
                        margin: '0.5rem 0 0 0',
                        fontWeight: '500',
                      }}
                    >
                      🎉 Selesai diserahterimakan pada: {report.tglSelesai}
                    </p>
                  )}
                </div>

                {/* Aksi kanan */}
                <div>
                  {report.kategori === 'selesai' ? (
                    <button
                      className="btn btn-primary"
                      style={{
                        fontSize: '0.8rem',
                        padding: '0.5rem 1rem',
                        background: '#10b981',
                        borderColor: '#10b981',
                      }}
                      onClick={() => handleCetakPDF(report)}
                    >
                      📥 Cetak Bukti BA
                    </button>
                  ) : (
                    <div
                      style={{
                        textAlign: 'center',
                        color: 'var(--muted)',
                        fontSize: '0.8rem',
                        fontWeight: '500',
                        padding: '0.5rem 1rem',
                        background: 'var(--cream)',
                        borderRadius: '8px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      🔒 Diproses Admin
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default LaporanSaya;
