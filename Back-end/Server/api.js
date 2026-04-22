// services/api.js
// import axios from "axios";

// // 🟢 عدل IP حسب السيرفر عندك (اللي فتحته http://192.168.1.27:5000)
// const API = axios.create({
//   baseURL: 'http://192.168.1.27',
// });

// // 🟢 إذا عندك توكن مخزن (مثلاً AsyncStorage) نضيفه تلقائي
// API.interceptors.request.use(
//   async (config) => {
//     // مثال: لو خزّنت التوكن في AsyncStorage
//     // const token = await AsyncStorage.getItem("token");
//     const token = null; // نتركه null مؤقتًا للتجربة
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// export default API;
