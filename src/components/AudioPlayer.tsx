import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

const player = new AudioRecorderPlayer();

export default function AudioMessage({ uri }: { uri: string }) {
    const [playing, setPlaying] = useState(false);

    const togglePlay = async () => {
        try {
            if (playing) {
                await player.stopPlayer();
                setPlaying(false);
            } else {
                await player.startPlayer(uri);
                setPlaying(true);
                player.addPlayBackListener(e => {
                    if (e.current_position >= e.duration) {
                        player.stopPlayer();
                        setPlaying(false);
                    }
                    return;
                });
            }
        } catch (err) {
            console.log('Playback failed:', err);
        }
    };

    return (
        <TouchableOpacity onPress={togglePlay} style={styles.container}>
            <Text style={styles.icon}>{playing ? '⏸️  Stop' : '▶️  Play Audio'}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#333',
        padding: 10,
        paddingHorizontal: 25,
        borderRadius: 20,
    },
    icon: {
        color: 'white',
        fontSize: 16,
    },
});
