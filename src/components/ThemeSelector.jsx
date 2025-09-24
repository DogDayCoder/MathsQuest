
import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Bone, Castle } from 'lucide-react';

const themes = [
  { 
    name: 'Space Adventure', 
    id: 'space', 
    Icon: Rocket, 
    description: 'Explore galaxies and count the stars!',
    colors: 'from-blue-500 to-indigo-600'
  },
  { 
    name: 'Dinosaur Dig', 
    id: 'dinosaur', 
    Icon: Bone, 
    description: 'Travel back in time and measure giant fossils!',
    colors: 'from-green-500 to-yellow-600'
  },
  { 
    name: 'Magic School', 
    id: 'magic', 
    Icon: Castle, 
    description: 'Cast spells and solve enchanted equations!',
    colors: 'from-purple-500 to-pink-600'
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

export default function ThemeSelector({ onThemeSelect, currentUser }) {
  return (
    <div className="text-center">
      <h1 className="text-4xl md:text-5xl font-bold mb-4">
        Welcome, {currentUser?.full_name ? currentUser.full_name.split(' ')[0] : 'Explorer'}!
      </h1>
      <p className="text-lg md:text-xl text-white/80 mb-12">Choose your adventure to begin.</p>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {themes.map((theme) => (
          <motion.div key={theme.id} variants={itemVariants}>
            <button
              onClick={() => onThemeSelect(theme.id)}
              className={"w-full p-8 rounded-2xl bg-gradient-to-br " + theme.colors + " text-white text-left transform hover:-translate-y-2 transition-transform duration-300 shadow-lg hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-white/50"}
            >
              <theme.Icon className="w-16 h-16 mb-4 opacity-80" />
              <h2 className="text-2xl font-bold mb-2">{theme.name}</h2>
              <p className="font-light">{theme.description}</p>
            </button>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
