export interface MessageReply {
  key?: string;
  senderId: string;
  senderRole: 'admin' | 'user';
  message: string;
  createdAt: string;
}

export interface ContactMessage {
  key?: string;
  userId: string;
  userEmail: string;
  userName: string;
  userPhoto?: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'unread' | 'read' | 'replied';
  replies?: { [key: string]: MessageReply } | MessageReply[];
}