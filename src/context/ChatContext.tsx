import React, { createContext, useContext, useState, useEffect } from 'react';
import uuid from 'react-native-uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Message } from '../types/Message';

const STORAGE_KEY = 'chat_messages';

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        (async () => {
            try {
                const stored = await AsyncStorage.getItem(STORAGE_KEY);
                if (stored) {
                    const parsed = JSON.parse(stored);
                    setMessages(parsed);
                    console.log('Loaded messages from storage');
                }
            } catch (e) {
                console.error('Error loading messages:', e);
            }
        })();
    }, []);

    const persistAndSet = async (newMessages: Message[]) => {
        setMessages(newMessages);
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newMessages));
        } catch (e) {
            console.error('Error saving messages:', e);
        }
    };

    const sendMessage = (
        text: string,
        replyTo?: Message,
        audioUri?: string
    ) => {
        const newMsg: Message = {
            id: uuid.v4().toString(),
            text,
            type: audioUri ? 'audio' : 'text',
            audioUri,
            timestamp: Date.now(),
            senderId: 'user1',
            status: 'sent',
            replyTo: replyTo && replyTo.id
                ? {
                    id: replyTo.id,
                    text: replyTo.text,
                    type: replyTo.type,
                    audioUri: replyTo.audioUri,
                }
                : undefined
        };

        const updatedMessages = [newMsg, ...messages];
        persistAndSet(updatedMessages);
    };


    const deleteMessage = (id: string) => {
        const updated = messages.filter(msg => msg.id !== id);
        persistAndSet(updated);
    };

    return (
        <ChatContext.Provider value={{ messages, sendMessage, deleteMessage }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => useContext(ChatContext);
