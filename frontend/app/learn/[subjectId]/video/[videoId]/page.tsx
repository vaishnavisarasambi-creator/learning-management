'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { videosApi, progressApi } from '@/lib/api/client';
import { VideoDetail } from '@/types';
import { VideoPlayer } from '@/components/learn/VideoPlayer';
import { ChevronLeft, ChevronRight, Lock } from 'lucide-react';

export default function VideoPage() {
  const params = useParams();
  const router = useRouter();
  const subjectId = params.subjectId as string;
  const videoId = params.videoId as string;

  const [video, setVideo] = useState<VideoDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await videosApi.getById(videoId);
        setVideo(response.data);
        
        // If video is locked, redirect to first available video
        if (response.data.locked) {
          setError('This video is locked. Complete the previous video first.');
        }
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load video');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideo();
  }, [videoId, subjectId]);

  const handleComplete = () => {
    // Refresh the page to update sidebar
    window.location.reload();
  };

  const handleNext = () => {
    if (video?.next_video_id) {
      router.push(`/learn/${subjectId}/video/${video.next_video_id}`);
    }
  };

  const handlePrevious = () => {
    if (video?.previous_video_id) {
      router.push(`/learn/${subjectId}/video/${video.previous_video_id}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error && !video) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Video not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="mb-4">
        <Link
          href={`/subjects/${video.subject.slug}`}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          {video.subject.title}
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-sm text-gray-900">{video.section.title}</span>
      </div>

      {/* Video Title */}
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{video.title}</h1>
      
      {/* Locked Warning */}
      {video.locked && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center">
          <Lock className="w-5 h-5 text-yellow-600 mr-2" />
          <span className="text-yellow-800">{video.unlock_reason}</span>
        </div>
      )}

      {/* Video Player */}
      <div className="mb-6">
        <VideoPlayer
          videoId={videoId}
          youtubeUrl={video.youtube_url}
          onComplete={handleComplete}
        />
      </div>

      {/* Description */}
      {video.description && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">About this lesson</h3>
          <p className="text-gray-700">{video.description}</p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <button
          onClick={handlePrevious}
          disabled={!video.previous_video_id}
          className={`flex items-center px-4 py-2 rounded-lg ${
            video.previous_video_id
              ? 'text-gray-700 hover:bg-gray-100'
              : 'text-gray-400 cursor-not-allowed'
          }`}
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Previous
        </button>

        {video.is_completed && (
          <span className="text-green-600 font-medium">Completed</span>
        )}

        <button
          onClick={handleNext}
          disabled={!video.next_video_id || video.locked}
          className={`flex items-center px-4 py-2 rounded-lg ${
            video.next_video_id && !video.locked
              ? 'text-gray-700 hover:bg-gray-100'
              : 'text-gray-400 cursor-not-allowed'
          }`}
        >
          Next
          <ChevronRight className="w-5 h-5 ml-1" />
        </button>
      </div>
    </div>
  );
}
