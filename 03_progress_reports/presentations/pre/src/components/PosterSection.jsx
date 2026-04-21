import React from 'react';

function PosterSection({ id, children }) {
  return (
    <section 
      id={id}
      style={{
        width: '100%',
        minHeight: '100vh',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        // Instead of forcing a bounding box, the section IS the page. 
        padding: '2.5rem 3vw', 
        boxSizing: 'border-box'
      }}
    >
      <div style={{
        flex: 1,
        width: '100%',
        maxWidth: '1600px', // Wide and organic container just to prevent extremes without adding visible borders
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        zIndex: 2,
      }}>
        {children}
      </div>
    </section>
  );
}

export default PosterSection;
