


////////////////////////////////////////////////////////////////////////////////////////

// import { Stack, router } from 'expo-router';
// import * as SplashScreen from 'expo-splash-screen';
// import { useEffect, useState } from 'react';
// import { useFonts } from 'expo-font';
// import 'react-native-reanimated';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// // 💡 1. إضافة استيراد مكتبة الإيماءات هنا
// import { GestureHandlerRootView } from 'react-native-gesture-handler';

// import { AuthProvider, useAuth } from '../lib/context/AuthContext';
// import { CartProvider } from '../lib/context/CartContext';
// import { WishlistProvider } from '../lib/context/WishlistContext';
// import { NotificationProvider } from '@/components/NotificationToast';

// SplashScreen.preventAutoHideAsync();

// function InitialLayoutContent() {
//     const { session, isLoading: isAuthLoading } = useAuth();
//     const [fontsLoaded, fontError] = useFonts({
//         SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
//     });
//     const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);

//     useEffect(() => {
//         if (fontsLoaded || fontError) {
//             if (!isAuthLoading) {
//                 SplashScreen.hideAsync();
//             }
//         }
//     }, [fontsLoaded, fontError, isAuthLoading]);

//     useEffect(() => {
//         if (isAuthLoading || !fontsLoaded) {
//             return; // انتظر حتى ينتهي تحميل المصادقة والخطوط
//         }

//         if (session) {
//             // إذا كان المستخدم مسجل دخوله، اذهب إلى الشاشات الرئيسية
//             router.replace('/(tabs)');
//         } else {
//             // إذا لم يكن مسجل دخوله، اذهب دائمًا إلى الشاشة الترحيبية
//             router.replace('/welcome');
//         }
//     }, [session, isAuthLoading, fontsLoaded]);

//     if (isAuthLoading || !fontsLoaded) {
//         return null;
//     }

//     return (
//         <Stack>
//             {/* شاشة احتياطية للمسار الرئيسي قبل إعادة التوجيه */}
//             {/* <Stack.Screen name="index" options={{ headerShown: false }} /> */}

//             <Stack.Screen name="welcome/index" options={{ headerShown: false }} />
//             <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//             <Stack.Screen name="signin" options={{ presentation: 'modal', headerShown: false }} />
//             <Stack.Screen name="signup" options={{ presentation: 'modal', headerShown: false }} />
//             <Stack.Screen name="product-details/[id]" options={{ headerTitle: 'تفاصيل المنتج' }} />
//         </Stack>
//     );
// }

// // app/_layout.tsx

// export default function RootLayout() {
//   return (
//     // 💡 2. تغليف التطبيق بالكامل وإعطائه flex: 1 لكي يملأ الشاشة
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <AuthProvider>
//         <CartProvider>
//           <WishlistProvider>
//             <InitialLayoutContent />
//           </WishlistProvider>
//         </CartProvider>
//       </AuthProvider>
//     </GestureHandlerRootView>
//   );
// }




import { Stack, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { useFonts } from 'expo-font';
import 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AuthProvider, useAuth } from '../lib/context/AuthContext';
import { CartProvider } from '../lib/context/CartContext';
import { WishlistProvider } from '../lib/context/WishlistContext';

// 💡 1. إضافة catch لتجنب أخطاء بدء التشغيل في iOS
SplashScreen.preventAutoHideAsync().catch(() => {
  /* تجاهل الخطأ في بيئة التطوير */
});

function InitialLayoutContent() {
  const { session, isLoading: isAuthLoading } = useAuth();
  const [fontsLoaded, fontError] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // 💡 2. دمجنا منطق إخفاء الشاشة والتوجيه في useEffect واحد لتجنب التعارض
  useEffect(() => {
    // إذا كانت الخطوط لم تحمل بعد أو المصادقة قيد التحميل، لا تفعل شيئاً
    if (isAuthLoading || (!fontsLoaded && !fontError)) {
      return;
    }

    // إخفاء شاشة التحميل بأمان (تجاهل الخطأ إذا كانت مخفية مسبقاً)
    SplashScreen.hideAsync().catch(() => {});

    // توجيه المستخدم فوراً
    if (session) {
      router.replace('/(tabs)');
    } else {
      router.replace('/welcome');
    }
  }, [session, isAuthLoading, fontsLoaded, fontError]);

  if (isAuthLoading || (!fontsLoaded && !fontError)) {
    return null;
  }

  return (
    <Stack>
      {/* تأكد من وجود شاشة البداية index إذا كان التطبيق يفتح عليها */}
      <Stack.Screen name="welcome/index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="signin" options={{ presentation: 'modal', headerShown: false }} />
      <Stack.Screen name="signup" options={{ presentation: 'modal', headerShown: false }} />
      <Stack.Screen name="product-details/[id]" options={{ headerTitle: 'تفاصيل المنتج' }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <InitialLayoutContent />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}