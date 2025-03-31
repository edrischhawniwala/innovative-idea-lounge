
import { User, Post, Comment, Notification } from "../types";

export const currentUser: User = {
  id: "current-user",
  name: "Alex Johnson",
  username: "alextrader",
  avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  bio: "Passionate forex trader with 5+ years of experience. Always looking to share insights and strategies.",
  role: "member",
  joinDate: "2022-01-15",
  followers: 243,
  following: 187
};

export const mockUsers: User[] = [
  {
    id: "user1",
    name: "Sarah Martinez",
    username: "sarahtrading",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    bio: "Day trader focusing on tech stocks. Sharing my journey and analysis.",
    role: "service_provider",
    joinDate: "2020-06-22",
    followers: 1234,
    following: 421
  },
  {
    id: "user2",
    name: "Marcus Chen",
    username: "marcusfx",
    avatar: "https://randomuser.me/api/portraits/men/67.jpg",
    bio: "Forex specialist with 10+ years. I provide market analysis and signal services.",
    role: "service_provider",
    joinDate: "2019-03-14",
    followers: 5678,
    following: 231
  },
  {
    id: "user3",
    name: "Jessica Parker",
    username: "jparker",
    avatar: "https://randomuser.me/api/portraits/women/27.jpg",
    bio: "Crypto enthusiast and educator. Join my trading group!",
    role: "service_provider",
    joinDate: "2021-05-10",
    followers: 892,
    following: 340
  },
  {
    id: "user4",
    name: "David Wilson",
    username: "dwilson",
    avatar: "https://randomuser.me/api/portraits/men/12.jpg",
    bio: "Options trader focused on risk management and consistent returns.",
    role: "member",
    joinDate: "2022-02-19",
    followers: 451,
    following: 287
  },
  {
    id: "user5",
    name: "Emma Roberts",
    username: "eroberts",
    avatar: "https://randomuser.me/api/portraits/women/10.jpg",
    bio: "Trading coach and mentor. I help new traders build sustainable strategies.",
    role: "service_provider",
    joinDate: "2020-11-08",
    followers: 3241,
    following: 156
  }
];

export const mockPosts: Post[] = [
  {
    id: "post1",
    userId: "user1",
    content: "Just spotted a potential breakout on $TSLA. Technical analysis shows strong support at $800 with momentum indicators turning bullish. Anyone else watching this?",
    images: ["https://i.imgur.com/gCRcJjP.png"],
    createdAt: "2023-09-15T13:24:00Z",
    likes: 45,
    comments: 12,
    hasLiked: true,
    tags: ["stocks", "technicalanalysis", "tesla"]
  },
  {
    id: "post2",
    userId: "user2",
    content: "EUR/USD analysis for today: Watch for the key resistance level at 1.0950. If broken with conviction, we could see a push toward 1.1050. However, be cautious as the FOMC minutes are coming out later today.",
    images: ["https://i.imgur.com/pF0JiZB.png"],
    createdAt: "2023-09-15T09:15:00Z",
    likes: 78,
    comments: 23,
    hasLiked: false,
    tags: ["forex", "eurusd", "technicalanalysis"]
  },
  {
    id: "post3",
    userId: "user3",
    content: "Bitcoin forming a classic cup and handle pattern on the daily chart. This could signal a strong move up if we break resistance at $63K. Who's bullish on BTC right now?",
    images: ["https://i.imgur.com/DB5jTUq.png"],
    createdAt: "2023-09-14T17:42:00Z",
    likes: 124,
    comments: 36,
    hasLiked: true,
    tags: ["crypto", "bitcoin", "technicalanalysis"]
  },
  {
    id: "post4",
    userId: "user4",
    content: "Just closed my SPY puts for a 35% profit. I believe we're headed for a short-term correction based on overbought conditions and diverging indicators. Always secure profits!",
    createdAt: "2023-09-14T15:10:00Z",
    likes: 56,
    comments: 19,
    hasLiked: false,
    tags: ["options", "spy", "trading"]
  },
  {
    id: "post5",
    userId: "user5",
    content: "Today's lesson for new traders: Focus more on risk management than trying to find the 'perfect entry.' Remember, protecting your capital should always be priority #1. What's your risk management strategy?",
    createdAt: "2023-09-14T11:05:00Z",
    likes: 203,
    comments: 47,
    hasLiked: true,
    tags: ["education", "riskmanagement", "trading101"]
  }
];

export const mockComments: Comment[] = [
  {
    id: "comment1",
    postId: "post1",
    userId: "user2",
    content: "I'm seeing the same pattern. The daily MACD is also crossing over. Could be a good entry point!",
    createdAt: "2023-09-15T13:45:00Z",
    likes: 8,
    hasLiked: false
  },
  {
    id: "comment2",
    postId: "post1",
    userId: "user4",
    content: "Be careful though, there's overhead resistance at $850 from previous highs. I'm waiting for confirmation before entering.",
    createdAt: "2023-09-15T14:02:00Z",
    likes: 12,
    hasLiked: true
  },
  {
    id: "comment3",
    postId: "post2",
    userId: "user3",
    content: "Great analysis! Do you think the ECB policy decision tomorrow could affect this setup?",
    createdAt: "2023-09-15T09:38:00Z",
    likes: 4,
    hasLiked: false
  },
  {
    id: "comment4",
    postId: "post3",
    userId: "user5",
    content: "I'm also bullish on BTC, especially with the halving coming up next year. Historically, this has been a major catalyst.",
    createdAt: "2023-09-14T18:15:00Z",
    likes: 19,
    hasLiked: true
  }
];

export const mockNotifications: Notification[] = [
  {
    id: "notif1",
    userId: "current-user",
    type: "like",
    fromUserId: "user1",
    entityId: "post1",
    createdAt: "2023-09-15T14:25:00Z",
    isRead: false
  },
  {
    id: "notif2",
    userId: "current-user",
    type: "comment",
    fromUserId: "user2",
    entityId: "post3",
    content: "Great analysis! I agree with your assessment.",
    createdAt: "2023-09-15T13:10:00Z",
    isRead: false
  },
  {
    id: "notif3",
    userId: "current-user",
    type: "follow",
    fromUserId: "user3",
    createdAt: "2023-09-15T11:42:00Z",
    isRead: true
  },
  {
    id: "notif4",
    userId: "current-user",
    type: "mention",
    fromUserId: "user4",
    entityId: "post5",
    content: "What do you think about this @alextrader?",
    createdAt: "2023-09-15T10:17:00Z",
    isRead: true
  }
];

// Helper function to get a user by ID
export const getUserById = (userId: string): User | undefined => {
  if (userId === "current-user") return currentUser;
  return mockUsers.find(user => user.id === userId);
};

// Helper function to enrich posts with user data
export const getEnrichedPosts = (): Post[] => {
  return mockPosts.map(post => ({
    ...post,
    user: getUserById(post.userId)
  }));
};

// Helper function to enrich comments with user data
export const getEnrichedComments = (postId: string): Comment[] => {
  return mockComments
    .filter(comment => comment.postId === postId)
    .map(comment => ({
      ...comment,
      user: getUserById(comment.userId)
    }));
};

// Helper function to enrich notifications with user data
export const getEnrichedNotifications = (): Notification[] => {
  return mockNotifications.map(notification => ({
    ...notification,
    fromUser: getUserById(notification.fromUserId)
  }));
};
