// import React, { useState } from 'react';
// import {
//   Alert,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import { Link, Stack, useRouter } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons';
// import { Colors } from '@/constants/Colors';
// import InputField from '@/components/InputField';
// import SocialLoginButtons from '@/components/SocialLoginButtons';

// const SignUpScreen = () => {
//   const router = useRouter();

//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');

//   const handleRegister = async () => {
//     if (!email || !password || !confirmPassword) {
//       Alert.alert('خطأ', 'الرجاء إدخال جميع الحقول');
//       return;
//     }

//     if (password !== confirmPassword) {
//       Alert.alert('خطأ', 'كلمة المرور غير متطابقة');
//       return;
//     }

//     try {
//       const data = await registerUser(email, password);
//       Alert.alert('نجاح ✅', 'تم إنشاء الحساب بنجاح');
//       router.push('/signin');
//     } catch (err: any) {
//       Alert.alert('خطأ', err.message || 'فشل التسجيل');
//     }
//   };

//   return (
//     <>
//       <Stack.Screen
//         options={{
//           headerTitle: 'Sign UP',
//           headerLeft: () => (
//             <TouchableOpacity onPress={() => router.back()}>
//               <Ionicons name="close" size={28} color={Colors.black} />
//             </TouchableOpacity>
//           ),
//         }}
//       />
//       <View style={styles.container}>
//         <Text style={styles.title}>Create an Account</Text>

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

//         <InputField
//           placeholder="Confirm Password"
//           placeholderTextColor={Colors.gray}
//           secureTextEntry={true}
//           value={confirmPassword}
//           onChangeText={setConfirmPassword}
//         />

//         <TouchableOpacity style={styles.btn} onPress={handleRegister}>
//           <Text style={styles.btnTxt}>Create an Account</Text>
//         </TouchableOpacity>

//         <Text style={styles.loginTxt}>
//           Already have an account?{' '}
//           <Link href="/signin" asChild>
//             <TouchableOpacity>
//               <Text style={styles.loginTxtSpan}>Sign In</Text>
//             </TouchableOpacity>
//           </Link>
//         </Text>

//         <View style={styles.divder} />

//         <SocialLoginButtons emailHref="/signin" />
//       </View>
//     </>
//   );
// };

// export default SignUpScreen;

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






import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Link, Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import InputField from '@/components/InputField';
import SocialLoginButtons from '@/components/SocialLoginButtons';
// ✅ استيراد دالة التسجيل من ملف الخدمة الجديد
import { register } from '@/libs/services/authService';

const SignUpScreen = () => {
  const router = useRouter();

  const [name, setName] = useState(''); // ✅ أضفنا متغير الاسم
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) { // ✅ أضفنا حقل الاسم في التحقق
      Alert.alert('خطأ', 'الرجاء إدخال جميع الحقول');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('خطأ', 'كلمة المرور غير متطابقة');
      return;
    }

    try {
      const data = await register(name, email, password); // ✅ استدعاء الدالة الجديدة
      Alert.alert('نجاح ✅', 'تم إنشاء الحساب بنجاح');
      router.push('/signin'); // أو يمكنك توجيهه إلى الشاشة الرئيسية مباشرة
    } catch (err) {
      const errorMessage =
        typeof err === 'object' && err !== null && 'message' in err
          ? String((err as { message?: string }).message)
          : 'فشل التسجيل';
      Alert.alert('خطأ', errorMessage);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: 'Sign Up',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="close" size={28} color={Colors.black} />
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.container}>
        <Text style={styles.title}>Create an Account</Text>

        {/* ✅ حقل الاسم الجديد */}
        <InputField
          placeholder="Full Name"
          placeholderTextColor={Colors.gray}
          autoCapitalize="none"
          keyboardType="default"
          value={name}
          onChangeText={setName}
        />

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

        <InputField
          placeholder="Confirm Password"
          placeholderTextColor={Colors.gray}
          secureTextEntry={true}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity style={styles.btn} onPress={handleRegister}>
          <Text style={styles.btnTxt}>Create an Account</Text>
        </TouchableOpacity>

        <Text style={styles.loginTxt}>
          Already have an account?{' '}
          <Link href="/signin" asChild>
            <TouchableOpacity>
              <Text style={styles.loginTxtSpan}>Sign In</Text>
            </TouchableOpacity>
          </Link>
        </Text>

        <View style={styles.divder} />
        <SocialLoginButtons emailHref="/signin" />
      </View>
    </>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: 50,
    letterSpacing: 1,
  },
  btn: {
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    alignSelf: 'stretch',
    alignItems: 'center',
    borderRadius: 6,
    marginBottom: 22,
  },
  btnTxt: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
  loginTxt: {
    marginBottom: 30,
    fontSize: 14,
    lineHeight: 24,
  },
  loginTxtSpan: {
    color: Colors.primary,
    fontWeight: '600',
  },
  divder: {
    borderTopColor: Colors.gray,
    borderTopWidth: StyleSheet.hairlineWidth,
    width: '30%',
    marginBottom: 30,
  },
});