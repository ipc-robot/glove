import React from 'react';
import FluidBackground from '../../components/FluidBackground';
import FloatingNav from '../../components/FloatingNav';
import PosterSection from '../../components/PosterSection';
import TitlePoster from '../../posters/v0417/TitlePoster';
import ProgressPoster from '../../posters/v0417/ProgressPoster';
import NextStepsPoster from '../../posters/v0417/NextStepsPoster';
import QAPoster from '../../posters/v0417/QAPoster';
import AgentPoster from '../../posters/v0417/AgentPoster';
import CaseStudyPoster from '../../posters/v0417/CaseStudyPoster';

function V2026_04_17() {
  return (
    <div 
      id="scroll-container"
      style={{
        width: '100%',
        height: '100vh',
        overflowY: 'auto',
        overflowX: 'hidden', /* explicitly hide horizontal */
        position: 'relative'
      }}
    >
      <FluidBackground />
      <FloatingNav />
      
      <PosterSection id="title">
        <TitlePoster />
      </PosterSection>
      <PosterSection id="progress">
        <ProgressPoster />
      </PosterSection>
      <PosterSection id="methodology">
        <AgentPoster />
      </PosterSection>
      <PosterSection id="case-study">
        <CaseStudyPoster />
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

export default V2026_04_17;
