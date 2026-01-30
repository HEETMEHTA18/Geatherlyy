'use client';

import { create } from 'zustand';

export interface Club {
  id: string;
  name: string;
  description: string;
  mentor?: string;
  coordinators: string[];
  members: number;
  imageUrl?: string;
  createdAt: Date;
}

export interface Activity {
  id: string;
  clubId: string;
  title: string;
  description: string;
  date: Date;
  type: 'event' | 'quiz' | 'resource';
  status: 'upcoming' | 'ongoing' | 'completed';
}

export interface Quiz {
  id: string;
  clubId: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  timeLimit: number;
  published: boolean;
}

export interface QuizQuestion {
  id: string;
  text: string;
  type: 'mcq' | 'short';
  options?: string[];
  correctAnswer?: string | number;
  image?: string;
}

export interface Resource {
  id: string;
  clubId: string;
  title: string;
  type: 'pdf' | 'image' | 'link';
  url: string;
  category: string;
  uploadedAt: Date;
}

interface ClubState {
  clubs: Club[];
  activities: Activity[];
  quizzes: Quiz[];
  resources: Resource[];
  selectedClub: Club | null;
  
  addClub: (club: Club) => void;
  removeClub: (clubId: string) => void;
  addActivity: (activity: Activity) => void;
  addQuiz: (quiz: Quiz) => void;
  addResource: (resource: Resource) => void;
  setSelectedClub: (club: Club | null) => void;
  getClubActivities: (clubId: string) => Activity[];
  getClubQuizzes: (clubId: string) => Quiz[];
  getClubResources: (clubId: string) => Resource[];
}

const useClubStore = create<ClubState>((set, get) => ({
  clubs: [],
  activities: [],
  quizzes: [],
  resources: [],
  selectedClub: null,

  addClub: (club) =>
    set((state) => ({
      clubs: [...state.clubs, club],
    })),

  removeClub: (clubId) =>
    set((state) => ({
      clubs: state.clubs.filter((c) => c.id !== clubId),
    })),

  addActivity: (activity) =>
    set((state) => ({
      activities: [...state.activities, activity],
    })),

  addQuiz: (quiz) =>
    set((state) => ({
      quizzes: [...state.quizzes, quiz],
    })),

  addResource: (resource) =>
    set((state) => ({
      resources: [...state.resources, resource],
    })),

  setSelectedClub: (club) => set({ selectedClub: club }),

  getClubActivities: (clubId) => {
    const state = get();
    return state.activities.filter((a) => a.clubId === clubId);
  },

  getClubQuizzes: (clubId) => {
    const state = get();
    return state.quizzes.filter((q) => q.clubId === clubId);
  },

  getClubResources: (clubId) => {
    const state = get();
    return state.resources.filter((r) => r.clubId === clubId);
  },
}));

export { useClubStore };
