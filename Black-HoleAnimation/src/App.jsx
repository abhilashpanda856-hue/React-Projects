import React from 'react';
import BlackHoleCanvas from './components/BlackHoleCanvas';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import DefinitionSection from './components/DefinitionSection';
import ResourceGrid from './components/ResourceGrid';
import ContactSection from './components/ContactSection';

// AI in Space section
function AISpaceSection( ) {
  return (
    <section id="ai-space" className="relative py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 glass rounded-full text-blue-400 text-sm uppercase tracking-wider mb-6">
            Future Technology
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
            AI in{' '}
            <span className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
              Space Exploration
            </span>
          </h2>
          <p className="text-xl text-white/60 max-w-3xl mx-auto leading-relaxed">
            Artificial intelligence is revolutionizing our understanding of black holes
            and the cosmos, from analyzing gravitational waves to simulating spacetime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: 'Machine Learning Analysis',
              description:
                'AI algorithms process vast amounts of astronomical data to detect patterns invisible to human observation.',
              icon: '🤖',
            },
            {
              title: 'Neural Network Simulations',
              description:
                'Deep learning models simulate black hole mergers and predict gravitational wave signatures.',
              icon: '🧠',
            },
            {
              title: 'Automated Discovery',
              description:
                'AI systems autonomously identify potential black hole candidates from telescope surveys.',
              icon: '🔭',
            },
          ].map((item, index) => (
            <div
              key={index}
              className="glass-dark rounded-2xl p-8 hover:border-blue-500/30 transition-all group"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                {item.title}
              </h3>
              <p className="text-white/60">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function App() {
  return (
    <div className="relative min-h-screen bg-space-black">
      {/* 3D Background */}
      <BlackHoleCanvas />

      {/* UI Layer */}
      <div className="relative z-10">
        <Navbar />
        <main>
          <HeroSection />
          <DefinitionSection />
          <ResourceGrid />
          <AISpaceSection />
          <ContactSection />
        </main>
      </div>
    </div>
  );
}