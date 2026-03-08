import { subjectRepository } from './subject.repository';

export class SubjectService {
  async getAllPublished(page?: number, pageSize?: number, search?: string) {
    return subjectRepository.findAllPublished(page, pageSize, search);
  }

  async getById(id: string) {
    const subject = await subjectRepository.findById(parseInt(id));
    if (!subject) {
      throw new Error('Subject not found');
    }
    return {
      ...subject,
      id: subject.id.toString(),
    };
  }

  async getBySlug(slug: string) {
    const subject = await subjectRepository.findBySlug(slug);
    if (!subject) {
      throw new Error('Subject not found');
    }
    return {
      ...subject,
      id: subject.id.toString(),
    };
  }

  async getTree(subjectId: string, userId?: string) {
    const tree = await subjectRepository.getTree(
      parseInt(subjectId),
      userId ? parseInt(userId) : undefined
    );
    if (!tree) {
      throw new Error('Subject not found');
    }
    return tree;
  }

  async getFirstVideoId(subjectId: string, userId?: string) {
    const tree = await this.getTree(subjectId, userId);
    
    // Find first unlocked video
    for (const section of tree.sections) {
      for (const video of section.videos) {
        if (!video.locked) {
          return video.id;
        }
      }
    }
    
    // If all locked, return first video anyway
    if (tree.sections.length > 0 && tree.sections[0].videos.length > 0) {
      return tree.sections[0].videos[0].id;
    }
    
    return null;
  }
}

export const subjectService = new SubjectService();
