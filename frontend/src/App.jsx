import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Beranda from './pages/Beranda';
import CariBarang from './pages/CariBarang';
import Lapor from './pages/Lapor';
import LaporanSaya from './pages/LaporanSaya';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [userSession, setUserSession] = useState(null); // Menyimpan session user { name, role }
  const [view, setView] = useState('beranda');

  // Callback penentu arah halaman setelah sukses login
  const handleLoginSuccess = (session) => {
    setUserSession(session);

    // REDIRECTION LOGIC CERDAS:
    if (session.role === 'admin') {
      setView('admin'); // Admin langsung mendarat di Dashboard Kendali Logistik
    } else {
      setView('beranda'); // Mahasiswa via SSO mendarat di Beranda Utama
    }
  };

  // Fungsi Logout untuk membersihkan session
  const handleLogout = () => {
    setUserSession(null);
    setView('beranda');
  };

  // PROTEKSI KEDUA: Jika sesi kosong, kunci tampilan dan paksa ke Halaman Login
  if (!userSession) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="app-layout" style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b' }}>
      {/* Navbar mendeteksi session aktif untuk menyembunyikan/memunculkan menu */}
      <Navbar currentView={view} onNavigate={setView} userRole={userSession.role} onLogout={handleLogout} />

      <main style={{ paddingBottom: '4rem' }}>
        {view === 'beranda' && <Beranda onNavigate={setView} />}
        {view === 'cari' && <CariBarang />}
        {view === 'lapor' && <Lapor onNavigate={setView} />}
        {view === 'laporan-saya' && <LaporanSaya />}
        {view === 'admin' && <AdminDashboard />}
      </main>
    </div>
  );
}

export default App;