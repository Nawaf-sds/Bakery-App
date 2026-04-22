// import { ImageBackground,Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import React from "react";
// import { Link, Stack } from "expo-router";
// import { LinearGradient } from "expo-linear-gradient";
// import { Colors } from "@/constants/Colors";
// import { Ionicons } from "@expo/vector-icons";

// import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
// import SocialLoginButtons from "@/components/SocialLoginButtons";

// type Props = {};

// const WelcomeScreen = (props: Props) => {
//   return (
//     <>
//     <Stack.Screen options={{headerShown: false}}/>

//   <View style={styles.container}>
//         <LinearGradient
//   colors={["transparent", "rgba(255,255,255,0.9)","rgba(255,255,255,1)"]}
//   style={[styles.background]} // We just put the style inside an array
// >
//           <View style={styles.wrapper}>
//             <Animated.Text style={styles.title} entering={FadeInRight.delay(300).duration(300).springify()}>Douce
// patisserie
// </Animated.Text>
//             <Animated.Text style={styles.description} entering={FadeInRight.delay(500).duration(300)}> 
//               one Stop for all Your Needs
//             </Animated.Text>

//           <SocialLoginButtons emailHref={'/signup'}/>

//                 <Text style={styles.loginTxt}>
//                   Already have an account? {" "} 
//             <Link href={"/signin"} asChild>
//               <TouchableOpacity>
//                 <Text style={styles.loginTxtSpan}>SignIn</Text>
//               </TouchableOpacity>
//             </Link>
//              </Text>
//           </View>
//         </LinearGradient>
//       </View>

//       </>
//   );
// };

// export default WelcomeScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "flex-end",
//     alignItems: "center",
//   },
//   background: {
//     flex: 1,
//     position: "absolute",
//     top:200,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     justifyContent: "flex-end",
//   },
//   wrapper: {
//     paddingBottom: 70,
//     paddingHorizontal: 40,
//     alignItems: "center",
//   },
//   title:{
//     fontSize:27,
//     color:Colors.primary,
//     fontWeight: '500',
//     letterSpacing: 2.5,
//     marginBottom:6,

//   },
//   description:{
//     fontSize:17,
//     color: Colors.gray,
//     letterSpacing: 0.5,
//     lineHeight: 24,
//     marginBottom: 30,
//   },

//    loginTxt:{
//     marginTop:10,
//     fontSize:15,
//     lineHeight:24,
//    },
//    loginTxtSpan:{
//   color:Colors.primary,
//   fontWeight:'600',
//    },


// });




import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Link, Stack } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "@/constants/Colors";

// 👇 تأكد من أن هذا السطر يستورد FadeInRight بشكل صحيح
import Animated, { FadeInRight } from "react-native-reanimated";
import SocialLoginButtons from "@/components/SocialLoginButtons";

type Props = {};

const WelcomeScreen = (props: Props) => {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <ImageBackground
        style={styles.container}
        source={require("../../assets/images/jss.png")}      >
        <LinearGradient
          colors={["transparent", "rgba(255, 255, 255, 0.35)", "rgba(255,255,255,1)"]}
          style={styles.background}
        >
          <View style={styles.wrapper}>
            {/* هذا السطر الآن سيعمل لأن FadeInRight تم استيراده */}
            <Animated.Text style={styles.title} entering={FadeInRight.delay(300).duration(300).springify()}>
              Douce patisserie
            </Animated.Text>
            <Animated.Text style={styles.description} entering={FadeInRight.delay(500).duration(300)}>
              one Stop for all Your Needs
            </Animated.Text>

            <SocialLoginButtons emailHref={'/signup'} />

            <Text style={styles.loginTxt}>
              Already have an account?{" "}
              <Link href={"/signin"} asChild>
                <TouchableOpacity>
                  <Text style={styles.loginTxtSpan}>SignIn</Text>
                </TouchableOpacity>
              </Link>
            </Text>
          </View>
        </LinearGradient>
      </ImageBackground>
    </>
  );
};

// ... باقي الكود والـ styles تبقى كما هي

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 2,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  wrapper: {
    paddingBottom: 50,
    paddingHorizontal: 30,
    alignItems: "center",
    width: '100%',
  },
  title: {
    fontSize: 24,
    color: Colors.primary,
    fontWeight: '400',
    letterSpacing: 2.5,
    marginBottom: 6,
  },
  description: {
    fontSize: 15,
    color: Colors.gray,
    letterSpacing: 0.5,
    lineHeight: 14,
    marginBottom: 30,
  },
  loginTxt: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 24,
  },
  loginTxtSpan: {
    color: Colors.primary,
    fontWeight: '700',
  },
});

