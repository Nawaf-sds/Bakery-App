
// import React, { useState } from 'react';
// import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import { Link, router, Stack } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons';
// import { Colors } from '@/constants/Colors';
// import InputField from '@/components/InputField';

// import SocialLoginButtons from '@/components/SocialLoginButtons';

// import { login } from '@/libs/services/authService'; // أو المسار الصحيح بناءً على هيكل مجلداتك
// import { useAuth } from '@/lib/context/AuthContext'; // ✨ الخطوة 1: استيراد useAuth

// const SignInScreen = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const { signIn } = useAuth(); // ✨ الخطوة 2: جلب دالة signIn من السياق

//   const handleLogin = async () => {
//     // التحقق من المدخلات
//     if (!email || !password) {
//       Alert.alert('خطأ', 'الرجاء إدخال البريد الإلكتروني وكلمة المرور');
//       return;
//     }

//     try {
//       const data = await login(email, password); // `data` هنا تحتوي على معلومات الجلسة (token, user)

//       // ✨ الخطوة 3: هذا هو الحل!
//       // نقوم بتحديث الحالة العامة للتطبيق بمعلومات الجلسة الجديدة
//       signIn(data);

//       // الآن يمكننا المتابعة كالمعتاد
//       Alert.alert('نجاح ✅', 'تم تسجيل الدخول بنجاح');
//       router.dismissAll();
//       router.push('/(tabs)');
//     } catch (err: any) {
//       const errorMessage = err.message || 'فشل تسجيل الدخول. يرجى المحاولة لاحقًا.';
//       Alert.alert('خطأ', errorMessage);
//     }
//   };

//   return (
//     <>
//       <Stack.Screen
//         options={{
//           headerTitle: 'Login',
//           headerLeft: () => (
//             <TouchableOpacity onPress={() => router.back()}>
//               <Ionicons name="close" size={28} color={Colors.black} />
//             </TouchableOpacity>
//           ),
//         }}
//       />
//       <View style={styles.container}>
//         <Text style={styles.title}>Login to Your Account</Text>

//         <InputField
//           placeholder="Email Address"
//           placeholderTextColor={Colors.gray}
//           autoCapitalize="none"
//           keyboardType="email-address"
//           value={email}
//           onChangeText={setEmail}
//         />
//         <InputField
//           placeholder="Password"
//           placeholderTextColor={Colors.gray}
//           secureTextEntry={true}
//           value={password}
//           onChangeText={setPassword}
//         />

//         <TouchableOpacity style={styles.btn} onPress={handleLogin}>
//           <Text style={styles.btnTxt}>Login</Text>
//         </TouchableOpacity>

//         <Text style={styles.loginTxt}>
//           Don't have an account?{' '}
//           <Link href="/signup" asChild>
//             <TouchableOpacity>
//               <Text style={styles.loginTxtSpan}>Sign Up</Text>
//             </TouchableOpacity>
//           </Link>
//         </Text>

//         <View style={styles.divder} />
//         <SocialLoginButtons emailHref="/signin" />
//       </View>
//     </>
//   );
// };

// export default SignInScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: Colors.background,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: '600',
//     color: Colors.black,
//     marginBottom: 50,
//     letterSpacing: 1,
//   },
//   inputField: {
//     backgroundColor: Colors.white,
//     paddingVertical: 15,
//     paddingHorizontal: 19,
//     alignSelf: 'stretch',
//     borderRadius: 5,
//     fontSize: 16,
//     color: Colors.black,
//     marginBottom: 50,
//   },
//   btn: {
//     backgroundColor: Colors.primary,
//     paddingVertical: 15,
//     alignSelf: 'stretch',
//     alignItems: 'center',
//     borderRadius: 6,
//     marginBottom: 22,
//   },
//   btnTxt: {
//     color: Colors.white,
//     fontSize: 18,
//     fontWeight: '600',
//   },
//   loginTxt: {
//     marginBottom: 30,
//     fontSize: 14,
//     lineHeight: 24,
//   },
//   loginTxtSpan: {
//     color: Colors.primary,
//     fontWeight: '600',
//   },
//   divder: {
//     borderTopColor: Colors.gray,
//     borderTopWidth: StyleSheet.hairlineWidth,
//     width: '30%',
//     marginBottom: 30,
//   },
// });



