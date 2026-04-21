import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PresentationHub from './pages/PresentationHub';
import V2026_04_17 from './pages/versions/V2026_04_17';
import V2026_04_22 from './pages/versions/V2026_04_22';

function App() {
  return (
    <Routes>
      <Route path="/" element={<PresentationHub />} />
      <Route path="/2026-04-17" element={<V2026_04_17 />} />
      <Route path="/2026-04-22" element={<V2026_04_22 />} />
    </Routes>
  );
}

export default App;
