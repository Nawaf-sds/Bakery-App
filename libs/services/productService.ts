// في ملف app/api/productService.ts
import apiClient from '../services/axiosClient';
import axios from 'axios';

export const getProducts = async () => {
 try {
 // ✅ تم تصحيح المسار ليتضمن '/api/...'
const response = await apiClient.get('/api/products');
 return response.data;
 } catch (error) {
 if (axios.isAxiosError(error) && error.response) {
 throw new Error(error.response.data.message || 'فشل في جلب المنتجات.');
 }
 throw new Error('حدث خطأ غير متوقع أو مشكلة في الشبكة.');
 }
};

///////////////////////////////////////////////////////////

// في ملف app/api/productService.ts
// import apiClient from '../api/axiosClient';
// import axios from 'axios';

// // ✅ دالة نهائية للتحقق من الاتصال
// export const testApiConnection = async () => {
//     try {
//         const response = await apiClient.get('/api/products');
//         return response.status === 200; // نرجع true إذا كان الاتصال ناجحاً
//     } catch (error) {
//         return false; // نرجع false إذا فشل الاتصال
//     }
// };