// import React from 'react';
// import { Tabs } from "expo-router";
// import { Ionicons } from '@expo/vector-icons';
// import { TabBar } from '@/components/TabBar';

// export default function TabLayout() {
//   return (
//     <Tabs tabBar={(props) => <TabBar {...props} />} screenOptions={{
//  headerShown: false,
//  // ✅ إضافة الأنماط هنا
//  tabBarStyle: {
//  height: 70, // يمكنك التحكم في الارتفاع
//  paddingBottom: 10, // لإضافة مسافة من الأسفل
//  },
//  }}
//  >
//       <Tabs.Screen name='index' options={{
//         title: 'Home ',
//         tabBarIcon: ({color}) => (
//           <Ionicons name='home-outline' size={22} color={color} />
//         )
//       }} />
//       <Tabs.Screen name='explore' options={{
//         title: 'Explore',
//         tabBarIcon: ({color}) => (
//           <Ionicons name='search-outline' size={22} color={color} />
//         )
//       }} />
//       <Tabs.Screen name='notifications' options={{
//         title: 'Notification',
//         tabBarIcon: ({color}) => (
//           <Ionicons name='notifications-outline' size={22} color={color} />
//         )
//       }} />
//       <Tabs.Screen name='cart' options={{
//         title: 'Cart',
//         tabBarBadge:2,
//         tabBarIcon: ({color}) => (
//           <Ionicons name='cart-outline' size={22} color={color} />
//         )
//       }} />
//       <Tabs.Screen name='profile' options={{
//         title: 'Profile',
//         tabBarIcon: ({color}) => (
//           <Ionicons name='person-outline' size={22} color={color} />
//         )
//       }} />
//     </Tabs>
//   );
// }

//////////////////////////////////////////////////
import React from 'react';
import { Tabs } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { TabBar } from '@/components/TabBar'; // ✅ نستخدم TabBar المخصص الذي لديك

export default function TabLayout() {
  return (
    // ✅ الخيارات screenOptions تنطبق على كل الشاشات في التبويبات
    <Tabs tabBar={(props) => <TabBar {...props} />} screenOptions={{
        headerShown: false, // ✅ هذا الخيار يخفي الهيدر الافتراضي
        tabBarStyle: {
            // ✅ هذه الأنماط تنطبق على التبويب السفلي نفسه
            height: 80, 
            paddingBottom: 50, 
        },
    }}>

        {/* ----------------------------------------------------- */}
        {/* ✅ Tab 1: الشاشة الرئيسية */}
        {/* ----------------------------------------------------- */}
        <Tabs.Screen name='index' options={{
            title: 'Home', // ✅ عنوان التبويب
            tabBarIcon: ({color}) => (
                <Ionicons name='home-outline' size={22} color={color} />
            )
        }} />

        {/* -----------------------------------------------------
        {/* ✅ Tab 2: شاشة الاستكشاف */}
        {/* ----------------------------------------------------- */}
        <Tabs.Screen name='explore' options={{
            title: 'Explore',
            tabBarIcon: ({color}) => (
                <Ionicons name='search-outline' size={22} color={color} />
            )
        }} /> 

        {/* ----------------------------------------------------- */}
        {/* ✅ Tab 4: شاشة السلة */}
        {/* ----------------------------------------------------- */}
        <Tabs.Screen name='cart' options={{
            title: 'Cart',
            tabBarBadge:2, // ✅ هذه الشارة تظهر رقمًا
            tabBarIcon: ({color}) => (
                <Ionicons name='cart-outline' size={22} color={color} />
            )
        }} />
        {/* -----------------------------------------------------
        {/* ----------------------------------------------------- */}
        {/* ✅ Tab 5: شاشة الحساب */}
        {/* ----------------------------------------------------- */}
        <Tabs.Screen name='profile' options={{
            title: 'Profile',
            tabBarIcon: ({color}) => (
                <Ionicons name='person-outline' size={22} color={color} />
            )
        }} />
       
      
        {/* ----------------------------------------------------- */}
        <Tabs.Screen name='orders' options={{
            title: 'Orders',
            tabBarIcon: ({color}) => (
                <Ionicons name='notifications-outline' size={22} color={color} />
            )
        }} /> 

        </Tabs>

  );
}