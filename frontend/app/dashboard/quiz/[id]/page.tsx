'use client';

import { useState } from 'react';

interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  image?: string;
}

const mockQuiz = {
  id: 'quiz_1',
  title: 'Web Development Fundamentals - Week 3',
  description: 'Test your knowledge on HTML, CSS, and JavaScript basics',
  timeLimit: 30,
  questions: [
    {
      id: 'q1',
      text: 'What does HTML stand for?',
      options: [
        'Hyper Text Markup Language',
        'High Tech Modern Language',
        'Home Tool Markup Language',
        'Hyperlinks and Text Markup Language',
      ],
    },
    {
      id: 'q2',
      text: 'Which CSS property is used to change the text color?',
      options: ['text-color', 'color', 'font-color', 'text-style'],
    },
    {
      id: 'q3',
      text: 'How do you declare a variable in JavaScript?',
      options: ['variable x = 5;', 'v x = 5;', 'var x = 5;', 'declare x = 5;'],
    },
  ] as QuizQuestion[],
};

export default function QuizPage({
  params,
}: {
  params: { id: string };
}) {
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(mockQuiz.timeLimit * 60);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleStartQuiz = () => {
    setStarted(true);
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleAnswer = (option: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = option;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < mockQuiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    // Calculate score (mock calculation)
    const correctAnswers = [0, 1, 2]; // Mock correct indices
    let points = 0;
    answers.forEach((answer, index) => {
      if (answer === mockQuiz.questions[index].options[correctAnswers[index]]) {
        points++;
      }
    });
    setScore(Math.round((points / mockQuiz.questions.length) * 100));
    setSubmitted(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!started) {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto card">
          <h1 className="text-3xl font-bold mb-4">{mockQuiz.title}</h1>
          <p className="text-muted-text mb-6">{mockQuiz.description}</p>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between">
              <span className="text-muted-text">Questions:</span>
              <span className="font-semibold">{mockQuiz.questions.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-text">Time Limit:</span>
              <span className="font-semibold">{mockQuiz.timeLimit} minutes</span>
            </div>
          </div>

          <button
            onClick={handleStartQuiz}
            className="w-full btn btn-primary"
          >
            Start Quiz →
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto card">
          <div className="text-center space-y-6">
            <h1 className="text-3xl font-bold">Quiz Submitted! ✓</h1>
            <div className="text-6xl font-bold text-primary">{score}%</div>
            <p className="text-muted-text">
              You answered {score * mockQuiz.questions.length / 100 | 0} out of{' '}
              {mockQuiz.questions.length} questions correctly
            </p>

            <div className="space-y-2">
              <button className="w-full btn btn-primary">
                View Results
              </button>
              <button
                onClick={() => window.history.back()}
                className="w-full btn btn-outline"
              >
                Back to Club
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const question = mockQuiz.questions[currentQuestion];

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-xl font-bold">{mockQuiz.title}</h1>
          <div className={`font-semibold ${timeLeft < 60 ? 'text-red-600' : ''}`}>
            ⏱️ {formatTime(timeLeft)}
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <p className="text-sm text-muted-text mb-2">
            Question {currentQuestion + 1} of {mockQuiz.questions.length}
          </p>
          <div className="w-full bg-border rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{
                width: `${((currentQuestion + 1) / mockQuiz.questions.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="card mb-6">
          <h2 className="text-xl font-bold mb-6">{question.text}</h2>

          {question.image && (
            <img
              src={question.image}
              alt="Question"
              className="mb-6 rounded-lg max-h-64"
            />
          )}

          <div className="space-y-2">
            {question.options.map((option, index) => (
              <label
                key={index}
                className="flex items-center p-4 border border-border rounded-lg cursor-pointer hover:bg-muted-bg transition-colors"
              >
                <input
                  type="radio"
                  name="answer"
                  checked={answers[currentQuestion] === option}
                  onChange={() => handleAnswer(option)}
                  className="mr-3"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="flex-1 btn btn-outline disabled:opacity-50"
          >
            ← Previous
          </button>
          {currentQuestion < mockQuiz.questions.length - 1 ? (
            <button
              onClick={handleNext}
              className="flex-1 btn btn-primary"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex-1 btn btn-primary"
            >
              Submit Quiz
            </button>
          )}
        </div>

        {/* Question Indicators */}
        <div className="mt-6 flex flex-wrap gap-2">
          {mockQuiz.questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestion(index)}
              className={`w-8 h-8 rounded text-xs font-semibold transition-colors ${
                index === currentQuestion
                  ? 'bg-primary text-white'
                  : answers[index]
                    ? 'bg-green-500 text-white'
                    : 'bg-border'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
