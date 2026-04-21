import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const FloatingNav = ({ customSections }) => {
  const defaultSections = ['title', 'progress', 'methodology', 'case-study', 'nextsteps', 'qa'];
  const sections = customSections || defaultSections;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let timeoutId;
    const handleScroll = (e) => {
      const scrollPos = e.target.scrollTop;
      const windowHeight = window.innerHeight;
      const index = Math.round(scrollPos / windowHeight);
      setActiveIndex(Math.min(Math.max(index, 0), sections.length - 1));
      
      // Auto-expand gracefully while scrolling
      setIsHovered(true);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsHovered(false);
      }, 1500);
    };
    
    const container = document.getElementById('scroll-container');
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => {
        container.removeEventListener('scroll', handleScroll);
        clearTimeout(timeoutId);
      };
    }
  }, [sections]);

  const scrollToIndex = (index) => {
    if (index >= 0 && index < sections.length) {
      const el = document.getElementById(sections[index]);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        setActiveIndex(index);
      }
    }
  };

  return (
    <div 
      className="glass-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'fixed',
        right: '2rem',
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isHovered ? '1.2rem 0.6rem' : '0',
        borderRadius: '50px',
        zIndex: 100,
        height: isHovered ? 'auto' : '60px',
        width: isHovered ? 'auto' : '10px',
        opacity: isHovered ? 1 : 0.5,
        overflow: 'hidden',
        transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        cursor: isHovered ? 'auto' : 'pointer'
      }}
    >
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.8rem',
        opacity: isHovered ? 1 : 0,
        transform: isHovered ? 'scale(1)' : 'scale(0.8)',
        transition: 'all 0.3s ease',
        pointerEvents: isHovered ? 'auto' : 'none'
      }}>
        <button 
          onClick={() => navigate('/')}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            opacity: 0.8, transition: 'all 0.3s',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '0.4rem', color: '#0f172a'
          }}
          title="Home"
          onMouseEnter={(e) => e.currentTarget.style.color = '#2563eb'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#0f172a'}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        </button>

        <div style={{ width: '100%', height: '1px', background: 'rgba(15, 23, 42, 0.1)', marginBottom: '0.4rem' }}></div>

        <button 
          onClick={() => scrollToIndex(activeIndex - 1)}
          disabled={activeIndex === 0}
          style={{
            background: 'none', border: 'none', cursor: activeIndex === 0 ? 'default' : 'pointer',
            opacity: activeIndex === 0 ? 0.3 : 0.8, transition: 'all 0.3s',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '0.5rem'
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="18 15 12 9 6 15"></polyline>
          </svg>
        </button>

        {sections.map((id, index) => (
          <button
            key={id}
            onClick={() => scrollToIndex(index)}
            style={{
              width: '10px',
              height: activeIndex === index ? '24px' : '10px',
              borderRadius: '10px',
              background: activeIndex === index ? '#2563eb' : 'rgba(15, 23, 42, 0.2)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: activeIndex === index ? '0 0 10px rgba(37, 99, 235, 0.5)' : 'none',
            }}
            title={id}
          />
        ))}

        <button 
          onClick={() => scrollToIndex(activeIndex + 1)}
          disabled={activeIndex === sections.length - 1}
          style={{
            background: 'none', border: 'none', cursor: activeIndex === sections.length - 1 ? 'default' : 'pointer',
            opacity: activeIndex === sections.length - 1 ? 0.3 : 0.8, transition: 'all 0.3s',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginTop: '0.5rem'
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default FloatingNav;
