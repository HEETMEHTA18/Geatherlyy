'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/context/AuthContext';

export default function ManageClubPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [clubs, setClubs] = useState<any[]>([]);
  const [selectedClub, setSelectedClub] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [quizTitle, setQuizTitle] = useState('');
  const [quizDescription, setQuizDescription] = useState('');
  const [quizDuration, setQuizDuration] = useState(30);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    image: null as string | null,
  });
  const [creatingQuiz, setCreatingQuiz] = useState(false);

  const fetchQuizzes = async () => {
    if (!selectedClub) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/quizzes?clubId=${selectedClub.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setQuizzes(data);
      }
    } catch (error) {
      console.error('Failed to fetch quizzes:', error);
    }
  };

  useEffect(() => {
    if (selectedClub && activeTab === 'quizzes') {
      fetchQuizzes();
    }
  }, [selectedClub, activeTab]);

  useEffect(() => {
    const fetchManagedClubs = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/clubs/managed', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setClubs(data);
          if (data.length > 0) {
            setSelectedClub(data[0]);
          }
        }
      } catch (error) {
        console.error('Failed to fetch managed clubs:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchManagedClubs();
    }
  }, [user]);

  const handleCreateQuiz = async () => {
    if (!quizTitle || questions.length === 0 || !selectedClub) {
      alert('Please add a title and at least one question');
      return;
    }

    setCreatingQuiz(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/quizzes', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: quizTitle,
          description: quizDescription,
          timeLimit: quizDuration,
          clubId: selectedClub.id,
          questions: questions.map((q, index) => ({
            text: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
            imageUrl: q.image,
            marks: 1,
            order: index,
          })),
        }),
      });

      if (response.ok) {
        alert(`Quiz "${quizTitle}" created successfully!`);
        setShowQuizModal(false);
        setQuizTitle('');
        setQuizDescription('');
        setQuestions([]);
        fetchQuizzes();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to create quiz');
      }
    } catch (error) {
      console.error('Error creating quiz:', error);
      alert('An error occurred while creating the quiz');
    } finally {
      setCreatingQuiz(false);
    }
  };

  const handleToggleQuizStatus = async (quizId: number, isActive: boolean) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/quizzes/${quizId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isActive: !isActive,
        }),
      });

      if (response.ok) {
        alert(isActive ? 'Quiz stopped' : 'Quiz started');
        fetchQuizzes();
      }
    } catch (error) {
      console.error('Error toggling quiz status:', error);
    }
  };

  const handleDeleteQuiz = async (quizId: number) => {
    if (!confirm('Are you sure you want to delete this quiz?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/quizzes/${quizId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert('Quiz deleted successfully');
        fetchQuizzes();
      }
    } catch (error) {
      console.error('Error deleting quiz:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-500">Loading clubs...</p>
        </div>
      </div>
    );
  }

  if (clubs.length === 0) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Club Management</h1>
        <div className="text-center py-12 card">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold mb-2">No clubs to manage</h3>
          <p className="text-gray-500 mb-6">You are not coordinating any clubs yet.</p>
          {user && ['coordinator', 'faculty', 'admin'].includes(user.role) && (
            <button
              onClick={() => router.push('/dashboard/create-club')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
            >
              Create New Club
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Club Management</h1>

      {/* Tab Navigation */}
      <div className="flex gap-4 mb-6 border-b border-border">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'members', label: 'Members' },
          { id: 'activities', label: 'Activities' },
          { id: 'quizzes', label: 'Quizzes' },
          { id: 'resources', label: 'Resources' },
          { id: 'comments', label: 'Comments' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-4 px-2 font-medium transition-colors border-b-2 ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-text hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="card">
              <p className="text-muted-text text-sm">Total Members</p>
              <p className="text-3xl font-bold text-primary">145</p>
            </div>
            <div className="card">
              <p className="text-muted-text text-sm">Activities Created</p>
              <p className="text-3xl font-bold text-primary">12</p>
            </div>
            <div className="card">
              <p className="text-muted-text text-sm">Quizzes Taken</p>
              <p className="text-3xl font-bold text-primary">567</p>
            </div>
            <div className="card">
              <p className="text-muted-text text-sm">Avg Attendance</p>
              <p className="text-3xl font-bold text-primary">78%</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="font-bold mb-4">Club Info</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-text">Club Name</p>
                  <p className="font-medium">Coding Club</p>
                </div>
                <div>
                  <p className="text-muted-text">Faculty Mentor</p>
                  <p className="font-medium">Dr. Smith</p>
                </div>
                <div>
                  <p className="text-muted-text">Established</p>
                  <p className="font-medium">January 2023</p>
                </div>
              </div>
              <button className="w-full btn btn-outline text-sm mt-4">
                Edit Club Info
              </button>
            </div>

            <div className="card">
              <h3 className="font-bold mb-4">Recent Actions</h3>
              <div className="space-y-2 text-sm">
                <p className="py-2 border-b border-border">
                  📝 10 members joined
                </p>
                <p className="py-2 border-b border-border">
                  📊 Quiz created by you
                </p>
                <p className="py-2 border-b border-border">
                  💬 15 new comments
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Members Tab */}
      {activeTab === 'members' && (
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold">Members</h2>
            <button className="btn btn-primary text-sm">Import Members</button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-semibold">Name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold">Email</th>
                <th className="text-left py-3 px-4 text-sm font-semibold">Role</th>
                <th className="text-left py-3 px-4 text-sm font-semibold">Joined</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Alice', email: 'alice@uni.edu', role: 'Coordinator', joined: '2024-01-15' },
                { name: 'Bob', email: 'bob@uni.edu', role: 'Member', joined: '2024-01-16' },
                { name: 'Carol', email: 'carol@uni.edu', role: 'Member', joined: '2024-01-17' },
              ].map((member) => (
                <tr key={member.email} className="border-b border-border hover:bg-muted-bg">
                  <td className="py-3 px-4 text-sm">{member.name}</td>
                  <td className="py-3 px-4 text-sm">{member.email}</td>
                  <td className="py-3 px-4 text-sm">{member.role}</td>
                  <td className="py-3 px-4 text-sm">{member.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Activities Tab */}
      {activeTab === 'activities' && (
        <div className="space-y-4">
          <button className="btn btn-primary">+ Create Activity</button>
          <div className="card">
            <h3 className="font-bold mb-4">Upcoming Activities</h3>
            <div className="space-y-3">
              {[
                { title: 'Coding Workshop', date: '2024-02-01', attendees: 45 },
                { title: 'Git Basics Session', date: '2024-02-05', attendees: 32 },
              ].map((activity) => (
                <div key={activity.title} className="p-3 border border-border rounded hover:bg-muted-bg transition-colors">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-sm text-muted-text">{activity.date} • {activity.attendees} attendees</p>
                    </div>
                    <button className="text-sm text-primary">Edit</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quizzes Tab */}
      {activeTab === 'quizzes' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Quiz Management</h2>
            <button 
              onClick={() => setShowQuizModal(true)}
              className="btn btn-primary"
            >
              + Create New Quiz
            </button>
          </div>

          {/* Active Quizzes */}
          <div className="card">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Active Quizzes
            </h3>
            {quizzes.filter(q => q.isActive).length > 0 ? (
              <div className="space-y-3">
                {quizzes.filter(q => q.isActive).map((quiz) => (
                  <div key={quiz.id} className="p-4 border border-border rounded-lg hover:border-primary transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-bold text-lg">{quiz.title}</h4>
                          <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full font-medium">
                            Active
                          </span>
                        </div>
                        <div className="flex gap-6 text-sm text-muted-text">
                          <span>📝 {quiz._count?.questions || 0} questions</span>
                          <span>⏱️ {quiz.timeLimit} min</span>
                          <span>👥 {quiz._count?.attempts || 0} attempts</span>
                          <span>📅 {new Date(quiz.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => router.push(`/dashboard/quizzes/${quiz.id}/results`)}
                        className="btn btn-outline text-sm flex-1"
                      >
                        📊 View Results
                      </button>
                      <button 
                        onClick={() => handleToggleQuizStatus(quiz.id, true)}
                        className="btn btn-outline text-sm flex-1"
                      >
                        ⏸️ Stop Quiz
                      </button>
                      <button 
                        onClick={() => router.push(`/dashboard/quizzes/${quiz.id}`)}
                        className="btn btn-outline text-sm flex-1"
                      >
                        👁️ Preview
                      </button>
                      <button 
                        onClick={() => handleDeleteQuiz(quiz.id)}
                        className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-2 rounded-lg text-sm font-medium"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-text">
                <p>No active quizzes</p>
              </div>
            )}
          </div>

          {/* Inactive/Scheduled Quizzes */}
          <div className="card">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gray-400"></span>
              Inactive Quizzes
            </h3>
            {quizzes.filter(q => !q.isActive).length > 0 ? (
              <div className="space-y-3">
                {quizzes.filter(q => !q.isActive).map((quiz) => (
                  <div key={quiz.id} className="p-4 border border-border rounded-lg hover:border-primary transition-colors opacity-75">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-bold">{quiz.title}</h4>
                          <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 px-3 py-1 rounded-full font-medium">
                            Inactive
                          </span>
                        </div>
                        <div className="flex gap-6 text-sm text-muted-text">
                          <span>📝 {quiz._count?.questions || 0} questions</span>
                          <span>⏱️ {quiz.timeLimit} min</span>
                          <span>👥 {quiz._count?.attempts || 0} attempts</span>
                          <span>📅 {new Date(quiz.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleToggleQuizStatus(quiz.id, false)}
                          className="btn btn-primary text-sm"
                        >
                          🚀 Start Quiz
                        </button>
                        <button 
                          onClick={() => handleDeleteQuiz(quiz.id)}
                          className="btn btn-outline text-sm text-red-500"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-text">
                <p>No inactive quizzes</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quiz Creation Modal */}
      {showQuizModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-background border-b border-border p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Create New Quiz</h2>
                <button 
                  onClick={() => setShowQuizModal(false)}
                  className="text-muted-text hover:text-foreground"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Quiz Details */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Quiz Title</label>
                  <input
                    type="text"
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                    placeholder="e.g., JavaScript Fundamentals Quiz"
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={quizDescription}
                    onChange={(e) => setQuizDescription(e.target.value)}
                    placeholder="Brief description about the quiz..."
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Duration (minutes)</label>
                  <input
                    type="number"
                    value={quizDuration}
                    onChange={(e) => setQuizDuration(Number(e.target.value))}
                    min="5"
                    max="180"
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Add Question Section */}
              <div className="border border-border rounded-lg p-4">
                <h3 className="font-bold mb-4">Add Question</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Question</label>
                    <input
                      type="text"
                      value={currentQuestion.question}
                      onChange={(e) => setCurrentQuestion({...currentQuestion, question: e.target.value})}
                      placeholder="Enter your question..."
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Question Image (Optional)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setCurrentQuestion({...currentQuestion, image: reader.result as string});
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {currentQuestion.image && (
                      <div className="mt-2 relative">
                        <img src={currentQuestion.image} alt="Question" className="max-h-40 rounded-lg" />
                        <button
                          onClick={() => setCurrentQuestion({...currentQuestion, image: null})}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium mb-2">Options</label>
                    {currentQuestion.options.map((option, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="radio"
                          name="correctAnswer"
                          checked={currentQuestion.correctAnswer === index}
                          onChange={() => setCurrentQuestion({...currentQuestion, correctAnswer: index})}
                          className="mt-3"
                        />
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...currentQuestion.options];
                            newOptions[index] = e.target.value;
                            setCurrentQuestion({...currentQuestion, options: newOptions});
                          }}
                          placeholder={`Option ${index + 1}`}
                          className="flex-1 px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      if (currentQuestion.question && currentQuestion.options.every(o => o)) {
                        setQuestions([...questions, {...currentQuestion}]);
                        setCurrentQuestion({
                          question: '',
                          options: ['', '', '', ''],
                          correctAnswer: 0,
                          image: null,
                        });
                      } else {
                        alert('Please fill in the question and all options');
                      }
                    }}
                    className="btn btn-outline w-full"
                  >
                    + Add Question
                  </button>
                </div>
              </div>

              {/* Questions List */}
              {questions.length > 0 && (
                <div className="border border-border rounded-lg p-4">
                  <h3 className="font-bold mb-4">Added Questions ({questions.length})</h3>
                  <div className="space-y-3">
                    {questions.map((q, index) => (
                      <div key={index} className="p-3 bg-muted/30 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-medium">Q{index + 1}: {q.question}</p>
                            {q.image && (
                              <img src={q.image} alt="Question" className="max-h-20 rounded mt-2" />
                            )}
                            <div className="mt-2 space-y-1 text-sm">
                              {q.options.map((opt: string, i: number) => (
                                <div key={i} className={`${i === q.correctAnswer ? 'text-green-600 font-medium' : 'text-muted-text'}`}>
                                  {i === q.correctAnswer && '✓ '}{opt}
                                </div>
                              ))}
                            </div>
                          </div>
                          <button
                            onClick={() => setQuestions(questions.filter((_, i) => i !== index))}
                            className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-2 py-1 rounded"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-background border-t border-border p-6 flex gap-3">
              <button
                onClick={() => setShowQuizModal(false)}
                className="flex-1 btn btn-outline"
                disabled={creatingQuiz}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateQuiz}
                className="flex-1 btn btn-primary"
                disabled={creatingQuiz}
              >
                {creatingQuiz ? 'Creating...' : 'Create Quiz'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resources Tab */}
      {activeTab === 'resources' && (
        <div className="space-y-4">
          <button className="btn btn-primary">+ Upload Resource</button>
          <div className="grid md:grid-cols-2 gap-4">
            {['JavaScript Guide.pdf', 'React Tutorial.pdf', 'CSS Mastery.pdf'].map((resource) => (
              <div key={resource} className="card">
                <p className="font-medium truncate">📄 {resource}</p>
                <p className="text-sm text-muted-text mt-2">Uploaded 3 days ago</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comments Tab */}
      {activeTab === 'comments' && (
        <div className="card">
          <h3 className="font-bold mb-4">Recent Comments</h3>
          <div className="space-y-4">
            {[
              { author: 'Anonymous', text: 'Great activity! Learned a lot.', date: 'Today' },
              { author: 'Anonymous', text: 'Can we have more quizzes?', date: 'Yesterday' },
            ].map((comment, index) => (
              <div key={index} className="p-3 border border-border rounded">
                <p className="text-sm text-muted-text font-medium">{comment.author}</p>
                <p className="text-sm mt-2">{comment.text}</p>
                <p className="text-xs text-muted-text mt-2">{comment.date}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
