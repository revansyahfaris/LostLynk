import React from 'react';

const Navbar = ({ currentView, onNavigate, userRole, onLogout }) => {
    const menuItems = [
        { id: 'beranda', label: '🏠 Beranda' },
        { id: 'cari', label: '🔍 Cari Barang' },
        { id: 'lapor', label: '📢 Lapor Kehilangan' },
        { id: 'laporan-saya', label: '📄 Laporan Saya' },
    ];

    return (
        <nav style={{
            background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '0.8rem 2rem',
            position: 'sticky', top: 0, zIndex: 100, display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
        }}>
            <div
                onClick={() => onNavigate(userRole === 'admin' ? 'admin' : 'beranda')}
                style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0ea5e9', cursor: 'pointer', letterSpacing: '0.5px' }}
            >
                🔗 LOST<span style={{ color: '#1e293b' }}>LYNK</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>

                {userRole === 'user' && menuItems.map((item) => {
                    const isActive = currentView === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', fontSize: '0.9rem', fontWeight: isActive ? '600' : '400', background: isActive ? '#f0f9ff' : 'transparent', color: isActive ? '#0ea5e9' : '#64748b', cursor: 'pointer', transition: 'all 0.2s ease' }}
                        >
                            {item.label}
                        </button>
                    );
                })}

                {userRole === 'admin' && (
                    <button
                        onClick={() => onNavigate('admin')}
                        style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #fee2e2', fontSize: '0.9rem', fontWeight: '600', background: currentView === 'admin' ? '#fee2e2' : '#fff', color: '#ef4444', cursor: 'pointer', transition: 'all 0.2s ease' }}
                    >
                        🔒 Admin Control Dashboard
                    </button>
                )}

                <div style={{ width: '1px', height: '20px', background: '#cbd5e1', margin: '0 0.5rem' }} />

                <button onClick={onLogout} style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', fontSize: '0.9rem', fontWeight: '500', background: 'transparent', color: '#64748b', cursor: 'pointer' }} onMouseEnter={(e) => e.target.style.color = '#ef4444'} onMouseLeave={(e) => e.target.style.color = '#64748b'}>
                    🚪 Keluar
                </button>
            </div>
        </nav>
    );
};

export default Navbar;