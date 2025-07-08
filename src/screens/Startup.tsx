import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Animated,
} from 'react-native';

const SplashScreen = () => {
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
        }).start();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>MobChat</Text>
            <Text style={styles.subtitle}>Fast. Private. Secure.</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        height: 120,
        width: 120,
        marginBottom: 20,
    },
    title: {
        fontSize: 30,
        color: '#00BFFF',
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 14,
        color: '#ccc',
        marginTop: 6,
    },
});

export default SplashScreen;
