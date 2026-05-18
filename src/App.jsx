import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Beranda from './pages/Beranda';
import CariBarang from './pages/CariBarang';
import Lapor from './pages/Lapor';
import LaporanSaya from './pages/LaporanSaya';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [userSession, setUserSession] = useState(null);
  const [view, setView] = useState('beranda');

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
  };

  if (!userSession) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="app-layout" style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b' }}>
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