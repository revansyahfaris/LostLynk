import React from 'react';
import { Home, Search, Megaphone, FileText, User, LogOut, LayoutDashboard } from 'lucide-react';

const Navbar = ({ currentView, onNavigate, userRole, onLogout }) => {
    // Array konfigurasi untuk menu navigasi umum (Mahasiswa)
    const menuItems = [
        { id: 'beranda', label: 'Beranda', icon: <Home size={18} /> },
        { id: 'cari', label: 'Cari Barang', icon: <Search size={18} /> },
        { id: 'lapor', label: 'Lapor', icon: <Megaphone size={18} /> },
        { id: 'laporan-saya', label: 'Laporan Saya', icon: <FileText size={18} /> },
        { id: 'profile', label: 'Profil', icon: <User size={18} /> },
    ];

    return (
        <nav style={{
            background: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            padding: '0.8rem 1.5rem',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            gap: '1rem'
        }}>
            {/* Brand Logo Aplikasi */}
            <div
                onClick={() => onNavigate(userRole === 'admin' ? 'admin' : 'beranda')}
                style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0ea5e9', cursor: 'pointer', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
                <div style={{ background: '#0ea5e9', color: '#fff', borderRadius: '8px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    🔗
                </div>
                <span>LOST<span style={{ color: '#1e293b' }}>LYNK</span></span>
            </div>

            {/* Barisan Menu Tombol Navigasi Dinamis */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>

                {/* TAMPILKAN MENU INI HANYA JIKA USER BERPERAN SEBAGAI MAHASISWA */}
                {userRole === 'user' && menuItems.map((item) => {
                    const isActive = currentView === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            style={{
                                padding: '0.5rem 0.8rem',
                                borderRadius: '8px',
                                border: 'none',
                                fontSize: '0.85rem',
                                fontWeight: isActive ? '600' : '500',
                                background: isActive ? '#f0f9ff' : 'transparent',
                                color: isActive ? '#0ea5e9' : '#64748b',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                whiteSpace: 'nowrap',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            {item.icon}
                            {item.label}
                        </button>
                    );
                })}

                {/* TAMPILKAN TOMBOL INI HANYA JIKA USER BERPERAN SEBAGAI ADMIN */}
                {userRole === 'admin' && (
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <button
                            onClick={() => onNavigate('admin')}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '8px',
                                border: '1px solid #fee2e2',
                                fontSize: '0.85rem',
                                fontWeight: '600',
                                background: currentView === 'admin' ? '#fee2e2' : '#fff',
                                color: '#ef4444',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                             <LayoutDashboard size={18} />
                             Dashboard
                        </button>
                    </div>
                )}

                {/* Tombol Keluar / Logout Global */}
                <button
                    onClick={onLogout}
                    style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        border: 'none',
                        fontSize: '0.85rem',
                        fontWeight: '500',
                        background: '#f8fafc',
                        color: '#64748b',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                    onMouseEnter={(e) => e.target.style.color = '#ef4444'}
                    onMouseLeave={(e) => e.target.style.color = '#64748b'}
                >
                     <LogOut size={18} />
                     Keluar
                </button>
            </div>
        </nav>
    );
};

export default Navbar;