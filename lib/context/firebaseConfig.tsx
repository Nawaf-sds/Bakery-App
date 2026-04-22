// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBHXJfOH6ha3VmOLtRJJq6cEXAv3WxDMts",
  authDomain: "app-cookies.firebaseapp.com",
  projectId: "app-cookies",
  storageBucket: "app-cookies.firebasestorage.app",
  messagingSenderId: "736611221953",
  appId: "1:736611221953:web:e5d39b1d8c75fb180c2f40",
  measurementId: "G-80ZC6K3EHY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// قم بتصدير (Export) متغير auth لاستخدامه في تطبيقك
export { app, analytics };