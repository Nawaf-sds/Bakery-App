// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const API_URL = 'http://192.168.1.27:5000'; 


// const apiClient = axios.create({
//   baseURL: API_URL, 
//     timeout: 15000, // 15 ثانية كحد أقصى
// });

// apiClient.interceptors.request.use(
//   async (config) => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//     } catch (e) {
//       console.error('Failed to get token from AsyncStorage', e);
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// export default apiClient;

// libs/services/axiosClient.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ---------------------------------------------------------
// 🛠️ التعديل الحاسم:
// بدلاً من الاعتماد على Constants التي قد تفشل، ضع الـ IP مباشرة
// تأكد أن هذا الرقم هو نفسه الذي يظهر لك في ipconfig
// ---------------------------------------------------------
const API_URL = 'http://192.168.1.28:5000'; // استبدل هذا بالـ IP الصحيح لجهازك

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000, // زدنا الوقت قليلاً تحسباً لبطء الشبكة
});

// ... (باقي الكود الخاص بالـ Interceptors كما هو ممتاز لا تغيره) ...

// Interceptor لإضافة التوكن
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      // طباعة الرابط للتأكد من أنه لا يحتوي على localhost
      console.log('🚀 Requesting:', config.baseURL + config.url); 

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.error('Error getting token:', err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor للاستجابة
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // طباعة تفصيلية للخطأ لمعرفة السبب
    if (error.response) {
       // السيرفر رد بخطأ (مثل 404 أو 500)
       console.error('❌ Server Error:', error.response.status, error.response.data);
    } else if (error.request) {
       // السيرفر لم يرد (مشكلة شبكة أو IP خطأ)
       console.error('❌ Network Error (No Response). Check IP:', API_URL);
    } else {
       console.error('❌ Error Message:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;