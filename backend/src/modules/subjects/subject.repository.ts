import { prisma } from '../../config/db';

export class SubjectRepository {
  async findAllPublished(page: number = 1, pageSize: number = 10, search?: string) {
    const skip = (page - 1) * pageSize;
    
    const where = {
      is_published: true,
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [subjects, total] = await Promise.all([
      prisma.subject.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { created_at: 'desc' },
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          thumbnail: true,
          created_at: true,
          _count: {
            select: {
              sections: {
                where: {
                  videos: { some: {} },
                },
              },
            },
          },
        },
      }),
      prisma.subject.count({ where }),
    ]);

    return {
      subjects: subjects.map((s: { id: number; title: string; slug: string; description: string; thumbnail: string | null; created_at: Date; _count: { sections: number } }) => ({
        ...s,
        id: s.id.toString(),
        sectionCount: s._count.sections,
      })),
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  async findById(id: number) {
    return prisma.subject.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        thumbnail: true,
        is_published: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  async findBySlug(slug: string) {
    return prisma.subject.findUnique({
      where: { slug },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        thumbnail: true,
        is_published: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  async getTree(subjectId: number, userId?: number) {
    const subject = await prisma.subject.findUnique({
      where: { id: subjectId },
      include: {
        sections: {
          orderBy: { order_index: 'asc' },
          include: {
            videos: {
              orderBy: { order_index: 'asc' },
              select: {
                id: true,
                title: true,
                order_index: true,
                duration_seconds: true,
              },
            },
          },
        },
      },
    });

    if (!subject) return null;

    // Get progress for all videos if userId provided
    let progressMap: Map<string, { is_completed: boolean }> = new Map();
    if (userId) {
      const videoIds = subject.sections.flatMap((s: { videos: { id: number }[] }) => s.videos.map((v: { id: number }) => v.id));
      const progress = await prisma.videoProgress.findMany({
        where: {
          user_id: userId,
          video_id: { in: videoIds },
        },
        select: {
          video_id: true,
          is_completed: true,
        },
      });
      progressMap = new Map(progress.map((p: { video_id: number; is_completed: boolean }) => [p.video_id.toString(), { is_completed: p.is_completed }]));
    }

    // Build flattened video list for sequential locking
    const allVideos: { id: string; sectionId: string; orderIndex: number }[] = [];
    subject.sections.forEach((section: { id: number; videos: { id: number; order_index: number }[] }) => {
      section.videos.forEach((video: { id: number; order_index: number }) => {
        allVideos.push({
          id: video.id.toString(),
          sectionId: section.id.toString(),
          orderIndex: video.order_index,
        });
      });
    });

    // Sort by section order_index, then video order_index
    allVideos.sort((a, b) => {
      const sectionA = subject.sections.find((s: { id: number }) => s.id.toString() === a.sectionId)!;
      const sectionB = subject.sections.find((s: { id: number }) => s.id.toString() === b.sectionId)!;
      if (sectionA.order_index !== sectionB.order_index) {
        return sectionA.order_index - sectionB.order_index;
      }
      return a.orderIndex - b.orderIndex;
    });

    // Calculate locked status for each video
    const lockedMap = new Map<string, boolean>();
    for (let i = 0; i < allVideos.length; i++) {
      const video = allVideos[i];
      if (i === 0) {
        lockedMap.set(video.id, false); // First video is always unlocked
      } else {
        const prevVideo = allVideos[i - 1];
        const prevCompleted = progressMap.get(prevVideo.id)?.is_completed || false;
        lockedMap.set(video.id, !prevCompleted);
      }
    }

    return {
      id: subject.id.toString(),
      title: subject.title,
      slug: subject.slug,
      description: subject.description,
      thumbnail: subject.thumbnail,
      sections: subject.sections.map((section: { id: number; title: string; order_index: number; videos: { id: number; title: string; order_index: number; duration_seconds: number | null }[] }) => ({
        id: section.id.toString(),
        title: section.title,
        order_index: section.order_index,
        videos: section.videos.map((video: { id: number; title: string; order_index: number; duration_seconds: number | null }) => ({
          id: video.id.toString(),
          title: video.title,
          order_index: video.order_index,
          duration_seconds: video.duration_seconds,
          is_completed: progressMap.get(video.id.toString())?.is_completed || false,
          locked: lockedMap.get(video.id.toString()) || true,
        })),
      })),
    };
  }

  async getVideoCount(subjectId: number): Promise<number> {
    return prisma.video.count({
      where: {
        section: {
          subject_id: subjectId,
        },
      },
    });
  }
}

export const subjectRepository = new SubjectRepository();
