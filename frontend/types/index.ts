export interface User {
  id: string;
  email: string;
  name: string;
  role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
}

export interface Subject {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string | null;
  created_at: string;
  sectionCount?: number;
}

export interface Video {
  id: string;
  title: string;
  order_index: number;
  duration_seconds: number | null;
  is_completed: boolean;
  locked: boolean;
}

export interface Section {
  id: string;
  title: string;
  order_index: number;
  videos: Video[];
}

export interface SubjectTree extends Subject {
  sections: Section[];
}

export interface VideoDetail {
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

export interface Progress {
  total_videos: number;
  completed_videos: number;
  percent_complete: number;
  last_video_id: string | null;
  last_position_seconds: number;
}

export interface VideoProgress {
  last_position_seconds: number;
  is_completed: boolean;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}
