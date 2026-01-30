'use client';

import { useAuthStore } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ClubsPage() {
  const { user } = useAuthStore();
  const router = useRouter();

  const clubs = [
    {
      id: 1,
      name: 'Coding Club',
      mentor: 'Dr. Smith',
      members: 145,
      description: 'Learn programming and compete in hackathons',
    },
    {
      id: 2,
      name: 'Web Development',
      mentor: 'Prof. Johnson',
      members: 89,
      description: 'Master frontend and backend technologies',
    },
    {
      id: 3,
      name: 'Machine Learning',
      mentor: 'Dr. Lee',
      members: 67,
      description: 'Explore AI and machine learning projects',
    },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">My Clubs</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {clubs.map((club) => (
          <div key={club.id} className="card hover:shadow-lg transition-shadow cursor-pointer">
            <h3 className="text-xl font-bold mb-2">{club.name}</h3>
            <p className="text-sm text-muted-text mb-3">{club.description}</p>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-muted-text">Mentor:</span> {club.mentor}
              </p>
              <p>
                <span className="text-muted-text">Members:</span> {club.members}
              </p>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="flex-1 btn btn-primary text-sm">View</button>
              <button className="flex-1 btn btn-outline text-sm">Leave</button>
            </div>
          </div>
        ))}
      </div>

      {clubs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-text mb-4">You haven't joined any clubs yet</p>
          <button
            onClick={() => router.push('/dashboard/discover')}
            className="btn btn-primary"
          >
            Browse Clubs
          </button>
        </div>
      )}
    </div>
  );
}
