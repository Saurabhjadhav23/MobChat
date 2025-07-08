// src/db/realm.ts
import Realm from 'realm';

export const MessageSchema: Realm.ObjectSchema = {
  name: 'Message',
  primaryKey: 'id',
  properties: {
    id: 'string',
    text: 'string?',
    type: 'string',
    audioUrl: 'string?',
    timestamp: 'int',
    senderId: 'string',
    replyToId: 'string?',
    status: 'string',
  },
};

let _realm: Realm | null = null;

export const openRealm = async (): Promise<Realm> => {
  if (_realm) return _realm;

  try {
    const realm = await Realm.open({
      path: 'chatMessages.realm',
      schema: [MessageSchema],
      schemaVersion: 2,
    });

    _realm = realm;
    console.log('Realm opened successfully');
    return realm;
  } catch (err) {
    console.error('Failed to open Realm:', err);
    throw err;
  }
};
