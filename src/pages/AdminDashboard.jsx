import React, { useState } from 'react';

const AdminDashboard = () => {
    // State dummy untuk simulasi pengelolaan database laporan oleh Admin
    const [laporanMasuk, setLaporanMasuk] = useState([
        { id: 'QUE-17', nama: 'Modul Arduino Uno R3 + Kabel USB', lokasi: 'Lab Sistem Tertanam & Robotika Tekkom', status: 'lost', tanggal: '18 Mei 2026', step: 1, pelapor: 'Sharon Tabitha' },
        { id: 'QUE-18', nama: 'Mouse Logitech Wireless Hitam', lokasi: 'Lab Jaringan & Keamanan Komputer Tekkom', status: 'lost', tanggal: '17 Mei 2026', step: 2, pelapor: 'Michell' },
        { id: 'QUE-19', nama: 'Modul ESP32 NodeMCU Wi-Fi', lokasi: 'Selasar Lantai 1 Gedung Teknik Komputer', status: 'found', tanggal: '14 Mei 2026', step: 3, pelapor: 'Ahmad Ridho' },
    ]);

    // State baru untuk menyimpan teks pencarian kata kunci oleh Admin
    const [searchQuery, setSearchQuery] = useState('');

    // Fungsi untuk menaikkan step alur logistik barang secara live
    const handleNextStep = (id) => {
        setLaporanMasuk(prev => prev.map(item => {
            if (item.id === id && item.step < 4) {
                return { ...item, step: item.step + 1 };
            }
            return item;
        }));
    };

    // Fungsi untuk memundurkan step alur jika ada kesalahan input
    const handlePrevStep = (id) => {
        setLaporanMasuk(prev => prev.map(item => {
            if (item.id === id && item.step > 1) {
                return { ...item, step: item.step - 1 };
            }
            return item;
        }));
    };

    // Helper untuk membaca label teks dari status angka step
    const getStepLabel = (step) => {
        switch (step) {
            case 1: return '📝 Dilaporkan';
            case 2: return '🔍 Diverifikasi';
            case 3: return '🏢 Di Loket Kamar';
            case 4: return '✅ Selesai (Arsip)';
            default: return 'Diproses';
        }
    };

    // Filter Data Berdasarkan ID Tiket atau Nama Pelapor secara Live
    const filteredLaporan = laporanMasuk.filter(item =>
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.pelapor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.nama.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container" style={{ paddingTop: '2rem' }}>
            {/* Header Dashboard */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h2>Pusat Kendali Logistik (Admin)</h2>
                <span style={{ background: '#fef2f2', color: '#ef4444', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 'bold', border: '1px solid #fca5a5' }}>
                    🔒 Akses Laboran Tekkom
                </span>
            </div>
            <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>Otorisasi pembaruan status fisik barang temuan dan verifikasi kepemilikan tiket antrean.</p>

            {/* BARU: Input Search Bar Interaktif Khusus Admin */}
            <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
                <input
                    type="text"
                    className="form-input"
                    placeholder="🔍 Cari cepat berdasarkan ID Tiket (ex: QUE-17), nama pelapor, atau nama barang..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ paddingLeft: '2.5rem', background: '#ffffff' }}
                />
                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', pointerEvents: 'none' }}>

                </span>
            </div>

            {/* TABEL MANAJEMEN BARANG */}
            <div style={{ background: '#ffffff', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                    <thead>
                        <tr style={{ background: 'var(--cream)', borderBottom: '1px solid var(--border)' }}>
                            <th style={{ padding: '1rem' }}>ID Tiket</th>
                            <th style={{ padding: '1rem' }}>Nama Barang / Pelapor</th>
                            <th style={{ padding: '1rem' }}>Lokasi / Tanggal</th>
                            <th style={{ padding: '1rem' }}>Tahapan Logistik</th>
                            <th style={{ padding: '1rem', textAlign: 'center' }}>Aksi Kendali Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLaporan.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'var(--muted)', fontStyle: 'italic' }}>
                                    ❌ Tidak ada data laporan yang cocok dengan kata kunci "{searchQuery}"
                                </td>
                            </tr>
                        ) : (
                            filteredLaporan.map((item) => (
                                <tr key={item.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                                    {/* ID TIKET */}
                                    <td style={{ padding: '1rem', fontWeight: 'bold', fontFamily: 'monospace', color: 'var(--ink)' }}>{item.id}</td>

                                    {/* NAMA BARANG & PELAPOR */}
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontWeight: '600', marginBottom: '0.2rem' }}>{item.nama}</div>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Oleh: 👤 {item.pelapor}</span>
                                    </td>

                                    {/* LOKASI & TANGGAL */}
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontSize: '0.85rem', marginBottom: '0.2rem' }}>📍 {item.lokasi}</div>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>📅 {item.tanggal}</span>
                                    </td>

                                    {/* STATUS STEP SEKARANG */}
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            display: 'inline-block', padding: '0.3rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600',
                                            background: item.step === 4 ? '#d1fae5' : 'var(--accent-light)',
                                            color: item.step === 4 ? '#065f46' : 'var(--accent-mid)'
                                        }}>
                                            {getStepLabel(item.step)}
                                        </span>
                                    </td>

                                    {/* TOMBOL AKSI KENDALI */}
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        <div style={{ display: 'inline-flex', gap: '0.3rem' }}>
                                            <button
                                                onClick={() => handlePrevStep(item.id)}
                                                disabled={item.step === 1}
                                                style={{ padding: '0.3rem 0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', cursor: item.step === 1 ? 'not-allowed' : 'pointer', fontSize: '0.8rem', opacity: item.step === 1 ? 0.5 : 1 }}
                                            >
                                                ◀ Mundur
                                            </button>
                                            <button
                                                onClick={() => handleNextStep(item.id)}
                                                disabled={item.step === 4}
                                                style={{ padding: '0.3rem 0.6rem', borderRadius: '6px', border: '1px solid var(--accent)', background: item.step === 4 ? '#cbd5e1' : 'var(--accent)', color: item.step === 4 ? '#94a3b8' : '#fff', cursor: item.step === 4 ? 'not-allowed' : 'pointer', fontSize: '0.8rem', fontWeight: '500' }}
                                            >
                                                {item.step === 3 ? 'Selesaikan ✓' : 'Maju ▶'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;