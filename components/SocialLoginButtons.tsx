// // components/SocialLoginButtons.tsx  
// import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
// import React from 'react'
// import Animated, { FadeInDown } from 'react-native-reanimated'
// import { Ionicons } from '@expo/vector-icons'
// import { Href, Link } from 'expo-router'
// import Google from '@/assets/images/google-logo.svg';
// import { Colors } from '@/constants/Colors'


// type Props ={
//      emailHref: Href;
// };

// export default function SocialLoginButtons({ emailHref }: Props) {

//   return (
//     <View style={styles.socialLoginWrapper}>

//                 <Animated.View entering={FadeInDown.delay(300).duration(500).springify()}> 
                  
                  
//             <Link href={emailHref} asChild>
//               <TouchableOpacity style={styles.button}>
//                    <Ionicons
//                 name="mail-outline"
//                 size={20}
//                 color={Colors.black}
//                 />
//                 <Text style={styles.btnTxt}>Continue with Email</Text>
//               </TouchableOpacity>
//             </Link> 

//                </Animated.View>
//                 <Animated.View entering={FadeInDown.delay(700).duration(500).springify()}> 

//               <TouchableOpacity style={styles.button}>

//                 <Google width={20} height={20}/>

//                 <Text style={styles.btnTxt}>Continue with Google</Text>
//               </TouchableOpacity>
//            </Animated.View>
//            <Animated.View entering={FadeInDown.delay(1100).duration(500)}> 
//               <TouchableOpacity style={styles.button}>
//                 <Ionicons
//                 name="logo-apple"
//                 size={20}
//                 color={Colors.black}
//                 />
//                 <Text style={styles.btnTxt}>Continue with Apple</Text>
//               </TouchableOpacity>
//             </Animated.View>
//               </View>
//   )
// }

// const styles = StyleSheet.create({
//      socialLoginWrapper:{
//         alignSelf:'stretch'
//       },
//         button: {
//           flexDirection: "row",
//          padding:10,
//          borderColor:Colors.gray,
//          borderWidth:StyleSheet.hairlineWidth,
//          borderRadius:30,
//          alignItems:"center",
//          justifyContent:'center',
//          gap:7,
//          marginBottom:20,
//         },
      
//         btnTxt:{
//           fontSize:16,
//           fontWeight:'600',
//           color:Colors.black,
          
//         },
// })


import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { Href, Link } from 'expo-router'
import Google from '@/assets/images/google-logo.svg';
import { Colors } from '@/constants/Colors'

// 1️⃣ إضافة onGooglePress و onApplePress إلى تعريف الـ Props
type Props = {
  emailHref: Href;
  onGooglePress?: () => void; // دالة اختيارية لتشغيل جوجل
  onApplePress?: () => void;  // دالة اختيارية لتشغيل آبل
};

// 2️⃣ استخراج الدوال الجديدة من الـ Props
export default function SocialLoginButtons({ emailHref, onGooglePress, onApplePress }: Props) {

  return (
    <View style={styles.socialLoginWrapper}>

      {/* زر البريد الإلكتروني - يبقى كما هو */}
      {/* <Animated.View entering={FadeInDown.delay(300).duration(500).springify()}>
        <Link href={emailHref} asChild>
          <TouchableOpacity style={styles.button}>
            <Ionicons name="mail-outline" size={20} color={Colors.black} />
            <Text style={styles.btnTxt}>Continue with Email</Text>
          </TouchableOpacity>
        </Link>
      </Animated.View> */}

      {/* 3️⃣ زر جوجل - ربط خاصية onPress بالدالة الممررة */}
      <Animated.View entering={FadeInDown.delay(700).duration(500).springify()}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={onGooglePress} // تشغيل promptAsync عند الضغط
          activeOpacity={0.7}
        >
          <Google width={20} height={20} />
          <Text style={styles.btnTxt}>Continue with Google</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* 4️⃣ زر آبل - ربط خاصية onPress بالدالة الممررة */}
      <Animated.View entering={FadeInDown.delay(1100).duration(500)}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={onApplePress} // تشغيل handleAppleLogin عند الضغط
          activeOpacity={0.7}
        >
          <Ionicons name="logo-apple" size={20} color={Colors.black} />
          <Text style={styles.btnTxt}>Continue with Apple</Text>
        </TouchableOpacity>
      </Animated.View>

    </View>
  )
}

const styles = StyleSheet.create({
  socialLoginWrapper: {
    alignSelf: 'stretch'
  },
  button: {
    flexDirection: "row",
    padding: 10,
    borderColor: Colors.gray,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: 'center',
    gap: 7,
    marginBottom: 20,
  },
  btnTxt: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.black,
  },
})



 
 
 
 
 
 
 
 
 
 