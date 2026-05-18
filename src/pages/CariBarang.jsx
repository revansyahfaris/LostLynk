import React, { useState, useEffect } from 'react';

const CariBarang = () => {
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBarang, setSelectedBarang] = useState(null); // Melacak barang yang sedang dilihat detailnya
  const [toastMessage, setToastMessage] = useState(''); // Melacak pesan notifikasi

  // Data Dummy Komplit dengan Deskripsi, Petugas, dan Status Alur Logistik (Fokus Teknik Komputer Undip)
  const dummyData = [
    { id: 1, nama: 'Kunci Motor Honda (Gantungan Hitam)', lokasi: 'Parkiran Dekat Lab Elektro FT', status: 'found', tanggal: '17 Mei 2026', step: 3, deskripsi: 'Ditemukan kunci motor Honda dengan gantungan kain hitam bertuliskan brand. Kondisi kunci agak bengkok sedikit namun masih berfungsi.', petugas: 'Pak Bambang (Security Pos Depan FT)' },
    { id: 2, nama: 'KTM atas nama Ahmad Ridho', lokasi: 'Perpustakaan Pusat (UPT) Lantai 2', status: 'found', tanggal: '16 Mei 2026', step: 4, deskripsi: 'Kartu Tanda Mahasiswa (KTM) S1 Teknik Komputer angkatan 2024. Foto dan nomor induk mahasiswa masih terbaca sangat jelas.', petugas: 'Staf Admisi & Pelayanan UPT Perpus' },
    { id: 3, nama: 'Tumbler Biru Starbucks', lokasi: 'Gedung Widya Puraya', status: 'lost', tanggal: '15 Mei 2026', step: 1, deskripsi: 'Hilang tumbler Starbucks edisi stainless warna biru muda metalik. Terdapat sedikit goresan halus di dekat tutup botol.', petugas: 'Mandiri (Laporan Pemilik Asli)' },
    { id: 4, nama: 'Flashdisk SanDisk 32GB Merah', lokasi: 'Ruang Kelas Gedung Bersama FT', status: 'found', tanggal: '15 Mei 2026', step: 2, deskripsi: 'Flashdisk merah tanpa tutup, berisi folder data tugas-tugas kuliah Alpro, Jarkom, dan laporan praktikum.', petugas: 'Dosen Pengampu Kuliah' },
    { id: 5, nama: 'Kacamata Frame Kotak Hitam', lokasi: 'Kantin Fakultas Ekonomika dan Bisnis', status: 'lost', tanggal: '14 Mei 2026', step: 1, deskripsi: 'Kacamata minus dengan frame kotak plastik hitam pekat. Terakhir kali ditaruh di atas meja makan kantin tengah.', petugas: 'Mandiri (Laporan Pemilik Asli)' },
    { id: 6, nama: 'Dompet Kulit Coklat (Ada STNK)', lokasi: 'Area Masjid Kampus (Maskam) Undip', status: 'found', tanggal: '12 Mei 2026', step: 3, deskripsi: 'Dompet kulit pria warna coklat tua. Di dalamnya ada STNK motor, beberapa uang tunai, namun tidak ada kartu identitas lain.', petugas: 'Pengurus/Takmir Masjid Kampus' },
    { id: 7, nama: 'Charger Laptop ASUS Type-C', lokasi: 'Co-working Space Gedung ICT', status: 'lost', tanggal: '10 Mei 2026', step: 2, deskripsi: 'Adaptor charger bawaan ASUS ROG 65W kabel Type-C jalinan kain rajut hitam. Ketinggalan di meja pojok dekat jendela.', petugas: 'Mandiri (Laporan Pemilik Asli)' },
    { id: 8, nama: 'Kunci Kost (Gantungan Hello Kitty)', lokasi: 'Sekitar Lapangan Stadion Undip', status: 'found', tanggal: '09 Mei 2026', step: 3, deskripsi: 'Ditemukan dua anak kunci kost kuningan diikat bersama gantungan boneka karet kecil karakter Hello Kitty pink.', petugas: 'Petugas Kebersihan Stadion Undip' },
    { id: 9, nama: 'Modul Arduino Uno R3 + Kabel USB', lokasi: 'Lab Sistem Tertanam & Robotika Tekkom', status: 'lost', tanggal: '18 Mei 2026', step: 1, deskripsi: 'Ketinggalan setelah praktikum shift 2 selesai. Kondisi modul terpasang di dalam kotak plastik transparan akrilik.', petugas: 'Mandiri (Laporan Pemilik Asli)' },
    { id: 10, nama: 'Kabel Jumper Male-to-Female seikat', lokasi: 'Ruang Kuliah 202 Gedung Tekkom FT', status: 'found', tanggal: '18 Mei 2026', step: 3, deskripsi: 'Satu ikat kabel jumper dupont warna-warni isi sekitar 20 helai yang diikat rapi menggunakan karet gelang kuning.', petugas: 'Mbak Ana (Laboran Teknik Komputer)' },
    { id: 11, nama: 'Mouse Logitech Wireless Hitam', lokasi: 'Lab Jaringan & Keamanan Komputer Tekkom', status: 'lost', tanggal: '17 Mei 2026', step: 2, deskripsi: 'Mouse wireless logitech seri B170 warna hitam polos. Komponen USB nano-receiver mungilnya masih tertinggal di laptop saya.', petugas: 'Mandiri (Laporan Pemilik Asli)' },
    { id: 12, nama: 'Papan PCB Polos & Solder Dekko', lokasi: 'Meja Praktikum Lab Perangkat Keras Tekkom', status: 'found', tanggal: '16 Mei 2026', step: 3, deskripsi: 'Solder gagang biru merk Dekko 40W masih di dalam kemasan beserta dua keping papan PCB polos FR4 ukuran 10x10 cm.', petugas: 'Mas Koko (Asisten Praktikum Hardware)' },
    { id: 13, nama: 'Earphone TWS Baseus Putih', lokasi: 'Ruang Himpunan Mahasiswa (HM) Tekkom', status: 'lost', tanggal: '15 Mei 2026', step: 1, deskripsi: 'Charging case TWS Baseus WM01 warna putih beserta sepasang earphone di dalamnya. Ada stiker inisial nama kecil di case.', petugas: 'Mandiri (Laporan Pemilik Asli)' },
    { id: 14, nama: 'Modul ESP32 NodeMCU Wi-Fi', lokasi: 'Selasar Lantai 1 Gedung Teknik Komputer', status: 'found', tanggal: '14 Mei 2026', step: 3, deskripsi: 'Modul ESP32 development board dengan pin header yang sudah tersolder rapi. Ditemukan tergeletak di kursi tunggu selasar.', petugas: 'Mbak Ana (Laboran Teknik Komputer)' },
    { id: 15, nama: 'Buku Catatan Arsitektur Sistem Komputer', lokasi: 'Ruang Kuliah 301 Gedung Tekkom FT', status: 'lost', tanggal: '13 Mei 2026', step: 2, deskripsi: 'Buku tulis ukuran A5 sampul coklat, berisi rangkuman rumus materi kuliah Arsitektur Sistem Komputer dari pertemuan awal.', petugas: 'Mandiri (Laporan Pemilik Asli)' },
    { id: 16, nama: 'Minitripod & Modul Kamera ESP32-CAM', lokasi: 'Lab Jaringan & Sistem Digital Tekkom', status: 'found', tanggal: '11 Mei 2026', step: 4, deskripsi: 'Modul kamera ESP32-CAM terpasang pada tripod mini hitam fleksibel (gorillapod). Sudah diambil kembali oleh pemilik.', petugas: 'Mas Koko (Asisten Praktikum)' }
  ];

  // Efek memicu skeleton loading palsu setiap kali pencarian atau kategori berubah
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [search, statusFilter]);

  // Handler memicu notifikasi Toast + Membuka Modal sekaligus
  const handleAksiDetail = (item) => {
    setToastMessage(`Sukses memuat rincian data untuk: ${item.nama}`);
    setSelectedBarang(item);

    // Notifikasi hilang sendiri dari layar setelah 3 detik
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  const filteredData = dummyData.filter(item => {
    const matchesSearch = item.nama.toLowerCase().includes(search.toLowerCase()) || item.lokasi.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container" style={{ paddingTop: '2rem', position: 'relative' }}>

      {/* 🔔 FLOATING TOAST NOTIFICATION */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '20px',
          background: 'var(--accent-mid, #0ea5e9)',
          color: '#ffffff',
          padding: '0.8rem 1.5rem',
          borderRadius: '10px',
          boxShadow: '0 10px 25px rgba(14, 165, 233, 0.25)',
          zIndex: 1100,
          fontWeight: '500',
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          <span>🔔</span> {toastMessage}
        </div>
      )}

      <h2>Galeri Temuan & Kehilangan</h2>
      <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>Sistem pelacakan logistik barang hilang berbasis area Universitas Diponegoro.</p>

      {/* FILTER & SEARCH BARANAG */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
        <input
          className="form-input"
          type="text"
          placeholder="🔍 Cari nama barang atau lokasi spesifik (contoh: KTM, Lab Tekkom, Arduino...)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '100%', padding: '0.8rem 1.2rem', borderRadius: '12px', border: '1px solid var(--border)', outline: 'none', transition: 'all 0.3s ease-in-out' }}
          onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 4px rgba(14, 165, 233, 0.15)'; e.target.style.transform = 'scale(1.005)'; }}
          onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; e.target.style.transform = 'scale(1)'; }}
        />

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['all', 'found', 'lost'].map((type) => (
            <button
              key={type}
              onClick={() => setStatusFilter(type)}
              style={{
                padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s',
                background: statusFilter === type ? 'var(--accent)' : '#fff',
                color: statusFilter === type ? '#fff' : 'var(--muted)'
              }}
            >
              {type === 'all' ? '✨ Semua Barang' : type === 'found' ? '📦 Ditemukan' : '🔍 Kehilangan'}
            </button>
          ))}
        </div>
      </div>

      {/* GRID DAFTAR KARTU BARANG */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {isLoading ? (
          [1, 2, 3].map((n) => (
            <div key={n} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.2rem', height: '160px', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div className="shimmer" style={{ width: '60px', height: '20px', background: '#f1f5f9', borderRadius: '4px' }}></div>
              <div className="shimmer" style={{ width: '80%', height: '24px', background: '#e2e8f0', borderRadius: '4px' }}></div>
              <div className="shimmer" style={{ width: '50%', height: '16px', background: '#f1f5f9', borderRadius: '4px' }}></div>
            </div>
          ))
        ) : (
          filteredData.map(item => (
            <div
              key={item.id}
              style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.2rem', transition: 'all 0.2s ease', cursor: 'pointer' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(14, 165, 233, 0.08)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              onClick={() => handleAksiDetail(item)}
            >
              <span className={`badge badge-${item.status}`}>{item.status === 'found' ? 'Ditemukan' : 'Kehilangan'}</span>
              <h4 style={{ margin: '0.6rem 0 0.3rem 0' }}>{item.nama}</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '1rem' }}>📍 {item.lokasi}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', borderTop: '1px solid var(--border)', paddingTop: '0.8rem' }}>
                <span style={{ color: 'var(--muted)' }}>{item.tanggal}</span>
                <button className="btn btn-secondary" style={{ padding: '0.3rem 0.7rem', fontSize: '0.75rem' }}>Detail & Alur</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 🪟 WINDOW POPUP MODAL DETAIL + STEPPER TRACKER */}
      {selectedBarang && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(15, 23, 42, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: '#ffffff', width: '100%', maxWidth: '600px', borderRadius: '20px', padding: '2rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', animation: 'slideIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)', position: 'relative' }}>

            {/* Tombol Silang Keluar */}
            <button onClick={() => setSelectedBarang(null)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--muted)' }}>✕</button>

            <span className={`badge badge-${selectedBarang.status}`} style={{ marginBottom: '1rem' }}>{selectedBarang.status === 'found' ? 'Ditemukan' : 'Kehilangan'}</span>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>{selectedBarang.nama}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '1.5rem' }}>📍 {selectedBarang.lokasi} | 📅 {selectedBarang.tanggal}</p>

            {/* Box Isian Detail Deskripsi & Informasi Kontak */}
            <div style={{ background: 'var(--cream)', padding: '1.2rem', borderRadius: '12px', marginBottom: '1.8rem', fontSize: '0.9rem', borderLeft: '4px solid var(--accent)', lineHeight: '1.5' }}>
              <strong style={{ display: 'block', marginBottom: '0.3rem', color: 'var(--ink)' }}>🔍 Ciri-Ciri Spesifik:</strong>
              {selectedBarang.deskripsi}
              <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '0.8rem', borderTop: '1px dashed #cbd5e1', paddingTop: '0.5rem' }}>
                📌 <strong>Loket / Kontak Penanggung Jawab:</strong> {selectedBarang.petugas}
              </div>
            </div>

            {/* PROGRESS LOGISTIK TRACKER (STEPPER INTERAKTIF) */}
            <h4 style={{ marginBottom: '1rem', fontSize: '0.9rem', fontWeight: '600' }}>📌 Alur Verifikasi Logistik Barang:</h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', padding: '0 0.5rem' }}>

              {/* Garis Dasar Abu-Abu */}
              <div style={{ position: 'absolute', top: '15px', left: '20px', right: '20px', height: '3px', background: '#e2e8f0', zIndex: 1 }} />

              {/* Garis Biru Berjalan Dinamis */}
              <div style={{ position: 'absolute', top: '15px', left: '20px', width: `${((selectedBarang.step - 1) / 3) * 91}%`, height: '3px', background: 'var(--accent)', zIndex: 2, transition: 'width 0.4s ease' }} />

              {/* Pemetaan Titik Alur Bulat */}
              {['Dilaporkan', 'Diverifikasi', 'Amankan di Loket', 'Selesai'].map((label, idx) => {
                const stepNum = idx + 1;
                const isDone = stepNum <= selectedBarang.step;
                return (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 3, width: '75px' }}>
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '50%', background: isDone ? 'var(--accent)' : '#ffffff', border: isDone ? '2px solid var(--accent)' : '2px solid #cbd5e1',
                      color: isDone ? '#ffffff' : '#94a3b8', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '0.8rem', transition: 'all 0.3s'
                    }}>
                      {isDone ? '✓' : stepNum}
                    </div>
                    <span style={{ fontSize: '0.7rem', marginTop: '0.5rem', textAlign: 'center', fontWeight: isDone ? '600' : '400', color: isDone ? 'var(--ink)' : 'var(--muted)' }}>{label}</span>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default CariBarang;