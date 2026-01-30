'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircledIcon, CrossCircledIcon } from '@radix-ui/react-icons';

export default function QuizTakePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/quizzes/${params.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setQuiz(data);
          setTimeRemaining(data.timeLimit * 60); // Convert minutes to seconds
        } else {
          console.error('Failed to fetch quiz');
        }
      } catch (error) {
        console.error('Error fetching quiz:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [params.id]);

  useEffect(() => {
    if (quizStarted && timeRemaining > 0 && !quizSubmitted) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [quizStarted, timeRemaining, quizSubmitted]);

  const handleSubmit = async () => {
    if (quizSubmitted) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/quizzes/${params.id}/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers }),
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data);
        setQuizSubmitted(true);
        
        // Fetch leaderboard after submission
        fetchLeaderboard();
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/quizzes/${params.id}/leaderboard?limit=10`);
      if (response.ok) {
        const data = await response.json();
        setLeaderboard(data);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-500">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold mb-2">Quiz not found</h3>
          <button
            onClick={() => router.push('/dashboard')}
            className="mt-4 px-6 py-2 bg-primary text-white rounded-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="p-8 max-w-3xl mx-auto">
        <div className="card">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold mb-2">{quiz.title}</h1>
            <p className="text-muted-text">{quiz.description}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <p className="text-2xl font-bold text-primary">{quiz.questions?.length || 0}</p>
              <p className="text-sm text-muted-text">Questions</p>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <p className="text-2xl font-bold text-primary">{quiz.timeLimit}</p>
              <p className="text-sm text-muted-text">Minutes</p>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <p className="text-2xl font-bold text-primary">{quiz.totalMarks || quiz.questions?.length || 0}</p>
              <p className="text-sm text-muted-text">Total Marks</p>
            </div>
          </div>

          <div className="space-y-3 mb-6 text-sm">
            <div className="flex items-start gap-2">
              <CheckCircledIcon className="w-5 h-5 text-green-500 mt-0.5" />
              <p>You can navigate between questions using the navigation buttons</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircledIcon className="w-5 h-5 text-green-500 mt-0.5" />
              <p>Timer will start once you begin the quiz</p>
            </div>
            <div className="flex items-start gap-2">
              <CrossCircledIcon className="w-5 h-5 text-red-500 mt-0.5" />
              <p>Quiz will auto-submit when time runs out</p>
            </div>
          </div>

          <button
            onClick={() => setQuizStarted(true)}
            className="w-full btn btn-primary py-3 text-lg"
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  if (quizSubmitted && result) {
    return (
      <div className="p-8 max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Results Card */}
          <div className="card text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl font-bold mb-2">Quiz Completed!</h1>
            <p className="text-muted-text mb-6">Your answers have been recorded</p>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-3xl font-bold text-green-600">{result.score || 0}</p>
                <p className="text-sm text-muted-text">Your Score</p>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-3xl font-bold text-blue-600">{result.correctAnswers || 0}/{quiz.questions?.length || 0}</p>
                <p className="text-sm text-muted-text">Correct</p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <p className="text-3xl font-bold text-purple-600">{result.percentage || 0}%</p>
                <p className="text-sm text-muted-text">Accuracy</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => router.push('/dashboard/quizzes')}
                className="flex-1 btn btn-outline"
              >
                More Quizzes
              </button>
              <button
                onClick={() => router.push('/dashboard/leaderboard')}
                className="flex-1 btn btn-primary"
              >
                View Global Leaderboard
              </button>
            </div>
          </div>

          {/* Quiz Leaderboard */}
          <div className="card">
            <div className="p-4 border-b border-border">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span>🏆</span>
                Quiz Leaderboard
              </h2>
              <p className="text-sm text-muted-text">Top performers in this quiz</p>
            </div>
            <div className="p-4">
              {leaderboard.length === 0 ? (
                <p className="text-center text-muted-text py-8">Be the first to take this quiz!</p>
              ) : (
                <div className="space-y-3">
                  {leaderboard.map((entry, index) => (
                    <div
                      key={entry.userId}
                      className={`flex items-center gap-3 p-3 rounded-lg ${
                        index < 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20' : 'bg-muted/50'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        index === 0 ? 'bg-yellow-500 text-white' :
                        index === 1 ? 'bg-gray-400 text-white' :
                        index === 2 ? 'bg-amber-700 text-white' :
                        'bg-gray-200 text-gray-600'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                        {entry.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{entry.name}</p>
                        <p className="text-xs text-muted-text">{entry.percentage.toFixed(1)}% • {entry.timeTaken}s</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-blue-600">{entry.score}</p>
                        <p className="text-xs text-muted-text">pts</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <button
                onClick={() => router.push(`/dashboard/clubs/${quiz.clubId}`)}
                className="w-full mt-4 btn btn-outline text-sm"
              >
                View Club Leaderboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const question = quiz.questions?.[currentQuestion];
  const totalQuestions = quiz.questions?.length || 0;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-background border-b border-border sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold">{quiz.title}</h1>
              <p className="text-sm text-muted-text">Question {currentQuestion + 1} of {totalQuestions}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className={`px-4 py-2 rounded-lg font-bold ${timeRemaining < 60 ? 'bg-red-100 text-red-600' : 'bg-primary/10 text-primary'}`}>
                ⏱️ {formatTime(timeRemaining)}
              </div>
              <button
                onClick={handleSubmit}
                className="btn btn-primary"
              >
                Submit & End
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-background border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-2">
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="card mb-6">
          <div className="mb-4">
            <span className="text-sm font-medium text-muted-text">QUESTION {currentQuestion + 1}</span>
            <h2 className="text-xl font-bold mt-2">{question?.text}</h2>
          </div>

          {question?.imageUrl && (
            <div className="mb-6">
              <img
                src={question.imageUrl}
                alt="Question"
                className="max-w-full rounded-lg border border-border"
              />
            </div>
          )}

          <div className="space-y-3">
            {question?.options?.map((option: string, index: number) => (
              <button
                key={index}
                onClick={() => setAnswers({ ...answers, [question.id]: index })}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  answers[question.id] === index
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    answers[question.id] === index
                      ? 'border-primary bg-primary text-white'
                      : 'border-border'
                  }`}>
                    {answers[question.id] === index && '✓'}
                  </div>
                  <span className="flex-1">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            className="btn btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>

          <div className="flex gap-2">
            {Array.from({ length: totalQuestions }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentQuestion(i)}
                className={`w-10 h-10 rounded-lg font-medium transition-all ${
                  i === currentQuestion
                    ? 'bg-primary text-white'
                    : answers[quiz.questions[i]?.id] !== undefined
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : 'bg-muted text-muted-text hover:bg-muted/80'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentQuestion(Math.min(totalQuestions - 1, currentQuestion + 1))}
            disabled={currentQuestion === totalQuestions - 1}
            className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
