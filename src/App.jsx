import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login';
import Beranda from './pages/Beranda';
import CariBarang from './pages/CariBarang';
import LaporBarang from './pages/Lapor'; // Sesuai nama filemu di folder: Lapor.jsx
import LaporanSaya from './pages/LaporanSaya';

const App = () => {
  const [currentPage, setCurrentPage] = useState('login'); 

  const navigateTo = (pageName) => {
    setCurrentPage(pageName);
    window.scrollTo(0, 0); 
  };

  if (currentPage === 'login') {
    return <Login onLogin={() => navigateTo('beranda')} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar currentPage={currentPage} onNavigate={navigateTo} />
      
      <main style={{ flex: 1, paddingBottom: '3rem' }}>
        {currentPage === 'beranda' && <Beranda onNavigate={navigateTo} />}
        {currentPage === 'cari' && <CariBarang />}
        {currentPage === 'lapor' && <LaporBarang onNavigate={navigateTo} />}
        {currentPage === 'laporan-saya' && <LaporanSaya />}
      </main>

      <Footer />
    </div>
  );
};

export default App;