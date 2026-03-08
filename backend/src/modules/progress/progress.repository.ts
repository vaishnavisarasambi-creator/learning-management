import { prisma } from '../../config/db';

export class ProgressRepository {
  async getSubjectProgress(userId: number, subjectId: number) {
    const videos = await prisma.video.findMany({
      where: {
        section: {
          subject_id: subjectId,
        },
      },
      select: {
        id: true,
      },
    });

    const videoIds = videos.map((v: { id: number }) => v.id);

    const progress = await prisma.videoProgress.findMany({
      where: {
        user_id: userId,
        video_id: { in: videoIds },
      },
      select: {
        video_id: true,
        is_completed: true,
        last_position_seconds: true,
      },
    });

    const completedCount = progress.filter((p: { is_completed: boolean }) => p.is_completed).length;
    const totalCount = videoIds.length;

    // Find last watched video
    const lastProgress = progress
      .filter((p: { last_position_seconds: number }) => p.last_position_seconds > 0)
      .sort((a: { last_position_seconds: number }, b: { last_position_seconds: number }) => b.last_position_seconds - a.last_position_seconds)[0];

    return {
      total_videos: totalCount,
      completed_videos: completedCount,
      percent_complete: totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0,
      last_video_id: lastProgress?.video_id.toString() || null,
      last_position_seconds: lastProgress?.last_position_seconds || 0,
    };
  }

  async getVideoProgress(userId: number, videoId: number) {
    const progress = await prisma.videoProgress.findUnique({
      where: {
        user_id_video_id: {
          user_id: userId,
          video_id: videoId,
        },
      },
    });

    if (!progress) {
      return {
        last_position_seconds: 0,
        is_completed: false,
      };
    }

    return {
      last_position_seconds: progress.last_position_seconds,
      is_completed: progress.is_completed,
    };
  }

  async upsertProgress(
    userId: number,
    videoId: number,
    data: {
      last_position_seconds?: number;
      is_completed?: boolean;
    }
  ) {
    const existing = await prisma.videoProgress.findUnique({
      where: {
        user_id_video_id: {
          user_id: userId,
          video_id: videoId,
        },
      },
    });

    const updateData: {
      last_position_seconds?: number;
      is_completed?: boolean;
      completed_at?: Date | null;
    } = {};

    if (data.last_position_seconds !== undefined) {
      updateData.last_position_seconds = data.last_position_seconds;
    }

    if (data.is_completed !== undefined) {
      updateData.is_completed = data.is_completed;
      updateData.completed_at = data.is_completed ? new Date() : null;
    }

    if (existing) {
      return prisma.videoProgress.update({
        where: {
          user_id_video_id: {
            user_id: userId,
            video_id: videoId,
          },
        },
        data: updateData,
      });
    }

    return prisma.videoProgress.create({
      data: {
        user_id: userId,
        video_id: videoId,
        last_position_seconds: data.last_position_seconds || 0,
        is_completed: data.is_completed || false,
        completed_at: data.is_completed ? new Date() : null,
      },
    });
  }

  async markCompleted(userId: number, videoId: number) {
    return this.upsertProgress(userId, videoId, { is_completed: true });
  }
}

export const progressRepository = new ProgressRepository();
