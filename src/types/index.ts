
export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio?: string;
  role: 'member' | 'service_user' | 'service_provider' | 'admin';
  joinDate: string;
  followers?: number;
  following?: number;
}

export interface Post {
  id: string;
  userId: string;
  user?: User;
  content: string;
  images?: string[];
  createdAt: string;
  likes: number;
  comments: number;
  hasLiked?: boolean;
  tags?: string[];
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  user?: User;
  content: string;
  createdAt: string;
  likes: number;
  hasLiked?: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'like' | 'comment' | 'follow' | 'mention';
  fromUserId: string;
  fromUser?: User;
  entityId?: string;
  content?: string;
  createdAt: string;
  isRead: boolean;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  memberCount: number;
  type: 'member' | 'provider';
  privacy: 'public' | 'private';
  isSubscription?: boolean;
  price?: number;
  createdAt: string;
}

export interface GroupMember {
  id: string;
  groupId: string;
  userId: string;
  user?: User;
  role: 'member' | 'moderator' | 'admin';
  joinedAt: string;
}

export interface GroupPost extends Post {
  groupId: string;
}

export interface StreamSession {
  id: string;
  groupId: string;
  hostId: string;
  host?: User;
  title: string;
  type: 'video' | 'audio' | 'screen';
  status: 'scheduled' | 'live' | 'ended';
  scheduledFor?: string;
  startedAt?: string;
  endedAt?: string;
  participantCount: number;
}

// Task Management Types
export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  dueDate?: Date;
  priority: TaskPriority;
  category: TaskCategory;
}

export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskCategory = 'work' | 'personal' | 'health' | 'finance' | 'other';

export interface TaskFilter {
  category?: TaskCategory;
  priority?: TaskPriority;
  completed?: boolean;
  searchTerm?: string;
}