// import React, { useState, useEffect } from 'react'; // أضفنا useEffect
// import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import { Link, router, Stack } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons';
// import { Colors } from '@/constants/Colors';
// import InputField from '@/components/InputField';
// import SocialLoginButtons from '@/components/SocialLoginButtons';
// import { login } from '@/libs/services/authService'; 
// import { useAuth } from '@/lib/context/AuthContext'; 

// // 1. استيراد المكتبات الجديدة
// import * as Google from 'expo-auth-session/providers/google';
// import * as AppleAuthentication from 'expo-apple-authentication';

// const SignInScreen = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const { signIn } = useAuth(); 

//   // 2. إعداد طلب جوجل (Hook)
//   const [request, response, promptAsync] = Google.useAuthRequest({
//     iosClientId: 'YOUR_IOS_CLIENT_ID',
//     androidClientId: 'YOUR_ANDROID_CLIENT_ID',
//   });

//   // 3. مراقبة استجابة جوجل عند نجاح العملية
//   useEffect(() => {
//     if (response?.type === 'success') {
//       const { authentication } = response;
//       handleSocialLogin('google', authentication?.idToken);
//     }
//   }, [response]);

//   // 4. دالة موحدة للتعامل مع تسجيل الدخول الاجتماعي (Google & Apple)
//   const handleSocialLogin = async (provider: 'google' | 'apple', token: string | undefined | null) => {
//     if (!token) return;
//     try {
//       // هنا نفترض وجود دالة في authService تسمى socialLogin تتعامل مع الباك أند
//       // const data = await socialLogin(provider, token); 
//       // signIn(data);
//       router.replace('/(tabs)');
//     } catch (err) {
//       Alert.alert('خطأ', 'فشل تسجيل الدخول الاجتماعي');
//     }
//   };

//   // 5. دالة تسجيل دخول آبل
//   const handleAppleLogin = async () => {
//     try {
//       const credential = await AppleAuthentication.signInAsync({
//         requestedScopes: [
//           AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
//           AppleAuthentication.AppleAuthenticationScope.EMAIL,
//         ],
//       });
//       handleSocialLogin('apple', credential.identityToken);
//     } catch (e: any) {
//       if (e.code !== 'ERR_REQUEST_CANCELED') {
//         Alert.alert('خطأ', 'فشل تسجيل الدخول عبر آبل');
//       }
//     }
//   };

//   const handleLogin = async () => {
//     if (!email || !password) {
//       Alert.alert('خطأ', 'الرجاء إدخال البريد الإلكتروني وكلمة المرور');
//       return;
//     }

//     try {
//       const data = await login(email, password); 
//       signIn(data);
//       Alert.alert('نجاح ✅', 'تم تسجيل الدخول بنجاح');
//       router.dismissAll();
//       router.push('/(tabs)');
//     } catch (err: any) {
//       const errorMessage = err.message || 'فشل تسجيل الدخول. يرجى المحاولة لاحقًا.';
//       Alert.alert('خطأ', errorMessage);
//     }
//   };

//   return (
//     <>
//       <Stack.Screen
//         options={{
//           headerTitle: 'Login',
//           headerLeft: () => (
//             <TouchableOpacity onPress={() => router.back()}>
//               <Ionicons name="close" size={28} color={Colors.black} />
//             </TouchableOpacity>
//           ),
//         }}
//       />
//       <View style={styles.container}>
//         <Text style={styles.title}>Login to Your Account</Text>

//         <InputField
//           placeholder="Email Address"
//           placeholderTextColor={Colors.gray}
//           autoCapitalize="none"
//           keyboardType="email-address"
//           value={email}
//           onChangeText={setEmail}
//         />
//         <InputField
//           placeholder="Password"
//           placeholderTextColor={Colors.gray}
//           secureTextEntry={true}
//           value={password}
//           onChangeText={setPassword}
//         />

//         <TouchableOpacity style={styles.btn} onPress={handleLogin}>
//           <Text style={styles.btnTxt}>Login</Text>
//         </TouchableOpacity>

