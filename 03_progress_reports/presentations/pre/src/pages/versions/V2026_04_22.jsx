import React from 'react';
import FluidBackground from '../../components/FluidBackground';
import FloatingNav from '../../components/FloatingNav';
import PosterSection from '../../components/PosterSection';
// Note: 之后你可以为 04-22 准备独有的 Poster 并替换这里
import TitlePoster from '../../posters/v0422/TitlePoster';
import ProgressPoster from '../../posters/v0422/ProgressPoster';
import ResultsPoster from '../../posters/v0422/ResultsPoster';
import NextStepsPoster from '../../posters/v0422/NextStepsPoster';
import QAPoster from '../../posters/v0422/QAPoster';

function V2026_04_22() {
  const v22Sections = ['title', 'progress', 'results', 'nextsteps', 'qa'];

  return (
    <div 
      id="scroll-container"
      style={{
        width: '100%',
        height: '100vh',
        overflowY: 'auto',
        overflowX: 'hidden',
        position: 'relative'
      }}
    >
      <FluidBackground />
      <FloatingNav customSections={v22Sections} />
      
      <PosterSection id="title">
        <TitlePoster />
      </PosterSection>
      <PosterSection id="progress">
        <ProgressPoster />
      </PosterSection>

      <PosterSection id="results">
        <ResultsPoster />
      </PosterSection>

      <PosterSection id="nextsteps">
        <NextStepsPoster />
      </PosterSection>
      <PosterSection id="qa">
        <QAPoster />
      </PosterSection>
    </div>
  );
}

export default V2026_04_22;
