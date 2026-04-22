// import 'dotenv/config';

// export default {
//   expo: {
//     extra: {
//       LOCAL_IP: process.env.LOCAL_IP,
//     },
//   },
// };
export default {
  expo: {
    name: "Bakery App",
    slug: "expo-ecommerece-app-starter",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png", // تأكد من وجود المسار أو غيره
    scheme: "bakery", // ضروري جداً لعودة جوجل للتطبيق
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.fdfdh.bakeryapp"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      package: "com.fdfdh.bakeryapp" // اسم الحزمة الخاص بك
    },
    extra: {
      eas: {
        projectId: "7c120dbe-fffa-4843-90ce-ac817513845f" // المعرف الذي ظهر في التيرمينال
      }
    }
  }
};