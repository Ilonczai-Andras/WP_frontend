export interface Reply {
  id: string;
  user: string;
  message: string;
  createdAt: Date;
}

export interface Conversation {
  id: string;
  user: string;
  avatarUrl: string;
  message: string;
  createdAt: Date;
  replies: Reply[];
}
