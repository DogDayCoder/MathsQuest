
import React, { useState, useEffect } from 'react';
import { Topic } from '@/api/entities';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { X, Divide, Pentagon, Plus, Minus, HelpCircle } from 'lucide-react';

const iconMap = {
  X,
  Divide,
  Pentagon,
  Plus,
  Minus,
  HelpCircle,
};

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

export default function TopicMenu({ currentUser }) {
  const [topics, setTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTopics = async () => {
      setIsLoading(true);
      const topicList = await Topic.list();
      setTopics(topicList);
      setIsLoading(false);
    };
    fetchTopics();
  }, []);

  return (
    <div>
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">Choose a Topic</h1>
      <p className="text-lg md:text-xl text-white/80 mb-12 text-center">What would you like to practice today?</p>
      
      {isLoading ? (
        <div className="text-center">Loading topics...</div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {topics.map((topic) => {
            const Icon = iconMap[topic.icon] || HelpCircle;
            return (
              <motion.div key={topic.id} variants={itemVariants}>
                <Link to={createPageUrl(`Quiz?topicId=${topic.id}&topicName=${topic.name}`)}>
                  <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl h-full flex flex-col justify-between transform hover:-translate-y-1 transition-transform duration-300 hover:bg-white/20">
                    <div>
                      <Icon className="w-12 h-12 mb-4 text-white/80" />
                      <h3 className="text-2xl font-bold mb-2">{topic.name}</h3>
                      <p className="text-white/70 text-sm">{topic.description}</p>
                    </div>
                     <div className="text-right mt-4 font-semibold text-sm opacity-90">
                        Start Learning →
                      </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
