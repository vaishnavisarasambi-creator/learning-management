'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { subjectsApi } from '@/lib/api/client';
import { Subject } from '@/types';
import { BookOpen } from 'lucide-react';

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await subjectsApi.getAll();
        setSubjects(response.data.subjects);
      } catch (err) {
        setError('Failed to load subjects');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Available Courses</h1>
          <p className="text-lg text-slate-600">Choose a course to start your learning journey</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {subjects.map((subject) => (
            <Link
              key={subject.id}
              href={`/subjects/${subject.slug}`}
              className="block bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-slate-200 transition-all duration-300 overflow-hidden group"
            >
              <div className="h-48 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center overflow-hidden">
                {subject.thumbnail ? (
                  <img
                    src={subject.thumbnail}
                    alt={subject.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <BookOpen className="w-16 h-16 text-slate-400" />
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{subject.title}</h3>
                <p className="text-slate-600 line-clamp-2 leading-relaxed">{subject.description}</p>
                {subject.sectionCount !== undefined && (
                  <div className="mt-4 flex items-center text-sm text-slate-500">
                    <BookOpen className="w-4 h-4 mr-1" />
                    {subject.sectionCount} {subject.sectionCount === 1 ? 'section' : 'sections'}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        {subjects.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No courses available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
