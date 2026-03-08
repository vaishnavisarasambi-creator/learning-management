'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { subjectsApi } from '@/lib/api/client';
import { Subject } from '@/types';
import { useAuth } from '@/lib/auth/AuthContext';
import { BookOpen, ChevronLeft, Play, Lock } from 'lucide-react';

export default function SubjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSubject = async () => {
      try {
        const response = await subjectsApi.getBySlug(params.slug as string);
        setSubject(response.data);
      } catch (err) {
        setError('Failed to load course');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubject();
  }, [params.slug]);

  const handleStartLearning = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (subject) {
      try {
        const response = await subjectsApi.getFirstVideo(subject.id);
        router.push(`/learn/${subject.id}/video/${response.data.videoId}`);
      } catch (err) {
        setError('Failed to start learning');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !subject) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">{error || 'Course not found'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/subjects"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to courses
        </Link>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="h-64 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            {subject.thumbnail ? (
              <img
                src={subject.thumbnail}
                alt={subject.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <BookOpen className="w-24 h-24 text-white opacity-80" />
            )}
          </div>

          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{subject.title}</h1>
            <p className="text-gray-600 text-lg mb-8">{subject.description}</p>

            <div className="flex items-center gap-4">
              <button
                onClick={handleStartLearning}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Play className="w-5 h-5 mr-2" />
                {isAuthenticated ? 'Start Learning' : 'Sign in to Start'}
              </button>

              {!isAuthenticated && (
                <span className="flex items-center text-gray-500">
                  <Lock className="w-4 h-4 mr-1" />
                  Login required
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
