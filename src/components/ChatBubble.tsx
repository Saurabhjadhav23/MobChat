import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    runOnJS,
} from 'react-native-reanimated';
import { Message } from '../types/Message';
import AudioMessage from './AudioPlayer';

type Props = {
    message: Message;
    onDelete: () => void;
    onReply?: (msg: Message) => void;
};

export default function ChatBubble({ message, onDelete, onReply }: Props) {
    const translateX = useSharedValue(0);
    const SWIPE_THRESHOLD = 80;


    const panGesture = Gesture.Pan()
        .onUpdate(e => {
            console.log('pan working');
            // Only respond to horizontal swipes
            if (Math.abs(e.translationX) > Math.abs(e.translationY)) {
                console.log('comsing in if');

                translateX.value = e.translationX;
            }
        })
        .onEnd(() => {
            console.log(SWIPE_THRESHOLD, translateX.value, 'coming in end');
            if (translateX.value > SWIPE_THRESHOLD - 50 && onReply) {
                runOnJS(onReply)(message);
            } else if (translateX.value < -SWIPE_THRESHOLD) {
                translateX.value = withTiming(-500, {}, () => {
                    runOnJS(onDelete)();
                });
            }
            translateX.value = withTiming(0);
        });


    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
        opacity: translateX.value < -100 ? 0 : 1,
    }));

    return (
        <GestureDetector gesture={panGesture}>
            <Animated.View style={[styles.bubble, animatedStyle]}>
                {message.replyTo && (
                    <View style={styles.replyContainer}>
                        <Text style={styles.replyText} numberOfLines={1}>
                            ↪ {message.replyTo.type === 'audio'
                                ? '🎵 Audio message'
                                : message.replyTo.text}
                        </Text>
                    </View>
                )}
                {message.type === 'text' ? (
                    <Text style={styles.text}>{message.text}</Text>
                ) : (
                    message.audioUri && <AudioMessage uri={message.audioUri} />
                )}
            </Animated.View>
        </GestureDetector>
    );
}

const styles = StyleSheet.create({
    bubble: {
        backgroundColor: '#1f1f1f',
        padding: 10,
        borderRadius: 10,
        marginVertical: 4,
        marginHorizontal: 10,
        alignSelf: 'flex-end',
        maxWidth: '80%',
        marginRight: 20,
    },
    replyContainer: {
        borderLeftWidth: 2,
        borderLeftColor: '#888',
        paddingLeft: 8,
        marginBottom: 4,
    },
    replyText: {
        color: '#aaa',
        fontSize: 13,
    },
    text: {
        color: 'white',
        fontSize: 16,
    },
});
