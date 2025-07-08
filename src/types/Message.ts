export type Message = {
  id: string;
  text: any;
  audioUri?: string;
  type: 'text';
  timestamp: number;
  senderId: string;
  status: 'sent';
  replyTo?: {
    id: string;
    text: string;
  };
};
