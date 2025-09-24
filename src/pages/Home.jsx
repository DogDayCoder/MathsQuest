import React from 'react';
import { User } from '@/api/entities';
import ThemeSelector from '@/components/ThemeSelector';
import TopicMenu from '@/components/TopicMenu';
import { motion, AnimatePresence } from 'framer-motion';

export default function HomePage({ currentUser, setCurrentUser }) {
  const handleThemeSelected = async (theme) => {
    if (!currentUser) {
      try {
        await User.login(); // This will redirect, so the rest won't run.
      } catch (error) {
        console.error("Login failed", error);
        // Handle login failure if necessary
      }
    } else {
      const updatedUser = await User.update(currentUser.id, { theme });
      setCurrentUser(updatedUser);
    }
  };
  
  // This part runs after login redirect and on subsequent visits
  React.useEffect(() => {
    const checkUser = async () => {
      if (!currentUser) {
         try {
           const user = await User.me();
           setCurrentUser(user);
         } catch (e) {
           // User not logged in, wait for interaction.
         }
      }
    };
    checkUser();
  }, [currentUser, setCurrentUser]);

  return (
    <AnimatePresence mode="wait">
      {!currentUser?.theme ? (
        <motion.div
          key="theme-selector"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <ThemeSelector onThemeSelect={handleThemeSelected} currentUser={currentUser} />
        </motion.div>
      ) : (
        <motion.div
          key="topic-menu"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <TopicMenu currentUser={currentUser} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}