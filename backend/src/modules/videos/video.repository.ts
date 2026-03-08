import { prisma } from '../../config/db';

export class VideoRepository {
  async findById(id: number) {
    return prisma.video.findUnique({
      where: { id },
      include: {
        section: {
          select: {
            id: true,
            title: true,
            order_index: true,
            subject: {
              select: {
                id: true,
                title: true,
                slug: true,
              },
            },
          },
        },
      },
    });
  }

  async getOrderedVideosBySubject(subjectId: number) {
    const videos = await prisma.video.findMany({
      where: {
        section: {
          subject_id: subjectId,
        },
      },
      include: {
        section: {
          select: {
            order_index: true,
          },
        },
      },
      orderBy: [
        { section: { order_index: 'asc' } },
        { order_index: 'asc' },
      ],
    });

    return videos.map((v: { id: number; title: string; section: { order_index: number }; order_index: number }) => ({
      id: v.id.toString(),
      title: v.title,
      sectionOrderIndex: v.section.order_index,
      videoOrderIndex: v.order_index,
    }));
  }

  async getVideoProgress(userId: number, videoId: number) {
    return prisma.videoProgress.findUnique({
      where: {
        user_id_video_id: {
          user_id: userId,
          video_id: videoId,
        },
      },
    });
  }

  async isVideoCompleted(userId: number, videoId: number): Promise<boolean> {
    const progress = await prisma.videoProgress.findUnique({
      where: {
        user_id_video_id: {
          user_id: userId,
          video_id: videoId,
        },
      },
      select: {
        is_completed: true,
      },
    });
    return progress?.is_completed || false;
  }
}

export const videoRepository = new VideoRepository();
