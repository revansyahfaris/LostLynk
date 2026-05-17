import React from 'react';

const Navbar = ({ currentPage, onNavigate }) => {
    const menuItems = [
        { id: 'beranda', label: 'Beranda' },
        { id: 'cari', label: 'Cari Barang' },
        { id: 'lapor', label: 'Lapor Barang' }, // ID sudah 'lapor' agar pas dengan App.jsx
        { id: 'laporan-saya', label: 'Laporan Saya' },
    ];

    return (
        <nav style={{
            position: 'sticky',
            top: 0,
            zIndex: 100,
            background: '#ffffff', /* Latar belakang putih bersih */
            borderBottom: '1px solid var(--border)',
            padding: '0.5rem 0',
            boxShadow: '0 2px 10px rgba(14, 165, 233, 0.05)' /* Efek shadow tipis biru muda */
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '60px' }}>

                {/* Logo Brand */}
                <h2 style={{ fontSize: '1.4rem', fontWeight: '700', cursor: 'pointer', margin: 0 }} onClick={() => onNavigate('beranda')}>
                    Lost<span style={{ color: 'var(--accent)' }}>Lynk</span>
                </h2>

                {/* Menu Navigasi */}
                <div style={{ display: 'flex', gap: '2rem' }}>
                    {menuItems.map((item) => {
                        const isActive = currentPage === item.id;
                        return (
                            <span
                                key={item.id}
                                onClick={() => onNavigate(item.id)}
                                style={{
                                    cursor: 'pointer',
                                    fontSize: '0.95rem',
                                    fontWeight: isActive ? '600' : '500',
                                    color: isActive ? 'var(--accent)' : 'var(--muted)',
                                    borderBottom: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                                    padding: '0.5rem 0',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                {item.label}
                            </span>
                        );
                    })}
                </div>

                {/* Tombol Keluar */}
                <button
                    className="btn btn-secondary"
                    style={{
                        padding: '0.4rem 1.2rem',
                        fontSize: '0.85rem',
                        borderColor: 'var(--accent-light)',
                        color: 'var(--accent-mid)'
                    }}
                    onClick={() => onNavigate('login')}
                >
                    Keluar
                </button>

            </div>
        </nav>
    );
};

export default Navbar;