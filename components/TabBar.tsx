import { View, Platform ,StyleSheet, LayoutChangeEvent} from 'react-native';
import { useLinkBuilder, useTheme } from '@react-navigation/native';
import { Text, PlatformPressable } from '@react-navigation/elements';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import TabButton from './TabButton';
import { Colors } from '@/constants/Colors';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import {useEffect, useState} from "react";

export  function TabBar({ state, descriptors, navigation }:  BottomTabBarProps) {
 const { colors } = useTheme();
  const { buildHref } = useLinkBuilder();
  const [dimensions,setDimensions] = useState({height:20, width:100})

   const buttonWidth = dimensions.width / state.routes.length;

   useEffect(() => {
    tabPositionX.value = withTiming(buttonWidth * state.index, {
      duration:150,
    });
   },[state.index] );

  const onTabBarLayout = (e:LayoutChangeEvent) => {
    setDimensions ({
     height:e.nativeEvent.layout.height,
       width:e.nativeEvent.layout.width,
    });
  };

   const tabPositionX = useSharedValue(0);

   const AnimatedStyle = useAnimatedStyle (() =>{
    return {
transform:[{translateX: tabPositionX.value}]
    }
   });

  return (
    <View onLayout={onTabBarLayout} style={styles.tabbar}>
      
      <Animated.View style ={ [AnimatedStyle,{
        position:'absolute',
        backgroundColor: Colors.primary,
        top:0,
        left:20,
        height:2,
        // width: buttonWidth /2,   // عرض الخط السفلي يساوي نصف عرض الزر
        width: buttonWidth -40,   // عرض الخط السفلي يساوي نصف عرض الزر
        borderRadius:1,
      }]}/>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          typeof options.tabBarLabel === 'string'
            ? options.tabBarLabel
            : typeof options.title === 'string'
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
         <TabButton 
         key={route.name}
         onPress={onPress} 
         onLongPress={onLongPress}
          isFocused={isFocused}
          routeName={route.name}
          label={label}
          />
        );
      })}
    </View>
  );
}




const styles = StyleSheet.create({
tabbar:{
   flexDirection: 'row', 
   paddingTop:10,
   paddingBottom:25,
   backgroundColor:Colors.white,
  }

})

