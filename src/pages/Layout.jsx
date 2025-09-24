

import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { Rocket, Castle, Bone } from 'lucide-react';

const themeClasses = {
  space: {
    bg: 'bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900',
    text: 'text-white',
    header: 'bg-white/10 backdrop-blur-md',
  },
  dinosaur: {
    bg: 'bg-gradient-to-br from-green-800 via-yellow-800 to-orange-900',
    text: 'text-white',
    header: 'bg-black/10 backdrop-blur-md',
  },
  magic: {
    bg: 'bg-gradient-to-br from-purple-800 via-pink-900 to-indigo-900',
    text: 'text-white',
    header: 'bg-white/10 backdrop-blur-md',
  },
  default: {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    header: 'bg-white shadow-sm',
  }
};

const ThemeIcon = ({ theme, ...props }) => {
  if (theme === 'space') return <Rocket {...props} />;
  if (theme === 'dinosaur') return <Bone {...props} />;
  if (theme === 'magic') return <Castle {...props} />;
  return null;
};

export default function Layout({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await User.me();
        setCurrentUser(user);
      } catch (e) {
        // Not logged in, or first visit
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [children]);

  const currentTheme = currentUser?.theme || 'default';
  const classes = themeClasses[currentTheme];

  if (isLoading) {
    return <div className="w-screen h-screen bg-gray-100 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className={"min-h-screen w-full font-sans transition-colors duration-500 " + classes.bg + " " + classes.text}>
      <header className={"sticky top-0 z-50 transition-colors duration-500 " + classes.header}>
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold tracking-wider">
            Maths Quest
          </div>
          {currentUser && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                <ThemeIcon theme={currentUser.theme} className="w-4 h-4" />
                <span>{currentUser.full_name}</span>
              </div>
            </div>
          )}
        </nav>
      </header>
      <main className="container mx-auto px-6 py-8">
        {React.cloneElement(children, { currentUser, setCurrentUser })}
      </main>
    </div>
  );
}

