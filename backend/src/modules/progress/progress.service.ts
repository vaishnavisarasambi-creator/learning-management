import { progressRepository } from './progress.repository';
import { videoRepository } from '../videos/video.repository';

export class ProgressService {
  async getSubjectProgress(userId: string, subjectId: string) {
    return progressRepository.getSubjectProgress(parseInt(userId), parseInt(subjectId));
  }

  async getVideoProgress(userId: string, videoId: string) {
    return progressRepository.getVideoProgress(parseInt(userId), parseInt(videoId));
  }

  async updateProgress(
    userId: string,
    videoId: string,
    data: {
      last_position_seconds?: number;
      is_completed?: boolean;
    }
  ) {
    // Validate video exists
    const video = await videoRepository.findById(parseInt(videoId));
    if (!video) {
      throw new Error('Video not found');
    }

    // Get video duration if available
    const durationSeconds = video.duration_seconds;

    // Cap last_position_seconds at duration if known
    let lastPosition = data.last_position_seconds;
    if (lastPosition !== undefined && durationSeconds && lastPosition > durationSeconds) {
      lastPosition = durationSeconds;
    }

    return progressRepository.upsertProgress(parseInt(userId), parseInt(videoId), {
      last_position_seconds: lastPosition,
      is_completed: data.is_completed,
    });
  }

  async markCompleted(userId: string, videoId: string) {
    return this.updateProgress(userId, videoId, { is_completed: true });
  }
}

export const progressService = new ProgressService();
