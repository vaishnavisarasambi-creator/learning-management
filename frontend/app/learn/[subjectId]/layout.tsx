'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Sidebar } from '@/components/learn/Sidebar';
import { subjectsApi, progressApi } from '@/lib/api/client';
import { SubjectTree, Progress } from '@/types';

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const subjectId = params.subjectId as string;
  const videoId = params.videoId as string;

  const [subjectTree, setSubjectTree] = useState<SubjectTree | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [treeResponse, progressResponse] = await Promise.all([
          subjectsApi.getTree(subjectId),
          progressApi.getSubjectProgress(subjectId),
        ]);
        setSubjectTree(treeResponse.data);
        setProgress(progressResponse.data);
      } catch (err) {
        console.error('Failed to load learning data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [subjectId]);

  const refreshData = async () => {
    try {
      const [treeResponse, progressResponse] = await Promise.all([
        subjectsApi.getTree(subjectId),
        progressApi.getSubjectProgress(subjectId),
      ]);
      setSubjectTree(treeResponse.data);
      setProgress(progressResponse.data);
    } catch (err) {
      console.error('Failed to refresh data:', err);
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!subjectTree) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-red-600">Failed to load course</div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col lg:flex-row">
        <Sidebar
          subjectId={subjectId}
          sections={subjectTree.sections}
          currentVideoId={videoId || ''}
          progress={progress}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
