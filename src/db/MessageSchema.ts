export const MessageSchema = {
  name: 'Message',
  properties: {
    id: 'string',
    text: 'string?',
    type: 'string',
    audioUrl: 'string?',
    timestamp: 'Date',
    senderId: 'string',
    replyToId: 'string?',
    status: 'string',
  },
  primaryKey: 'id',
};