//         <Text style={styles.loginTxt}>
//           Don't have an account?{' '}
//           <Link href="/signup" asChild>
//             <TouchableOpacity>
//               <Text style={styles.loginTxtSpan}>Sign Up</Text>
//             </TouchableOpacity>
//           </Link>
//         </Text>

//         <View style={styles.divder} />
        
//         {/* 6. تمرير الدوال الجديدة لمكون الأزرار */}
//         <SocialLoginButtons 
//           emailHref="/signin" 
//           onGooglePress={() => promptAsync()} 
//           onApplePress={handleAppleLogin}
//         />
//       </View>
//     </>
//   );
// };

// export default SignInScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: Colors.background,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: '600',
//     color: Colors.black,
//     marginBottom: 50,
//     letterSpacing: 1,
//   },
//   inputField: {
//     backgroundColor: Colors.white,
//     paddingVertical: 15,
//     paddingHorizontal: 19,
//     alignSelf: 'stretch',
//     borderRadius: 5,
//     fontSize: 16,
//     color: Colors.black,
//     marginBottom: 50,
//   },
//   btn: {
//     backgroundColor: Colors.primary,
//     paddingVertical: 15,
//     alignSelf: 'stretch',
//     alignItems: 'center',
//     borderRadius: 6,
//     marginBottom: 22,
//   },
//   btnTxt: {
//     color: Colors.white,
//     fontSize: 18,
//     fontWeight: '600',
//   },
//   loginTxt: {
//     marginBottom: 30,
//     fontSize: 14,
//     lineHeight: 24,
//   },
//   loginTxtSpan: {
//     color: Colors.primary,
//     fontWeight: '600',
//   },
//   divder: {
//     borderTopColor: Colors.gray,
//     borderTopWidth: StyleSheet.hairlineWidth,
//     width: '30%',
//     marginBottom: 30,
//   },
// });




// import React, { useState, useEffect } from 'react';
// import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import { Link, router, Stack } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons';
// import { Colors } from '@/constants/Colors';
// import InputField from '@/components/InputField';
// import SocialLoginButtons from '@/components/SocialLoginButtons';
// import { login } from '@/libs/services/authService'; 
// import { useAuth } from '@/lib/context/AuthContext'; 

// // 1. استيراد المكتبات (تأكد من تنفيذ npx expo install لها)
// import * as Google from 'expo-auth-session/providers/google';
// import * as AppleAuthentication from 'expo-apple-authentication';

// const SignInScreen = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const { signIn } = useAuth(); 

//   // 2. إعداد طلب جوجل 
//   // ملاحظة: يجب وضع IDs حقيقية من Google Cloud Console لكي يعمل الزر
//   const [request, response, promptAsync] = Google.useAuthRequest({
//     iosClientId: 'YOUR_IOS_CLIENT_ID',
//     androidClientId: 'YOUR_ANDROID_CLIENT_ID',
//   });

//   // 3. مراقبة استجابة جوجل
//   useEffect(() => {
//     if (response?.type === 'success') {
//       const { authentication } = response;
//       // نرسل الـ idToken للباك أند
//       handleSocialLogin('google', authentication?.idToken);
//     } else if (response?.type === 'error') {
//       Alert.alert('خطأ جوجل', 'فشل الاتصال بخدمات جوجل، تحقق من إعدادات المشروع');
//     }
//   }, [response]);

//   // 4. دالة تسجيل الدخول الاجتماعي الموحدة
//   const handleSocialLogin = async (provider: 'google' | 'apple', token: string | undefined | null) => {
//     if (!token) {
//       Alert.alert('خطأ', 'لم يتم استلام رمز التحقق من المزود');
//       return;
//     }
    
//     try {
//       // هنا يتم استدعاء الباك أند الخاص بك
//       // const data = await socialLogin(provider, token); 
//       // signIn(data);
//       console.log(`تم تسجيل الدخول عبر ${provider} بنجاح، التوكن:`, token);
//       router.replace('/(tabs)');
//     } catch (err) {
//       Alert.alert('خطأ في السيرفر', 'فشل ربط الحساب الاجتماعي مع قاعدة البيانات');
//     }
//   };

