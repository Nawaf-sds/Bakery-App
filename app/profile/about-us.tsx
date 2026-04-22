// app/profile/about-us.tsx

import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import React from 'react';

const AboutUsScreen = () => {
    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: 'من نحن' }} />
            <Text style={styles.title}>عن شركتنا</Text>
            <Text style={styles.content}>
                هنا يمكنك كتابة النص الكامل لصفحة "من نحن".
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#a44444ff',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'right',
        marginBottom: 15,
    },
    content: {
        fontSize: 16,
        lineHeight: 24,
        textAlign: 'right',
    }
});

export default AboutUsScreen;