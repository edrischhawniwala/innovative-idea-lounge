
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
  videos?: string[];
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

// Marketplace Types
export interface Service {
  id: string;
  providerId: string;
  provider?: User;
  title: string;
  description: string;
  category: ServiceCategory;
  type: ServiceType;
  price: number;
  isSubscription: boolean;
  subscriptionPeriod?: 'monthly' | 'quarterly' | 'yearly';
  rating: number;
  reviewCount: number;
  coverImage: string;
  createdAt: string;
  featured?: boolean;
}

export type ServiceCategory = 'signals' | 'analysis' | 'education' | 'mentoring' | 'freelance' | 'other';
export type ServiceType = 'one-time' | 'subscription' | 'hourly';

export interface ServiceReview {
  id: string;
  serviceId: string;
  userId: string;
  user?: User;
  rating: number;
  content: string;
  createdAt: string;
}

export interface ServiceFilter {
  category?: ServiceCategory;
  type?: ServiceType;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  searchTerm?: string;
}
