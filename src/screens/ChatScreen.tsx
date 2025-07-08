import React, { useState } from 'react';
import {
    View,
    FlatList,
    TextInput,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    TouchableWithoutFeedback,
    Keyboard,
    TouchableOpacity,
    Text,
} from 'react-native';
import { useChat } from '../context/ChatContext';
import ChatBubble from '../components/ChatBubble';
import { Message } from '../types/Message';
import { useAudioRecorder } from '../hooks/useAudioRecorder';

export default function ChatScreen() {
    const chat = useChat();
    const {
        messages = [],
        sendMessage = () => { },
        deleteMessage = () => { },
    } = chat;

    const [text, setText] = useState('');
    const [replyTo, setReplyTo] = useState<Message | null>(null);

    const {
        recording,
        startRecording,
        stopRecording,
    } = useAudioRecorder();

    const handleSend = () => {
        if (text.trim()) {
            sendMessage(text, replyTo ?? undefined);
            setText('');
            setReplyTo(null);
        }
    };

    const handleSendAudio = async () => {

        const uri = await stopRecording();
        console.log(uri, 'uri in handleSendAudio');

        if (uri) {
            sendMessage('', 'audio', uri);
        }
    };


    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
            >
                <View style={styles.header}>
                    <Text style={styles.headerText}>MobChat</Text>
                </View>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.inner}>
                        <FlatList
                            data={messages}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => (
                                <ChatBubble
                                    message={item}
                                    onDelete={() => deleteMessage(item.id)}
                                    onReply={(msg) => setReplyTo(msg)}
                                />
                            )}
                            keyboardShouldPersistTaps="handled"
                            inverted
                            contentContainerStyle={{ paddingTop: 16 }}
                        />

                        {replyTo && (
                            <View style={styles.replyPreview}>
                                <Text style={styles.replyLabel}>Replying to:</Text>
                                <Text style={styles.replyText} numberOfLines={1}>
                                    {(replyTo as any).type === 'audio' ? '🎵 Audio message' : replyTo.text}
                                </Text>
                                <TouchableOpacity onPress={() => setReplyTo(null)}>
                                    <Text style={styles.closeReply}>×</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        <View style={styles.inputRow}>
                            <TextInput
                                value={text}
                                onChangeText={setText}
                                placeholder="Type a message"
                                placeholderTextColor="#999"
                                style={styles.input}
                            />

                            <TouchableOpacity
                                style={[styles.button, { backgroundColor: recording ? 'grey' : 'grey', width: 40, marginRight: 5 }]}
                                onPress={recording ? handleSendAudio : startRecording}
                            >
                                <Text style={{ color: '#fff', fontSize: 18 }}>
                                    {recording ? '⏹️' : '🎙️'}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={handleSend}>
                                <Text style={{ color: '#fff', fontSize: 22, marginTop: -5 }}>➤</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#000',
    },
    container: {
        flex: 1,
    },
    inner: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    inputRow: {
        flexDirection: 'row',
        padding: 8,
        borderTopWidth: 1,
        borderTopColor: '#222',
        backgroundColor: '#000',
        marginBottom: 12,
    },
    input: {
        flex: 1,
        padding: 12,
        color: '#fff',
        backgroundColor: '#111',
        borderRadius: 8,
        marginRight: 10,
    },
    button: {
        padding: 5,
        backgroundColor: '#007AFF',
        borderRadius: 20,
        width: 60,
        height: 35,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 5,
    },
    replyPreview: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1a1a1a',
        marginHorizontal: 10,
        marginBottom: 6,
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 8,
    },
    replyLabel: {
        color: '#999',
        marginRight: 4,
        fontSize: 13,
    },
    replyText: {
        color: '#fff',
        flex: 1,
        fontSize: 13,
    },
    closeReply: {
        color: '#f66',
        fontSize: 18,
        fontWeight: 'bold',
        paddingLeft: 8,
        paddingRight: 4,
    },
    header: {
        paddingVertical: 14,
        paddingHorizontal: 20,
        backgroundColor: '#000',
        borderBottomWidth: 1,
        borderBottomColor: '#222',
        alignItems: 'center',
        marginTop: 40
    },

    headerText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
});
