import { videoRepository } from './video.repository';

export interface VideoDetailResponse {
  id: string;
  title: string;
  description: string | null;
  youtube_url: string;
  order_index: number;
  duration_seconds: number | null;
  section: {
    id: string;
    title: string;
  };
  subject: {
    id: string;
    title: string;
    slug: string;
  };
  previous_video_id: string | null;
  next_video_id: string | null;
  locked: boolean;
  unlock_reason: string | null;
  is_completed: boolean;
}

export class VideoService {
  async getVideoDetail(videoId: string, userId: string): Promise<VideoDetailResponse> {
    const video = await videoRepository.findById(parseInt(videoId));
    
    if (!video) {
      throw new Error('Video not found');
    }

    const subjectId = video.section.subject.id;
    const orderedVideos = await videoRepository.getOrderedVideosBySubject(subjectId);
    
    const currentIndex = orderedVideos.findIndex((v: { id: string }) => v.id === videoId);
    
    const prevVideo = currentIndex > 0 ? orderedVideos[currentIndex - 1] : null;
    const nextVideo = currentIndex < orderedVideos.length - 1 ? orderedVideos[currentIndex + 1] : null;

    // Check if previous video is completed
    let isLocked = false;
    let unlockReason: string | null = null;
    
    if (prevVideo) {
      const prevCompleted = await videoRepository.isVideoCompleted(parseInt(userId), parseInt(prevVideo.id));
      if (!prevCompleted) {
        isLocked = true;
        unlockReason = 'Complete the previous video to unlock';
      }
    }

    // Get user's progress for this video
    const progress = await videoRepository.getVideoProgress(parseInt(userId), parseInt(videoId));

    return {
      id: video.id.toString(),
      title: video.title,
      description: video.description,
      youtube_url: video.youtube_url,
      order_index: video.order_index,
      duration_seconds: video.duration_seconds,
      section: {
        id: video.section.id.toString(),
        title: video.section.title,
      },
      subject: {
        id: video.section.subject.id.toString(),
        title: video.section.subject.title,
        slug: video.section.subject.slug,
      },
      previous_video_id: prevVideo?.id || null,
      next_video_id: nextVideo?.id || null,
      locked: isLocked,
      unlock_reason: unlockReason,
      is_completed: progress?.is_completed || false,
    };
  }

  async checkVideoAccess(videoId: string, userId: string): Promise<{ accessible: boolean; reason?: string }> {
    const video = await videoRepository.findById(parseInt(videoId));
    
    if (!video) {
      return { accessible: false, reason: 'Video not found' };
    }

    const subjectId = video.section.subject.id;
    const orderedVideos = await videoRepository.getOrderedVideosBySubject(subjectId);
    
    const currentIndex = orderedVideos.findIndex((v: { id: string }) => v.id === videoId);
    
    // First video is always accessible
    if (currentIndex === 0) {
      return { accessible: true };
    }

    const prevVideo = orderedVideos[currentIndex - 1];
    const prevCompleted = await videoRepository.isVideoCompleted(parseInt(userId), parseInt(prevVideo.id));
    
    if (!prevCompleted) {
      return { accessible: false, reason: 'Complete the previous video first' };
    }

    return { accessible: true };
  }
}

export const videoService = new VideoService();
