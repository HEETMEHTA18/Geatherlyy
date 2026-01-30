'use client';

import Link from 'next/link';
import { useAuthStore } from '@/context/AuthContext';
import { useEffect } from 'react';

export default function Home() {
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-2">Welcome, {user.name}! 👋</h1>
          <p className="text-muted-text mb-8">You're logged in as a {user.role}</p>
          
          <Link href="/dashboard" className="btn btn-primary">
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="space-y-8">
          <div>
            <h1 className="text-5xl font-bold mb-4">Gatherly</h1>
            <p className="text-xl text-muted-text mb-2">
              Centralized Club Management System
            </p>
            <p className="text-muted-text max-w-2xl">
              Seamlessly manage, organize, and engage with university clubs. From activities
              to quizzes, resources to feedback—all in one platform.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="card">
              <h3 className="font-semibold mb-2">📚 Manage Clubs</h3>
              <p className="text-sm text-muted-text">
                Create and manage clubs, track members, and organize activities.
              </p>
            </div>
            <div className="card">
              <h3 className="font-semibold mb-2">🎯 Run Quizzes</h3>
              <p className="text-sm text-muted-text">
                Create engaging quizzes with images, track scores, and view leaderboards.
              </p>
            </div>
            <div className="card">
              <h3 className="font-semibold mb-2">💬 Anonymous Feedback</h3>
              <p className="text-sm text-muted-text">
                Collect honest feedback with hidden identities, visible to admins only.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Link href="/login" className="btn btn-primary inline-block">
              Get Started with Google Sign-In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
