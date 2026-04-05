import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  FileText,
  Headphones,
  Cpu,
  Code,
  ExternalLink,
  BookOpen,
  Microscope,
  Satellite,
} from 'lucide-react';

const resources = [
  {
    id: 'research',
    icon: FileText,
    secondaryIcon: Microscope,
    title: 'Research Papers',
    description:
      'Access peer-reviewed publications on black hole physics, gravitational waves, and relativistic astrophysics.',
    color: 'orange',
    items: ['arXiv preprints', 'Nature Astronomy', 'Physical Review D', 'MNRAS'],
    link: '#',
  },
  {
    id: 'podcasts',
    icon: Headphones,
    secondaryIcon: BookOpen,
    title: 'Podcasts',
    description:
      'Listen to expert discussions on cosmology, black holes, and the mysteries of spacetime.',
    color: 'purple',
    items: ['Astronomy Cast', 'Star Talk', 'Physics World', 'Space Time'],
    link: '#',
  },
  {
    id: 'simulators',
    icon: Cpu,
    secondaryIcon: Satellite,
    title: 'Gravity Simulators',
    description:
      'Interactive tools to visualize gravitational fields, orbital mechanics, and spacetime curvature.',
    color: 'blue',
    items: ['Universe Sandbox', 'Space Engine', 'Celestia', 'Gravity Sim'],
    link: '#',
  },
  {
    id: 'projects',
    icon: Code,
    secondaryIcon: ExternalLink,
    title: 'Projects & Code',
    description:
      'Open-source repositories, visualization tools, and educational coding projects.',
    color: 'cyan',
    items: ['GitHub repos', 'Python notebooks', 'WebGL demos', 'Data analysis'],
    link: '#',
  },
];

const colorClasses = {
  orange: {
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    text: 'text-orange-400',
    glow: 'shadow-orange-500/20',
    gradient: 'from-orange-500 to-yellow-500',
  },
  purple: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    text: 'text-purple-400',
    glow: 'shadow-purple-500/20',
    gradient: 'from-purple-500 to-pink-500',
  },
  blue: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
    glow: 'shadow-blue-500/20',
    gradient: 'from-blue-500 to-cyan-500',
  },
  cyan: {
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    text: 'text-cyan-400',
    glow: 'shadow-cyan-500/20',
    gradient: 'from-cyan-500 to-teal-500',
  },
};

function ResourceCard({ resource, index }) {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: '-50px' });
  const Icon = resource.icon;
  const SecondaryIcon = resource.secondaryIcon;
  const colors = colorClasses[resource.color];

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.15,
        ease: [0.25, 0.4, 0.25, 1],
      }}
      whileHover={{ scale: 1.02 }}
      className="group relative h-full"
    >
      {/* Glow effect on hover */}
      <motion.div
        className={`absolute inset-0 rounded-2xl blur-2xl ${colors.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
      />

      <div
        className={`relative h-full glass-dark rounded-2xl overflow-hidden border ${colors.border} group-hover:border-opacity-60 transition-all duration-500`}
      >
        {/* Header gradient */}
        <div className={`h-2 bg-gradient-to-r ${colors.gradient}`} />

        <div className="p-8">
          {/* Icons */}
          <div className="flex items-center justify-between mb-6">
            <motion.div
              className={`p-4 rounded-xl ${colors.bg} ${colors.text}`}
              whileHover={{ rotate: 10 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Icon className="w-8 h-8" />
            </motion.div>
            <SecondaryIcon className={`w-6 h-6 ${colors.text} opacity-50`} />
          </div>

          {/* Title */}
          <h3 className={`text-2xl font-bold text-white mb-3 group-hover:${colors.text} transition-colors`}>
            {resource.title}
          </h3>

          {/* Description */}
          <p className="text-white/60 mb-6 leading-relaxed">
            {resource.description}
          </p>

          {/* Items list */}
          <div className="flex flex-wrap gap-2 mb-6">
            {resource.items.map((item, i) => (
              <span
                key={i}
                className={`px-3 py-1 rounded-full text-xs ${colors.bg} ${colors.text} border ${colors.border}`}
              >
                {item}
              </span>
            ))}
          </div>

          {/* CTA Button */}
          <motion.a
            href={resource.link}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r ${colors.gradient} text-white font-semibold text-sm group/btn`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Explore</span>
            <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
          </motion.a>
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-4 -right-4 w-32 h-32 opacity-5 group-hover:opacity-10 transition-opacity">
          <Icon className="w-full h-full" />
        </div>
      </div>
    </motion.div>
  );
}

export default function ResourceGrid() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      id="resources"
      ref={sectionRef}
      className="relative py-32 px-4 sm:px-6 lg:px-8"
    >
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-orange-900/5 to-black/0 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 glass rounded-full text-orange-400 text-sm uppercase tracking-wider mb-6">
            Explore & Learn
          </span>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
            Resource{' '}
            <span className="bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent">
              Center
            </span>
          </h2>

          <p className="text-xl text-white/60 max-w-3xl mx-auto leading-relaxed">
            Dive deeper into the cosmos with our curated collection of research
            materials, tools, and educational content.
          </p>
        </motion.div>

        {/* Resource cards grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {resources.map((resource, index) => (
            <ResourceCard key={resource.id} resource={resource} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="glass rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Can't find what you're looking for?
            </h3>
            <p className="text-white/60 mb-6">
              Our community is constantly growing. Suggest new resources or
              contribute your own findings.
            </p>
            <motion.button
              className="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white font-semibold transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Submit a Resource
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}