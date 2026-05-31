import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Package, Search, Handshake, ShieldCheck, ArrowRight } from 'lucide-react';

const Beranda = ({ onNavigate }) => {
  // ---- ANIMASI TYPEWRITER ----
  const kataKunci = ['KTM.', 'Kunci Motor.', 'Dompet.', 'Flashdisk.'];
  const [text, setText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    const handleType = () => {
      const currentWord = kataKunci[wordIndex];
      if (!isDeleting) {
        setText(currentWord.substring(0, text.length + 1));
        setTypingSpeed(100);
      } else {
        setText(currentWord.substring(0, text.length - 1));
        setTypingSpeed(50);
      }
      if (!isDeleting && text === currentWord) {
        setTypingSpeed(1500);
        setIsDeleting(true);
      } else if (isDeleting && text === '') {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % kataKunci.length);
        setTypingSpeed(500);
      }
    };
    const timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, wordIndex, typingSpeed]);

  // ---- STATISTIK REAL DARI SUPABASE ----
  const [stats, setStats] = useState([
    { angka: '–', label: 'Barang Ditemukan', ikon: <Package size={24} color="#0ea5e9" /> },
    { angka: '–', label: 'Laporan Aktif', ikon: <Search size={24} color="#0ea5e9" /> },
    { angka: '–', label: 'Sukses Kembali', ikon: <Handshake size={24} color="#0ea5e9" /> },
  ]);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [
        { count: totalFound },
        { count: totalLost },
        { count: completedFound },
        { count: completedLost },
      ] = await Promise.all([
        supabase.from('found_item').select('*', { count: 'exact', head: true }),
        supabase
          .from('lost_item')
          .select('*', { count: 'exact', head: true })
          .neq('status', 'completed'),
        supabase
          .from('found_item')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'completed'),
        supabase
          .from('lost_item')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'completed'),
      ]);

      setStats([
        { angka: String(totalFound ?? 0), label: 'Barang Ditemukan', ikon: <Package size={24} color="#0ea5e9" /> },
        { angka: String(totalLost ?? 0), label: 'Laporan Aktif', ikon: <Search size={24} color="#0ea5e9" /> },
        {
          angka: String((completedFound ?? 0) + (completedLost ?? 0)),
          label: 'Sukses Kembali',
          ikon: <Handshake size={24} color="#0ea5e9" />,
        },
      ]);
    } catch (err) {
      console.error('Gagal fetch stats:', err.message);
    } finally {
      setStatsLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '3rem' }}>

      {/* SECTION HERO */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '3rem',
          alignItems: 'center',
          marginBottom: '4rem',
        }}
      >
        <div>
          <span
            style={{
              background: 'var(--accent-light)',
              color: 'var(--accent-mid)',
              padding: '0.4rem 1rem',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: '700',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <ShieldCheck size={14} /> PORTAL RESMI LOSTLYNK
          </span>

          <h1
            style={{
              fontSize: '2.8rem',
              margin: '1.2rem 0',
              lineHeight: '1.2',
              minHeight: '100px',
              letterSpacing: '-0.5px'
            }}
          >
            Temukan Kembali <br />
            <span
              style={{
                color: 'var(--accent)',
                borderRight: '3px solid var(--accent)',
                paddingRight: '6px',
              }}
            >
              {text}
            </span>
          </h1>

          <p style={{ color: 'var(--muted)', marginBottom: '2.5rem', fontSize: '1.05rem', lineHeight: '1.7' }}>
            Sistem pelaporan dan pelacakan logistik barang hilang terpadu di lingkungan Universitas Diponegoro. 
            Transparan, Cepat, dan Terpercaya.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn btn-accent" onClick={() => onNavigate('lapor')} style={{ padding: '0.8rem 1.8rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              Lapor Penemuan <ArrowRight size={18} />
            </button>
            <button className="btn btn-secondary" onClick={() => onNavigate('cari')} style={{ padding: '0.8rem 1.8rem' }}>
              Cari di Galeri
            </button>
          </div>
        </div>

        {/* Ilustrasi kanan */}
        <div
          style={{
            background: 'linear-gradient(135deg, var(--cream) 0%, #e0f2fe 100%)',
            borderRadius: '32px',
            height: '380px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: '1px solid var(--accent-light)',
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-12px)';
            e.currentTarget.style.boxShadow = '0 20px 40px rgba(14, 165, 233, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div style={{ textAlign: 'center', zIndex: 2 }}>
            <div style={{ background: '#fff', width: '80px', height: '80px', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 8px 16px rgba(0,0,0,0.05)' }}>
                <Package size={40} color="var(--accent)" />
            </div>
            <span
              style={{
                color: 'var(--ink)',
                fontWeight: '800',
                letterSpacing: '1px',
                fontSize: '1.1rem',
                display: 'block'
              }}
            >
              LOSTLYNK HUB
            </span>
            <span style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: '0.3rem', display: 'block' }}>Logistik & Verifikasi</span>
          </div>
          {/* Decorative circles */}
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(14, 165, 233, 0.05)' }} />
          <div style={{ position: 'absolute', bottom: '-40px', left: '-20px', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(14, 165, 233, 0.03)' }} />
        </div>
      </div>

      {/* SECTION STATISTIK REAL-TIME */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginBottom: '4rem',
        }}
      >
        {stats.map((item, index) => (
          <div
            key={index}
            style={{
              background: '#ffffff',
              border: '1px solid var(--border)',
              borderRadius: '20px',
              padding: '1.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent)';
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.boxShadow = '0 12px 24px rgba(14, 165, 233, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)';
            }}
          >
            <div
              style={{
                background: 'var(--accent-light)',
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {item.ikon}
            </div>
            <div>
              <h3
                style={{
                  fontSize: '2rem',
                  margin: 0,
                  fontWeight: '800',
                  color: statsLoading ? '#cbd5e1' : 'var(--ink)',
                  transition: 'color 0.3s',
                }}
              >
                {item.angka}
              </h3>
              <p
                style={{
                  margin: 0,
                  color: 'var(--muted)',
                  fontSize: '0.95rem',
                  fontWeight: '500',
                }}
              >
                {item.label}
              </p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Beranda;