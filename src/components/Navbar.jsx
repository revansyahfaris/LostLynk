import React, { useState, useEffect, useRef } from 'react';
import { 
    Home, 
    Search, 
    Megaphone, 
    FileText, 
    User, 
    LogOut, 
    LayoutDashboard, 
    Menu, 
    X, 
    ChevronDown 
} from 'lucide-react';

const Navbar = ({ currentView, onNavigate, userRole, onLogout }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const menuRef = useRef(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMobileMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Configuration for navigation items
    const menuItems = [
        { id: 'beranda', label: 'Beranda', icon: <Home size={18} /> },
        { id: 'cari', label: 'Cari Barang', icon: <Search size={18} /> },
        { id: 'lapor', label: 'Lapor', icon: <Megaphone size={18} /> },
        { id: 'laporan-saya', label: 'Laporan Saya', icon: <FileText size={18} /> },
        { id: 'profile', label: 'Profil', icon: <User size={18} /> },
    ];

    const handleNavigate = (id) => {
        onNavigate(id);
        setIsMobileMenuOpen(false);
    };

    return (
        <nav style={{
            background: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            padding: '0.8rem 1.5rem',
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        }}>
            {/* Brand Logo */}
            <div
                onClick={() => handleNavigate(userRole === 'admin' ? 'admin' : 'beranda')}
                style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0ea5e9', cursor: 'pointer', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
                <div style={{ background: '#0ea5e9', color: '#fff', borderRadius: '8px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    🔗
                </div>
                <span>LOST<span style={{ color: '#1e293b' }}>LYNK</span></span>
            </div>

            {/* --- DESKTOP MENU --- */}
            <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                
                {userRole === 'user' && menuItems.map((item) => {
                    const isActive = currentView === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => handleNavigate(item.id)}
                            className="nav-btn-desktop"
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
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            {item.icon}
                            <span className="nav-label">{item.label}</span>
                        </button>
                    );
                })}

                {userRole === 'admin' && (
                    <button
                        onClick={() => handleNavigate('admin')}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '8px',
                            border: '1px solid #fee2e2',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            background: currentView === 'admin' ? '#fee2e2' : '#fff',
                            color: '#ef4444',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <LayoutDashboard size={18} />
                        Dashboard
                    </button>
                )}

                <div style={{ width: '1px', height: '24px', background: '#e2e8f0', margin: '0 0.5rem' }} className="nav-divider" />

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
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                >
                    <LogOut size={18} />
                    <span className="nav-label">Keluar</span>
                </button>
            </div>

            {/* --- MOBILE MENU TOGGLE --- */}
            <div className="mobile-nav-toggle" style={{ display: 'none', position: 'relative' }} ref={menuRef}>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    style={{
                        background: isMobileMenuOpen ? '#f0f9ff' : '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '10px',
                        padding: '0.5rem',
                        cursor: 'pointer',
                        color: isMobileMenuOpen ? '#0ea5e9' : '#64748b',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem'
                    }}
                >
                    {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Menu</span>
                    <ChevronDown size={14} style={{ transform: isMobileMenuOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
                </button>

                {/* MOBILE DROPDOWN */}
                {isMobileMenuOpen && (
                    <div style={{
                        position: 'absolute',
                        top: 'calc(100% + 0.5rem)',
                        right: 0,
                        background: '#fff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '16px',
                        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
                        width: '220px',
                        overflow: 'hidden',
                        animation: 'slideDown 0.2s ease-out'
                    }}>
                        <div style={{ padding: '0.5rem' }}>
                            {userRole === 'user' ? (
                                menuItems.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => handleNavigate(item.id)}
                                        style={{
                                            width: '100%',
                                            padding: '0.8rem 1rem',
                                            borderRadius: '10px',
                                            border: 'none',
                                            fontSize: '0.9rem',
                                            textAlign: 'left',
                                            background: currentView === item.id ? '#f0f9ff' : 'transparent',
                                            color: currentView === item.id ? '#0ea5e9' : '#1e293b',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.8rem',
                                            fontWeight: currentView === item.id ? '600' : '500'
                                        }}
                                    >
                                        {item.icon}
                                        {item.label}
                                    </button>
                                ))
                            ) : (
                                <button
                                    onClick={() => handleNavigate('admin')}
                                    style={{
                                        width: '100%',
                                        padding: '0.8rem 1rem',
                                        borderRadius: '10px',
                                        border: 'none',
                                        fontSize: '0.9rem',
                                        textAlign: 'left',
                                        background: currentView === 'admin' ? '#fee2e2' : 'transparent',
                                        color: currentView === 'admin' ? '#ef4444' : '#1e293b',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.8rem',
                                        fontWeight: '600'
                                    }}
                                >
                                    <LayoutDashboard size={18} />
                                    Dashboard
                                </button>
                            )}
                            
                            <div style={{ height: '1px', background: '#f1f5f9', margin: '0.4rem 0' }} />
                            
                            <button
                                onClick={onLogout}
                                style={{
                                    width: '100%',
                                    padding: '0.8rem 1rem',
                                    borderRadius: '10px',
                                    border: 'none',
                                    fontSize: '0.9rem',
                                    textAlign: 'left',
                                    background: 'transparent',
                                    color: '#ef4444',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.8rem',
                                    fontWeight: '500'
                                }}
                            >
                                <LogOut size={18} />
                                Keluar
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* CSS for responsive behavior and animations */}
            <style>{`
                @media (max-width: 850px) {
                    .desktop-nav {
                        display: none !important;
                    }
                    .mobile-nav-toggle {
                        display: block !important;
                    }
                }
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .nav-btn-desktop:hover {
                    background: #f8fafc !important;
                    color: #0ea5e9 !important;
                }
            `}</style>
        </nav>
    );
};

export default Navbar;