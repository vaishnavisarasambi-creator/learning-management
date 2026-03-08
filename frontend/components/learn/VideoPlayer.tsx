'use client';

import { useEffect, useRef, useCallback } from 'react';
import { videosApi, progressApi } from '@/lib/api/client';

interface VideoPlayerProps {
  videoId: string;
  youtubeUrl: string;
  onComplete?: () => void;
}

export function VideoPlayer({ videoId, youtubeUrl, onComplete }: VideoPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const lastSavedPosition = useRef(0);

  // Extract YouTube video ID from URL
  const getYoutubeVideoId = (url: string): string => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/);
    return match?.[1] || '';
  };

  const videoId_YT = getYoutubeVideoId(youtubeUrl);

  // Load saved progress
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const response = await progressApi.getVideoProgress(videoId);
        const { last_position_seconds } = response.data;
        // Note: We can't seek the YouTube iframe directly without the API
        // This would require the YouTube IFrame API
        lastSavedPosition.current = last_position_seconds;
      } catch (err) {
        console.error('Failed to load progress:', err);
      }
    };

    loadProgress();

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [videoId]);

  // Save progress periodically (simplified - in production, use YouTube IFrame API)
  useEffect(() => {
    // For now, we'll just save when component unmounts or video changes
    // In a full implementation, you'd use the YouTube IFrame API to track time
    
    return () => {
      // Save final progress on unmount
      if (lastSavedPosition.current > 0) {
        progressApi.updateVideoProgress(videoId, {
          last_position_seconds: lastSavedPosition.current,
        }).catch(console.error);
      }
    };
  }, [videoId]);

  const handleMarkComplete = async () => {
    try {
      await progressApi.markCompleted(videoId);
      onComplete?.();
    } catch (err) {
      console.error('Failed to mark complete:', err);
    }
  };

  if (!videoId_YT) {
    return (
      <div className="aspect-video bg-gray-900 flex items-center justify-center text-white">
        Invalid YouTube URL
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
        <iframe
          ref={iframeRef}
          src={`https://www.youtube.com/embed/${videoId_YT}?enablejsapi=1&rel=0`}
          title="YouTube video player"
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      
      <button
        onClick={handleMarkComplete}
        className="w-full py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
      >
        Mark as Complete
      </button>
    </div>
  );
}