//   // 5. دالة تسجيل دخول آبل
//   const handleAppleLogin = async () => {
//     try {
//       const credential = await AppleAuthentication.signInAsync({
//         requestedScopes: [
//           AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
//           AppleAuthentication.AppleAuthenticationScope.EMAIL,
//         ],
//       });
//       handleSocialLogin('apple', credential.identityToken);
//     } catch (e: any) {
//       // منع إظهار خطأ إذا قام المستخدم بإلغاء النافذة بنفسه
//       if (e.code !== 'ERR_REQUEST_CANCELED') {
//         Alert.alert('خطأ آبل', 'تأكد أنك تستخدم جهاز آيفون حقيقي ويدعم الخدمة');
//       }
//     }
//   };

//   // 6. تسجيل الدخول التقليدي (ايميل وباسورد)
//   const handleLogin = async () => {
//     if (!email || !password) {
//       Alert.alert('خطأ', 'الرجاء إدخال البريد الإلكتروني وكلمة المرور');
//       return;
//     }

//     try {
//       const data = await login(email, password); 
//       signIn(data);
//       Alert.alert('نجاح ✅', 'تم تسجيل الدخول بنجاح');
//       router.dismissAll();
//       router.push('/(tabs)');
//     } catch (err: any) {
//       const errorMessage = err.message || 'فشل تسجيل الدخول. يرجى المحاولة لاحقًا.';
//       Alert.alert('خطأ', errorMessage);
//     }
//   };

//   return (
//     <>
//       <Stack.Screen
//         options={{
//           headerTitle: 'Login',
//           headerLeft: () => (
//             <TouchableOpacity onPress={() => router.back()}>
//               <Ionicons name="close" size={28} color={Colors.black} />
//             </TouchableOpacity>
//           ),
//         }}
//       />
//       <View style={styles.container}>
//         <Text style={styles.title}>Login to Your Account</Text>

//         <InputField
//           placeholder="Email Address"
//           placeholderTextColor={Colors.gray}
//           autoCapitalize="none"
//           keyboardType="email-address"
//           value={email}
//           onChangeText={setEmail}
//         />
//         <InputField
//           placeholder="Password"
//           placeholderTextColor={Colors.gray}
//           secureTextEntry={true}
//           value={password}
//           onChangeText={setPassword}
//         />

//         <TouchableOpacity style={styles.btn} onPress={handleLogin}>
//           <Text style={styles.btnTxt}>Login</Text>
//         </TouchableOpacity>

//         <Text style={styles.loginTxt}>
//           Don't have an account?{' '}
//           <Link href="/signup" asChild>
//             <TouchableOpacity>
//               <Text style={styles.loginTxtSpan}>Sign Up</Text>
//             </TouchableOpacity>
//           </Link>
//         </Text>

//         <View style={styles.divder} />
        
//         {/* تمرير الدوال لمكون الأزرار مع نظام فحص الجاهزية */}
//         <SocialLoginButtons 
//           emailHref="/signin" 
//           onGooglePress={() => {
//             if (request) {
//               promptAsync();
//             } else {
//               Alert.alert('تنبيه', 'خدمة جوجل قيد التحميل أو المعرفات غير صحيحة');
//             }
//           }} 
//           onApplePress={handleAppleLogin}
//         />
//       </View>
//     </>
//   );
// };

// export default SignInScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: Colors.background,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: '600',
//     color: Colors.black,
//     marginBottom: 50,
//     letterSpacing: 1,
//   },
//   btn: {
//     backgroundColor: Colors.primary,
//     paddingVertical: 15,
//     alignSelf: 'stretch',
//     alignItems: 'center',
//     borderRadius: 6,
//     marginBottom: 22,
//   },
//   btnTxt: {
//     color: Colors.white,
//     fontSize: 18,
//     fontWeight: '600',
//   },
//   loginTxt: {
//     marginBottom: 30,
//     fontSize: 14,
//     lineHeight: 24,
//   },
//   loginTxtSpan: {
//     color: Colors.primary,
//     fontWeight: '600',
//   },
//   divder: {
//     borderTopColor: Colors.gray,
//     borderTopWidth: StyleSheet.hairlineWidth,
//     width: '30%',
//     marginBottom: 30,
//   },
// });



import React, { useState, useEffect } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Link, router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import InputField from '@/components/InputField';
import SocialLoginButtons from '@/components/SocialLoginButtons';
import { login } from '@/libs/services/authService'; 
import { useAuth } from '@/lib/context/AuthContext'; 

