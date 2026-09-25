export interface MessageReply {
  key?: string;
  senderId: string;
  senderRole: 'admin' | 'user';
  message: string;
  createdAt: string;
}

export interface UserMessage {
  key?: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhoto?: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'unread' | 'read' | 'replied';
  replies?: { [key: string]: MessageReply } | MessageReply[];
}