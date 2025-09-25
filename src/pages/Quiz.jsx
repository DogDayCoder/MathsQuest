
import React, { useState, useEffect } from 'react';
import { Question, User } from '@/api/entities';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';
import { Lightbulb, CheckCircle, XCircle, Home } from 'lucide-react';

const themes = {
  space: { primary: 'bg-indigo-500', secondary: 'bg-purple-500', text: 'text-white' },
  dinosaur: { primary: 'bg-green-600', secondary: 'bg-yellow-600', text: 'text-white' },
  magic: { primary: 'bg-purple-600', secondary: 'bg-pink-600', text: 'text-white' },
};

export default function QuizPage({ currentUser, setCurrentUser }) {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const topicSlug = searchParams.get('topicSlug');
  const topicName = searchParams.get('topicName');

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const theme = currentUser?.theme || 'space';
  const themeStyle = themes[theme];

  useEffect(() => {
    if (!topicSlug || !theme) return;

    const fetchQuestions = async () => {
      setIsLoading(true);
      const allQuestions = await Question.filter({ topic_slug: topicSlug, theme: theme });
      setQuestions(allQuestions.sort(() => 0.5 - Math.random()).slice(0, 5)); // Get 5 random questions
      setIsLoading(false);
    };

    fetchQuestions();
  }, [topicSlug, theme]);

  const handleOptionSelect = (index) => {
    if (selectedOption !== null) return;

    setSelectedOption(index);
    const correct = index === questions[currentQuestionIndex].correct_option_index;
    setIsCorrect(correct);
    if (correct) {
      setScore(score + 1);
    }
  };
  
  const handleNextQuestion = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setIsCorrect(null);
      setShowHint(false);
    } else {
      // Quiz finished
      const progressData = currentUser.progress || {};
      // Assuming we'll store progress by topicSlug now as well
      progressData[topicSlug] = {
          score: score,
          total: questions.length,
          last_attempt: new Date().toISOString()
      };
      await User.update(currentUser.id, { progress: progressData });
      setQuizFinished(true);
    }
  };
  
  if (isLoading) {
    return <div className="text-center text-xl font-bold">Summoning questions...</div>;
  }
  
  if (questions.length === 0 && !isLoading) {
    return (
        <div className="text-center p-8 bg-white/10 rounded-xl">
            <h2 className="text-2xl font-bold mb-4">No questions found!</h2>
            <p className="mb-6">It seems the scroll for this topic is still being written. Please check back later or try another topic.</p>
            <Button onClick={() => navigate(createPageUrl('Home'))}>Back to Topics</Button>
        </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progressPercentage = (currentQuestionIndex / questions.length) * 100;

  if (quizFinished) {
      return (
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center bg-white/20 p-10 rounded-2xl shadow-lg">
              <h1 className="text-5xl font-black mb-4">Quest Complete!</h1>
              <p className="text-2xl mb-2">You scored</p>
              <p className="text-6xl font-bold mb-8">{score} / {questions.length}</p>
              <p className="text-lg mb-8">Well done, brave adventurer!</p>
              <Link to={createPageUrl('Home')}>
                  <Button size="lg" className={themeStyle.primary + ' hover:' + themeStyle.secondary + ' ' + themeStyle.text + ' gap-2'}>
                      <Home />
                      Return to Map
                  </Button>
              </Link>
          </motion.div>
      )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold">{topicName} Practice</h1>
            <span className="font-semibold">{currentQuestionIndex + 1} / {questions.length}</span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-black/20 rounded-full h-2.5 mb-8">
            <motion.div className={themeStyle.primary + " h-2.5 rounded-full"} style={{ width: progressPercentage + '%' }} animate={{ width: ((currentQuestionIndex / questions.length) * 100) + '%'}}></motion.div>
        </div>
      
      <AnimatePresence mode="wait">
        <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="bg-white/10 p-8 rounded-2xl shadow-lg"
        >
            <p className="text-2xl md:text-3xl font-semibold mb-8 min-h-[100px]">{currentQuestion.question_text}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQuestion.options.map((option, index) => {
                const isSelected = selectedOption === index;
                let buttonClass = 'bg-white/10 hover:bg-white/20';
                if (isSelected) {
                    buttonClass = isCorrect ? 'bg-green-500' : 'bg-red-500';
                } else if (selectedOption !== null && index === currentQuestion.correct_option_index) {
                    buttonClass = 'bg-green-500';
                }

                return (
                <motion.button
                    key={index}
                    onClick={() => handleOptionSelect(index)}
                    disabled={selectedOption !== null}
                    className={"p-6 rounded-xl text-xl font-bold transition-all duration-300 w-full text-left " + buttonClass}
                    whileHover={{ scale: selectedOption === null ? 1.05 : 1 }}
                >
                    {option}
                </motion.button>
                );
            })}
            </div>

            <div className="mt-8 min-h-[80px] flex justify-between items-center">
                {selectedOption !== null ? (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-xl font-bold">
                        {isCorrect ? <CheckCircle className="text-green-400"/> : <XCircle className="text-red-400" />}
                        <span>{isCorrect ? 'Correct!' : 'Not quite...'}</span>
                    </motion.div>
                ) : (
                    <Button variant="ghost" onClick={() => setShowHint(!showHint)} className="flex items-center gap-2">
                        <Lightbulb className="w-5 h-5" /> Show Hint
                    </Button>
                )}

                {selectedOption !== null && (
                    <Button onClick={handleNextQuestion} size="lg" className={themeStyle.primary + " hover:" + themeStyle.secondary + " " + themeStyle.text}>
                        {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quest'}
                    </Button>
                )}
            </div>

            <AnimatePresence>
            {showHint && selectedOption === null && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-4 p-4 bg-black/20 rounded-lg text-white/80">
                    <p>{currentQuestion.hint}</p>
                </motion.div>
            )}
            </AnimatePresence>

        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