import * as Google from 'expo-auth-session/providers/google';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as WebBrowser from 'expo-web-browser';

// تهيئة جلسة المتصفح
WebBrowser.maybeCompleteAuthSession();

// 💡 هذا هو الرابط الآمن الذي يقبله جوجل، وسيقوم بتوجيهك لجوالك تلقائياً
const EXPO_REDIRECT_URI = 'https://auth.expo.io/@fdfdh/expo-ecommerece-app-starter';

const SignInScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useAuth(); 

  // 💡 إجبار التطبيق على استخدام الرابط الآمن في الطلب
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: '851219171748-92gcab645ovqsn2f1pnsjg65v2okr3ei.apps.googleusercontent.com',
    iosClientId: '851219171748-92gcab645ovqsn2f1pnsjg65v2okr3ei.apps.googleusercontent.com',
    androidClientId: '851219171748-t3ltnhimfhrl0nrri5pca92ssfi5r8l4.apps.googleusercontent.com',
    redirectUri: EXPO_REDIRECT_URI, // 👈 التعديل السحري هنا
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      handleSocialLogin('google', authentication?.idToken);
    } else if (response?.type === 'error') {
      console.log('Google Auth Error:', response.error);
    }
  }, [response]);

  const handleSocialLogin = async (provider: 'google' | 'apple', token: string | undefined | null) => {
    if (!token) return;
    try {
      console.log(`نجاح تسجيل دخول ${provider} بنجاح ✅`);
      router.replace('/(tabs)');
    } catch (err) {
      Alert.alert('خطأ', 'فشل ربط الحساب الاجتماعي');
    }
  };

  const handleAppleLogin = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      handleSocialLogin('apple', credential.identityToken);
    } catch (e: any) {
      if (e.code !== 'ERR_REQUEST_CANCELED') {
        Alert.alert('خطأ آبل', 'ميزة آبل تتطلب جهاز حقيقي');
      }
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('خطأ', 'الرجاء إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }
    try {
      const data = await login(email, password); 
      signIn(data);
      router.dismissAll();
      router.push('/(tabs)');
    } catch (err: any) {
      Alert.alert('خطأ', err.message || 'فشل تسجيل الدخول');
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: 'Login',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="close" size={28} color={Colors.black} />
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.container}>
        <Text style={styles.title}>Login to Your Account</Text>

        <InputField
          placeholder="Email Address"
          placeholderTextColor={Colors.gray}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <InputField
          placeholder="Password"
          placeholderTextColor={Colors.gray}
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.btn} onPress={handleLogin}>
          <Text style={styles.btnTxt}>Login</Text>
        </TouchableOpacity>

        <Text style={styles.loginTxt}>
          Don't have an account?{' '}
          <Link href="/signup" asChild>
            <TouchableOpacity>
              <Text style={styles.loginTxtSpan}>Sign Up</Text>
            </TouchableOpacity>
          </Link>
        </Text>

        <View style={styles.divder} />
        
        <SocialLoginButtons 
          emailHref="/signin" 
          onGooglePress={() => {
            console.log("🚀 محاولة تشغيل نافذة جوجل بالرابط الآمن...");
            if (request) {
              promptAsync();
            } else {
              Alert.alert('تنبيه', 'جاري تهيئة الاتصال... انتظر ثواني');
            }
          }} 
          onApplePress={handleAppleLogin}
        />
      </View>
    </>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: Colors.background },
  title: { fontSize: 24, fontWeight: '600', color: Colors.black, marginBottom: 50, letterSpacing: 1 },
  btn: { backgroundColor: Colors.primary, paddingVertical: 15, alignSelf: 'stretch', alignItems: 'center', borderRadius: 6, marginBottom: 22 },
  btnTxt: { color: Colors.white, fontSize: 18, fontWeight: '600' },
  loginTxt: { marginBottom: 30, fontSize: 14, lineHeight: 24 },
  loginTxtSpan: { color: Colors.primary, fontWeight: '600' },
  divder: { borderTopColor: Colors.gray, borderTopWidth: StyleSheet.hairlineWidth, width: '30%', marginBottom: 30 },
});