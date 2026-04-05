import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Sparkles } from 'lucide-react';

export default function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: [0.25, 0.4, 0.25, 1],
      },
    },
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.4)_70%)] pointer-events-none" />

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-center px-4 max-w-5xl mx-auto"
      >
        {/* Decorative element */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-center gap-2 mb-6"
        >
          <Sparkles className="w-5 h-5 text-orange-400" />
          <span className="text-sm uppercase tracking-[0.3em] text-orange-400/80">
            Beyond the Observable Universe
          </span>
          <Sparkles className="w-5 h-5 text-orange-400" />
        </motion.div>

        {/* Main heading */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl sm:text-7xl md:text-8xl font-bold leading-tight"
        >
          <span className="block text-white text-glow">Welcome to</span>
          <motion.span
            className="block bg-gradient-to-r from-orange-500 via-yellow-400 to-orange-600 bg-clip-text text-transparent"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{
              backgroundSize: '200% 200%',
            }}
          >
            The Abyss
          </motion.span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="mt-8 text-lg sm:text-xl md:text-2xl text-white/70 max-w-3xl mx-auto leading-relaxed"
        >
          Journey into the heart of cosmic mystery. Where space and time
          converge at the edge of infinity, and light itself surrenders to
          the ultimate gravitational embrace.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.button
            className="group relative px-8 py-4 bg-gradient-to-r from-orange-600 to-orange-500 rounded-full text-lg font-semibold text-white overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">Begin Your Journey</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-400"
              initial={{ x: '100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>

          <motion.button
            className="px-8 py-4 glass rounded-full text-lg font-semibold text-white/90 hover:text-white hover:bg-white/10 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Learn More
          </motion.button>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={itemVariants}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { value: '10M+', label: 'Solar Masses' },
            { value: '26K', label: 'Light Years Away' },
            { value: '∞', label: 'Time Dilation' },
            { value: '0', label: 'Escape Velocity' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              whileHover={{ scale: 1.1 }}
            >
              <div className="text-3xl md:text-4xl font-bold text-orange-400">
                {stat.value}
              </div>
              <div className="mt-2 text-sm text-white/50 uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        variants={floatingVariants}
        animate="animate"
      >
        <motion.a
          href="#event-horizon"
          onClick={(e) => {
            e.preventDefault();
            document.querySelector('#event-horizon')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="flex flex-col items-center gap-2 text-white/50 hover:text-orange-400 transition-colors cursor-pointer"
        >
          <span className="text-xs uppercase tracking-widest">Scroll Down</span>
          <ChevronDown className="w-6 h-6 animate-bounce" />
        </motion.a>
      </motion.div>
    </section>
  );
}