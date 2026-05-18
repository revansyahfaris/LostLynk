import React, { useState } from 'react';

const AdminDashboard = () => {
    // 1. STATE DATABASE (READ & UPDATE)
    const [laporanMasuk, setLaporanMasuk] = useState([
        { id: 'QUE-17', nama: 'Modul Arduino Uno R3 + Kabel USB', lokasi: 'Lab Sistem Tertanam & Robotika Tekkom', status: 'lost', tanggal: '18 Mei 2026', step: 1, pelapor: 'Sharon Tabitha', isDeleted: false },
        { id: 'QUE-18', nama: 'Mouse Logitech Wireless Hitam', lokasi: 'Lab Jaringan & Keamanan Komputer Tekkom', status: 'lost', tanggal: '17 Mei 2026', step: 2, pelapor: 'Michell', isDeleted: false },
        { id: 'QUE-19', nama: 'Modul ESP32 NodeMCU Wi-Fi', lokasi: 'Selasar Lantai 1 Gedung Teknik Komputer', status: 'found', tanggal: '14 Mei 2026', step: 3, pelapor: 'Ahmad Ridho', isDeleted: false },
        { id: 'QUE-20', nama: 'Kabel VGA ke HDMI Warna Hitam', lokasi: 'Ruang Kuliah E.102 Ruang Teori', status: 'found', tanggal: '18 Mei 2026', step: 1, pelapor: 'Dosen RPL', isDeleted: false },
        { id: 'QUE-21', nama: 'Charger Laptop ASUS ROG 150W', lokasi: 'Lab Pemrograman & Rekayasa Perangkat Lunak', status: 'lost', tanggal: '16 Mei 2026', step: 2, pelapor: 'Faris Revansyah', isDeleted: false },

        // KELOMPOK 2: BARANG PRIBADI & AKSESORIS (SERING TERCECER)
        { id: 'QUE-22', nama: 'Kacamata Minus Frame Kotak Hitam', lokasi: 'Toilet Lantai 2 Gedung Tekkom', status: 'lost', tanggal: '15 Mei 2026', step: 1, pelapor: 'Anindya Putri', isDeleted: false },
        { id: 'QUE-23', nama: 'Tumbler Corkcicle Warna Pink Pastel', lokasi: 'Ruang Kuliah E.201 Kelas Utama', status: 'lost', tanggal: '18 Mei 2026', step: 2, pelapor: 'Siti Aminah', isDeleted: false },
        { id: 'QUE-24', nama: 'Flashdisk Sandisk Ultra 32GB Merah', lokasi: 'Meja Komputer Lab Jaringan', status: 'found', tanggal: '13 Mei 2026', step: 4, pelapor: 'Asisten Lab', isDeleted: false },
        { id: 'QUE-25', nama: 'Pouch Kosmetik Motif Hello Kitty', lokasi: 'Selasar Lantai 3 Gedung Tekkom', status: 'lost', tanggal: '17 Mei 2026', step: 1, pelapor: 'Dian Lestari', isDeleted: false },
        { id: 'QUE-26', nama: 'Dompet Kulit Coklat (Ada KTM Undip)', lokasi: 'Kantin Belakang Gedung Teknik Komputer', status: 'found', tanggal: '12 Mei 2026', step: 3, pelapor: 'Pak Satpam', isDeleted: false },

        // KELOMPOK 3: ATK & PERLENGKAPAN KULIAH
        { id: 'QUE-27', nama: 'Binder Catatan Kuliah A5 Cream Girly', lokasi: 'Ruang Kuliah E.101', status: 'lost', tanggal: '18 Mei 2026', step: 1, pelapor: 'Amanda Rezky', isDeleted: false },
        { id: 'QUE-28', nama: 'Powerbank Baseus 20.000 mAh Hitam', lokasi: 'Lab Arsitektur & Digital Komputer', status: 'found', tanggal: '15 Mei 2026', step: 2, pelapor: 'Budi Raharjo', isDeleted: false },
        { id: 'QUE-29', nama: 'Headphone JBL Tune 510BT Biru', lokasi: 'Selasar Tangga Darurat Lantai 2', status: 'lost', tanggal: '11 Mei 2026', step: 3, pelapor: 'Gilang Permana', isDeleted: false },

        // KELOMPOK 4: DATA YANG SUDAH DI-SOFT DELETE (MASUK KERANJANG SAMPAH ADMIN)
        { id: 'QUE-30', nama: 'Uang Tunai Rp 50.000 (Laporan Duplikat)', lokasi: 'Depan Ruang Dosen', status: 'found', tanggal: '10 Mei 2026', step: 1, pelapor: 'Seseorang', isDeleted: true },
        { id: 'QUE-31', nama: 'Kunci Motor Honda Vario (Sudah Diambil Luar Sistem)', lokasi: 'Parkiran Motor Utama Tekkom', status: 'lost', tanggal: '09 Mei 2026', step: 4, pelapor: 'Rian Hidayat', isDeleted: true }
    ]);

    const [searchQuery, setSearchQuery] = useState('');
    const [currentTab, setCurrentTab] = useState('aktif'); // 'aktif' atau 'trash'

    // State untuk form Tambah Data Baru (CREATE)
    const [showForm, setShowForm] = useState(false);
    const [newNama, setNewNama] = useState('');
    const [newPelapor, setNewPelapor] = useState('');
    const [newLokasi, setNewLokasi] = useState('Lab Sistem Tertanam & Robotika Tekkom');
    const [newStatus, setNewStatus] = useState('lost');

    // === 2. FUNGSI CRUD LOGIC ===

    // CREATE: Menambahkan laporan langsung dari sisi Admin
    const handleCreate = (e) => {
        e.preventDefault();
        if (!newNama || !newPelapor) return alert('Nama barang dan pelapor wajib diisi!');

        const newTicket = {
            id: `QUE-${Math.floor(Math.random() * 90) + 20}`, // Generate ID acak
            nama: newNama,
            lokasi: newLokasi,
            status: newStatus,
            tanggal: '18 Mei 2026',
            step: 1,
            pelapor: newPelapor,
            isDeleted: false
        };

        setLaporanMasuk([newTicket, ...laporanMasuk]);
        setShowForm(false);
        setNewNama('');
        setNewPelapor('');
    };

    // UPDATE: Mengatur tahapan logistik
    const handleNextStep = (id) => {
        setLaporanMasuk(prev => prev.map(item => (item.id === id && item.step < 4 ? { ...item, step: item.step + 1 } : item)));
    };
    const handlePrevStep = (id) => {
        setLaporanMasuk(prev => prev.map(item => (item.id === id && item.step > 1 ? { ...item, step: item.step - 1 } : item)));
    };

    // SOFT DELETE: Menyembunyikan data dari tabel aktif ke tempat sampah
    const handleSoftDelete = (id) => {
        setLaporanMasuk(prev => prev.map(item => (item.id === id ? { ...item, isDeleted: true } : item)));
    };

    // RESTORE: Mengembalikan data dari soft delete ke aktif kembali
    const handleRestore = (id) => {
        setLaporanMasuk(prev => prev.map(item => (item.id === id ? { ...item, isDeleted: false } : item)));
    };

    // HARD DELETE: Menghapus data secara permanen mutlak dari database
    const handleHardDelete = (id) => {
        if (window.confirm('Peringatan! Data ini akan dihapus permanen dari basis data sistem. Lanjutkan?')) {
            setLaporanMasuk(prev => prev.filter(item => item.id !== id));
        }
    };

    const getStepLabel = (step) => {
        switch (step) {
            case 1: return '📝 Dilaporkan';
            case 2: return '🔍 Diverifikasi';
            case 3: return '🏢 Di Loket';
            case 4: return '✅ Selesai';
            default: return 'Diproses';
        }
    };

    // Filter Data berdasarkan Tab (Aktif vs Terhapus/Trash) dan Kata Kunci Pencarian
    const visibleLaporan = laporanMasuk.filter(item => {
        const matchesTab = currentTab === 'aktif' ? !item.isDeleted : item.isDeleted;
        const matchesSearch = item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.pelapor.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.nama.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    return (
        <div className="container" style={{ paddingTop: '2rem' }}>
            {/* Header Dashboard */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h2>Pusat Kendali Logistik (Admin CRUD)</h2>
                <button className="btn btn-accent" onClick={() => setShowForm(!showForm)}>
                    {showForm ? '✖ Tutup Form' : '➕ Tambah Laporan Manual'}
                </button>
            </div>
            <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>Manajemen Basis Data Barang Hilang & Ditemukan .</p>

            {/* FORM CREATE DATA (MUNCUL JIKA TOMBOL DIKLIK) */}
            {showForm && (
                <form onSubmit={handleCreate} style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
                    <div className="form-group">
                        <label className="form-label">Nama Barang</label>
                        <input className="form-input" type="text" placeholder="Contoh: Flashdisk Sandisk" value={newNama} onChange={e => setNewNama(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Nama Pelapor / Mahasiswa</label>
                        <input className="form-input" type="text" placeholder="Contoh: Sharon" value={newPelapor} onChange={e => setNewPelapor(e.target.value)} />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ height: '42px', marginBottom: '1rem' }}>Simpan Ke Sistem</button>
                </form>
            )}

            {/* FILTER TAB STATUS DATABASE */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
                <button onClick={() => setCurrentTab('aktif')} style={{ padding: '0.5rem 1rem', background: 'none', border: 'none', cursor: 'pointer', fontWeight: currentTab === 'aktif' ? 'bold' : 'normal', color: currentTab === 'aktif' ? 'var(--accent)' : 'var(--muted)', borderBottom: currentTab === 'aktif' ? '2px solid var(--accent)' : 'none' }}>
                    📂 Antrean Laporan Aktif ({laporanMasuk.filter(i => !i.isDeleted).length})
                </button>
                <button onClick={() => setCurrentTab('trash')} style={{ padding: '0.5rem 1rem', background: 'none', border: 'none', cursor: 'pointer', fontWeight: currentTab === 'trash' ? 'bold' : 'normal', color: currentTab === 'trash' ? '#ef4444' : 'var(--muted)', borderBottom: currentTab === 'trash' ? '2px solid #ef4444' : 'none' }}>
                    🗑️ Keranjang Sampah / Soft Deleted ({laporanMasuk.filter(i => i.isDeleted).length})
                </button>
            </div>

            {/* SEARCH BAR */}
            <div style={{ marginBottom: '1.5rem' }}>
                <input type="text" className="form-input" placeholder="🔍 Cari cepat data di tab ini..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </div>

            {/* TABEL DATA */}
            <div style={{ background: '#ffffff', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                    <thead>
                        <tr style={{ background: 'var(--cream)', borderBottom: '1px solid var(--border)' }}>
                            <th style={{ padding: '1rem' }}>ID Tiket</th>
                            <th style={{ padding: '1rem' }}>Nama Barang / Pelapor</th>
                            <th style={{ padding: '1rem' }}>Tahapan Logistik</th>
                            <th style={{ padding: '1rem', textAlign: 'center' }}>Aksi Manajemen CRUD</th>
                        </tr>
                    </thead>
                    <tbody>
                        {visibleLaporan.length === 0 ? (
                            <tr>
                                <td colSpan="4" style={{ padding: '3rem', textAlign: 'center', color: 'var(--muted)', fontStyle: 'italic' }}>Tidak ada data laporan di sini.</td>
                            </tr>
                        ) : (
                            visibleLaporan.map((item) => (
                                <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '1rem', fontWeight: 'bold', fontFamily: 'monospace' }}>{item.id}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontWeight: '600' }}>{item.nama}</div>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>👤 {item.pelapor}</span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{ display: 'inline-block', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '600', background: 'var(--accent-light)', color: 'var(--accent-mid)' }}>
                                            {getStepLabel(item.step)}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        {currentTab === 'aktif' ? (
                                            /* AKSI JIKA DATA AKTIF */
                                            <div style={{ display: 'inline-flex', gap: '0.3rem' }}>
                                                <button onClick={() => handlePrevStep(item.id)} disabled={item.step === 1} style={{ padding: '0.3rem 0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer', fontSize: '0.8rem' }}>◀</button>
                                                <button onClick={() => handleNextStep(item.id)} disabled={item.step === 4} style={{ padding: '0.3rem 0.5rem', borderRadius: '6px', border: '1px solid var(--accent)', background: 'var(--accent)', color: '#fff', cursor: 'pointer', fontSize: '0.8rem' }}>▶</button>
                                                <button onClick={() => handleSoftDelete(item.id)} style={{ padding: '0.3rem 0.5rem', borderRadius: '6px', border: '1px solid #fca5a5', background: '#fef2f2', color: '#ef4444', cursor: 'pointer', fontSize: '0.8rem' }}>🗑️ Batalkan</button>
                                            </div>
                                        ) : (
                                            /* AKSI JIKA DATA DI KERANJANG (TRASH) */
                                            <div style={{ display: 'inline-flex', gap: '0.3rem' }}>
                                                <button onClick={() => handleRestore(item.id)} style={{ padding: '0.3rem 0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#e0f2fe', color: '#0369a1', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '500' }}>♻️ Pulihkan</button>
                                                <button onClick={() => handleHardDelete(item.id)} style={{ padding: '0.3rem 0.5rem', borderRadius: '6px', border: 'none', background: '#dc2626', color: '#fff', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '500' }}>🔥 Hapus Permanen</button>
                                            </div>
                                        )}
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