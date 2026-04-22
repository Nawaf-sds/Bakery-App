// components/NotificationToast.tsx

import React, { useState, useEffect, createContext, useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// --- إنشاء سياق للتحكم في الإشعار ---
const NotificationContext = createContext({
    showNotification: (message: string) => {},
});

export const useNotification = () => useContext(NotificationContext);

// --- مزود سياق الإشعار ---
export const NotificationProvider = ({ children }) => {
    const [message, setMessage] = useState('');
    const [isVisible, setIsVisible] = useState(false);

    const showNotification = (msg: string) => {
        setMessage(msg);
        setIsVisible(true);
    };

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            <NotificationToast message={message} isVisible={isVisible} onHide={() => setIsVisible(false)} />
        </NotificationContext.Provider>
    );
};

// --- مكون الإشعار نفسه ---
const NotificationToast = ({ message, isVisible, onHide }) => {
    const topPosition = useSharedValue(-100); // يبدأ خارج الشاشة
    const progress = useSharedValue(1); // يبدأ شريط التقدم ممتلئًا
    const insets = useSafeAreaInsets(); // للحصول على مساحة الأمان العلوية (Notch)

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: topPosition.value }], // يحرك الإشعار للأسفل والأعلى
        };
    });

    const progressStyle = useAnimatedStyle(() => {
        return {
            width: `${progress.value * 100}%`, // يتحكم في عرض شريط التقدم
        };
    });

    useEffect(() => {
        if (isVisible) {
            // إظهار الإشعار
            topPosition.value = withTiming(insets.top, { duration: 300 }); // تحريك للأسفل
            progress.value = 1; // إعادة تعيين شريط التقدم

            // بدء حركة شريط التقدم
            progress.value = withTiming(0, { duration: 2000 }, () => {
                // عند انتهاء حركة الشريط، إخفاء الإشعار
                topPosition.value = withTiming(-100, { duration: 300 }, () => {
                    runOnJS(onHide)(); // استدعاء دالة الإخفاء
                });
            });
        }
    }, [isVisible]);

    if (!isVisible) return null;

    return (
        <Animated.View style={[styles.container, animatedStyle]}>
            <View style={styles.content}>
                <Ionicons name="checkmark-circle" size={24} color="#28a745" />
                <Text style={styles.message}>{message}</Text>
            </View>
            <Animated.View style={styles.progressBarContainer}>
                <Animated.View style={[styles.progressBar, progressStyle]} />
            </Animated.View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 20,
        right: 20,
        backgroundColor: '#fff',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        zIndex: 9999,
        overflow: 'hidden', // لإخفاء شريط التقدم الزائد
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
    },
    message: {
        marginLeft: 10,
        fontSize: 16,
        fontWeight: '600',
    },
    progressBarContainer: {
        height: 4, // ارتفاع حاوية شريط التقدم
        backgroundColor: '#e9ecef', // لون الخلفية للشريط
    },
    progressBar: {
        height: '100%', // يأخذ كامل ارتفاع الحاوية
        backgroundColor: '#28a745', // لون شريط التقدم
    },
});