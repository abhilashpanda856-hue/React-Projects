import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Circle, Atom, Zap, Target, Waves, Clock } from 'lucide-react';

const concepts = [
  {
    icon: Circle,
    title: 'Event Horizon',
    description:
      'The boundary beyond which nothing can escape—not even light. It marks the point of no return, where the escape velocity exceeds the speed of light.',
    gradient: 'from-orange-500 to-red-600',
  },
  {
    icon: Atom,
    title: 'Singularity',
    description:
      'The infinitely dense point at the center where all the mass is concentrated. Here, the laws of physics as we know them break down completely.',
    gradient: 'from-purple-500 to-pink-600',
  },
  {
    icon: Zap,
    title: 'Accretion Disk',
    description:
      'A swirling disk of superheated matter spiraling into the black hole at nearly the speed of light, emitting intense radiation across the electromagnetic spectrum.',
    gradient: 'from-yellow-500 to-orange-600',
  },
  {
    icon: Target,
    title: 'Photon Sphere',
    description:
      'A spherical region where gravity is strong enough to force photons to travel in orbits, creating a ring of light around the black hole.',
    gradient: 'from-blue-500 to-cyan-600',
  },
  {
    icon: Waves,
    title: 'Gravitational Lensing',
    description:
      'The bending of light around the black hole due to extreme gravity, creating distorted images of background stars and galaxies.',
    gradient: 'from-green-500 to-teal-600',
  },
  {
    icon: Clock,
    title: 'Time Dilation',
    description:
      'Time slows down dramatically near a black hole. An observer falling in would experience time normally, while external observers would see them freeze.',
    gradient: 'from-indigo-500 to-purple-600',
  },
];

function ConceptCard({ concept, index }) {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: '-100px' });
  const Icon = concept.icon;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.8,
        delay: index * 0.1,
        ease: [0.25, 0.4, 0.25, 1],
      }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="group relative"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative glass-dark rounded-2xl p-8 h-full hover:border-orange-500/30 transition-all duration-500">
        {/* Icon */}
        <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${concept.gradient} mb-6`}>
          <Icon className="w-8 h-8 text-white" />
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-orange-400 transition-colors">
          {concept.title}
        </h3>

        {/* Description */}
        <p className="text-white/60 leading-relaxed group-hover:text-white/80 transition-colors">
          {concept.description}
        </p>

        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden rounded-tr-2xl">
          <div className={`absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-r ${concept.gradient} opacity-20 rotate-45 group-hover:opacity-40 transition-opacity`} />
        </div>
      </div>
    </motion.div>
  );
}

export default function DefinitionSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      id="event-horizon"
      ref={sectionRef}
      className="relative py-32 px-4 sm:px-6 lg:px-8"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-purple-900/5 to-black/0 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="inline-block px-4 py-2 glass rounded-full text-orange-400 text-sm uppercase tracking-wider mb-6">
            Understanding the Abyss
          </span>
          
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
            What is a{' '}
            <span className="bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent">
              Black Hole?
            </span>
          </h2>
          
          <p className="text-xl text-white/60 max-w-3xl mx-auto leading-relaxed">
            A black hole is a region of spacetime where gravity is so intense that
            nothing—no particles, not even electromagnetic radiation such as light—can
            escape once it crosses the event horizon.
          </p>
        </motion.div>

        {/* Main definition card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative mb-20"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/30 via-purple-500/20 to-blue-500/30 rounded-3xl blur-2xl opacity-50" />
          
          <div className="relative glass rounded-3xl p-8 md:p-12 overflow-hidden">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-3xl font-bold text-white mb-6">
                  Born from Stellar Death
                </h3>
                <p className="text-white/70 leading-relaxed mb-6">
                  Black holes form when massive stars exhaust their nuclear fuel and collapse
                  under their own gravity. The core implodes to form an infinitely dense point
                  called a singularity, surrounded by an event horizon.
                </p>
                <p className="text-white/70 leading-relaxed">
                  There are different types: stellar black holes (formed from collapsed stars),
                  supermassive black holes (found at galaxy centers), intermediate black holes,
                  and theoretically, primordial black holes from the early universe.
                </p>
              </div>
              
              <div className="relative h-64 md:h-full min-h-[300px]">
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Animated rings */}
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute border border-orange-500/30 rounded-full"
                      style={{
                        width: `${(i + 1) * 60}px`,
                        height: `${(i + 1) * 60}px`,
                      }}
                      animate={{
                        rotate: 360,
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        rotate: {
                          duration: 10 + i * 5,
                          repeat: Infinity,
                          ease: 'linear',
                        },
                        scale: {
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.2,
                        },
                      }}
                    />
                  ))}
                  
                  {/* Center black hole */}
                  <div className="w-16 h-16 rounded-full bg-black border-2 border-orange-500 shadow-lg shadow-orange-500/50" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Concept cards grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {concepts.map((concept, index) => (
            <ConceptCard key={concept.title} concept={concept} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}