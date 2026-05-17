import React from 'react';

const Footer = () => {
  return (
    <footer style={{ background: 'var(--black)', color: '#94a3b8', padding: '2rem 0', fontSize: '0.85rem', marginTop: 'auto' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p>© 2026 LostLynk Universitas Diponegoro.</p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <span style={{ cursor: 'pointer' }}>Bantuan</span>
          <span style={{ cursor: 'pointer' }}>Ketentuan Layanan</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;