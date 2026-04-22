import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import type { GestureResponderEvent } from 'react-native';
import babel from '@babel/core';
import { icon } from '@/constants/Icons';
import { Colors  } from '@/constants/Colors';

type RouteName = 'index' | 'explore' | 'notifications' | 'cart' | 'profile';

type Props = {
onPress: (event: GestureResponderEvent) => void;
onLongPress: (event: GestureResponderEvent) => void;
isFocused: boolean;
label: string;
routeName: RouteName;
};

const TabButton=(props: Props) =>{
    const { onPress, onLongPress, isFocused, routeName } = props;
    return (
        <Pressable
           onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabbarBtn}
        >

            {routeName == 'cart' && (
                //Cart Badge is Here
                <View style={styles.badgeWrapper}>
                    <Text style={styles.stbadgeText}>3</Text>
                    </View>
                    )}
                    {icon[routeName]({
                        color: isFocused ? Colors.primary : Colors.black,
                    })}
                    
             <Text style={{ color: isFocused ? "#673ab7" : "#222" }}>{props.label}</Text>
                </Pressable>
            )}

            export default TabButton;

const styles = StyleSheet.create({
    tabbarBtn: { 
        flex: 1,   
        justifyContent: 'center',
        alignItems: 'center',
        gap: 3,
    },
    badgeWrapper: {
        position: 'absolute',
        backgroundColor: Colors.highlight,
        top: -5,
        right: 12,
        paddingVertical: 1,
        paddingHorizontal: 5,
        borderRadius: 10,
        zIndex: 10,
    },
    stbadgeText: {
        color: Colors.black,
        fontSize: 12,
    },
});