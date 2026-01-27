'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ClubDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [club, setClub] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showCoordinatorModal, setShowCoordinatorModal] = useState(false);
  const [coordinatorReason, setCoordinatorReason] = useState('');
  const [applyingCoordinator, setApplyingCoordinator] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Get current user ID and role from token
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUserId(payload.sub);
        setUserRole(payload.role);
      } catch (error) {
        console.error('Error parsing token:', error);
      }
    }
  }, []);

  useEffect(() => {
    const fetchClub = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/clubs/${params.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setClub(data);
        } else {
          console.error('Failed to fetch club');
        }
      } catch (error) {
        console.error('Error fetching club:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClub();
  }, [params.id]);

  const handleApplyAsCoordinator = async () => {
    if (!coordinatorReason.trim()) {
      alert('Please provide a reason for your application');
      return;
    }

    setApplyingCoordinator(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/clubs/${params.id}/apply-coordinator`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason: coordinatorReason }),
      });

      if (response.ok) {
        alert('Your coordinator application has been submitted! Wait for admin/faculty approval.');
        setShowCoordinatorModal(false);
        setCoordinatorReason('');
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to apply as coordinator');
      }
    } catch (error) {
      console.error('Error applying as coordinator:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setApplyingCoordinator(false);
    }
  };

  const isUserMember = club?.members?.some((m: any) => m.userId === currentUserId) || false;
  const isUserCoordinator = club?.coordinators?.some((c: any) => c.userId === currentUserId) || false;

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-500">Loading club...</p>
        </div>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold mb-2">Club not found</h3>
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

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'activities', label: 'Activities' },
    { id: 'quizzes', label: 'Quizzes' },
    { id: 'resources', label: 'Resources' },
    { id: 'comments', label: 'Comments' },
  ];

  return (
    <div className="p-8">
      {/* Club Header with Photo */}
      {club.imageUrl && (
        <div className="relative h-64 -mx-8 -mt-8 mb-6 overflow-hidden">
          <img
            src={club.imageUrl}
            alt={club.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-6 left-8">
            <h1 className="text-4xl font-bold text-white drop-shadow-lg mb-2">{club.name}</h1>
            <p className="text-white/90 text-lg drop-shadow">{club.description}</p>
          </div>
        </div>
      )}

      {/* Club Info Card */}
      <div className="card mb-6">
        {!club.imageUrl && (
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">{club.name}</h1>
            <p className="text-muted-text">{club.description}</p>
          </div>
        )}

        <div className="flex justify-end mb-6 gap-3">
          {isUserMember && !isUserCoordinator && userRole !== 'FACULTY' && userRole !== 'ADMIN' && (
            <button 
              onClick={() => setShowCoordinatorModal(true)}
              className="btn btn-outline"
            >
              🎖️ Apply as Coordinator
            </button>
          )}
          <button className="btn btn-primary">Join Club</button>
        </div>

        <div className="grid md:grid-cols-4 gap-4 pt-6 border-t border-border">
          <div>
            <p className="text-muted-text text-sm">Members</p>
            <p className="text-2xl font-bold">{club.memberCount || club._count?.members || 0}</p>
          </div>
          <div>
            <p className="text-muted-text text-sm">Mentor</p>
            <p className="text-lg font-medium">{club.mentor?.name || 'N/A'}</p>
          </div>
          <div>
            <p className="text-muted-text text-sm">Founded</p>
            <p className="text-lg font-medium">
              {club.createdAt ? new Date(club.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-muted-text text-sm">Coordinators</p>
            <p className="text-sm font-medium">
              {club.coordinators?.map((c: any) => c.user?.name).filter(Boolean).join(', ') || 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-border">
        {tabs.map((tab) => (
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

      {/* Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="card">
            <h3 className="font-bold mb-4">About This Club</h3>
            <p className="text-muted-text leading-relaxed">
              {club.description || 'No description available.'}
            </p>
          </div>

          {/* Event Photos Gallery */}
          {club.eventPhotos && club.eventPhotos.length > 0 && (
            <div className="card">
              <h3 className="font-bold mb-4">Past Events 📸</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {club.eventPhotos.map((photo: string, index: number) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-lg overflow-hidden border border-border hover:scale-105 transition-transform cursor-pointer shadow-sm hover:shadow-md"
                  >
                    <img
                      src={photo}
                      alt={`Event ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="font-bold mb-4">Leadership</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-muted-text text-sm">Mentor</p>
                  <p className="font-medium">{club.mentor?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-muted-text text-sm">Coordinators</p>
                  {club.coordinators && club.coordinators.length > 0 ? (
                    club.coordinators.map((coord: any) => (
                      <p key={coord.id} className="font-medium">
                        {coord.user?.name || 'N/A'}
                      </p>
                    ))
                  ) : (
                    <p className="text-muted-text text-sm">No coordinators assigned</p>
                  )}
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="font-bold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 rounded hover:bg-muted-bg transition-colors">
                  📧 Contact Club
                </button>
                <button className="w-full text-left px-3 py-2 rounded hover:bg-muted-bg transition-colors">
                  📋 View Members
                </button>
                <button className="w-full text-left px-3 py-2 rounded hover:bg-muted-bg transition-colors">
                  📅 Club Calendar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Activities */}
      {activeTab === 'activities' && (
        <div className="space-y-4">
          <h3 className="font-bold">Upcoming Activities</h3>
          {[
            { title: 'Coding Workshop', date: '2024-02-01', time: '3:00 PM' },
            { title: 'Hackathon Planning', date: '2024-02-05', time: '5:00 PM' },
          ].map((activity) => (
            <div key={activity.title} className="card hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">{activity.title}</p>
                  <p className="text-sm text-muted-text">
                    {activity.date} at {activity.time}
                  </p>
                </div>
                <button className="btn btn-primary text-sm">Register</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quizzes */}
      {activeTab === 'quizzes' && (
        <div className="space-y-4">
          <h3 className="font-bold">Active Quizzes</h3>
          {['Week 1 Quiz', 'Week 2 Quiz', 'Final Assessment'].map((quiz) => (
            <div key={quiz} className="card hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex justify-between items-center">
                <p className="font-medium">{quiz}</p>
                <button className="btn btn-primary text-sm">Attempt</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resources */}
      {activeTab === 'resources' && (
        <div className="grid md:grid-cols-2 gap-4">
          {['JavaScript Guide', 'React Tutorial', 'Web APIs'].map((resource) => (
            <div key={resource} className="card hover:shadow-lg transition-shadow cursor-pointer">
              <p className="font-medium mb-2">📄 {resource}</p>
              <button className="btn btn-outline text-sm w-full">Download</button>
            </div>
          ))}
        </div>
      )}

      {/* Comments */}
      {activeTab === 'comments' && (
        <div className="space-y-6">
          <div className="card">
            <h3 className="font-bold mb-4">Share Feedback (Anonymous)</h3>
            <textarea
              placeholder="Your comment here (your identity will be hidden)..."
              className="input h-24"
            />
            <button className="btn btn-primary mt-3">Post Comment</button>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold">Comments</h3>
            {[
              'Great activities and supportive community!',
              'Would love more advanced topics',
              'Amazing club, highly recommend!',
            ].map((comment, index) => (
              <div key={index} className="card">
                <p className="text-sm text-muted-text mb-2">Anonymous</p>
                <p className="text-sm">{comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Coordinator Application Modal */}
      {showCoordinatorModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Apply as Coordinator</h3>
            <p className="text-muted-text text-sm mb-4">
              Tell us why you want to be a coordinator for <span className="font-semibold text-foreground">{club.name}</span>
            </p>
            
            <textarea
              value={coordinatorReason}
              onChange={(e) => setCoordinatorReason(e.target.value)}
              placeholder="Enter your reason here..."
              className="input h-32 mb-4 resize-none"
              disabled={applyingCoordinator}
            />
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCoordinatorModal(false);
                  setCoordinatorReason('');
                }}
                className="btn btn-outline flex-1"
                disabled={applyingCoordinator}
              >
                Cancel
              </button>
              <button
                onClick={handleApplyAsCoordinator}
                className="btn btn-primary flex-1"
                disabled={applyingCoordinator || !coordinatorReason.trim()}
              >
                {applyingCoordinator ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
