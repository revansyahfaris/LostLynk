import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Daftar from './pages/Daftar';
import Beranda from './pages/Beranda';
import CariBarang from './pages/CariBarang';
import Lapor from './pages/Lapor';
import LaporanSaya from './pages/LaporanSaya';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';

function App() {
  const [userSession, setUserSession] = useState(null); // { name, role }
  const [view, setView] = useState('beranda');
  const [authView, setAuthView] = useState('login'); // 'login' or 'daftar'

  const handleLoginSuccess = (session) => {
    setUserSession(session);
    if (session.role === 'admin') {
      setView('admin');
    } else {
      setView('beranda');
    }
  };

  const handleLogout = () => {
    setUserSession(null);
    setView('beranda');
    setAuthView('login');
  };

  // Jika belum login, tampilkan halaman Login atau Daftar
  if (!userSession) {
    if (authView === 'daftar') {
      return <Daftar onNavigate={setAuthView} />;
    }
    return <Login onLoginSuccess={handleLoginSuccess} onNavigate={setAuthView} />;
  }

  return (
    <div className="app-layout" style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b' }}>
      <Navbar 
        currentView={view} 
        onNavigate={setView} 
        userRole={userSession.role} 
        onLogout={handleLogout} 
      />

      <main style={{ paddingBottom: '4rem' }}>
        {view === 'beranda' && <Beranda onNavigate={setView} />}
        {view === 'cari' && <CariBarang />}
        {view === 'lapor' && <Lapor onNavigate={setView} />}
        {view === 'laporan-saya' && <LaporanSaya />}
        {view === 'admin' && <AdminDashboard />}
        {view === 'profile' && <Profile userSession={userSession} />}
      </main>
    </div>
  );
}

export default App;