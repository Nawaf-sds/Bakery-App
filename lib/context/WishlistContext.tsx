// // lib/context/WishlistContext.tsx

// import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
// import { useAuth } from './AuthContext';
// import apiClient from '../../libs/services/axiosClient';
// import axios from 'axios';

// const WishlistContext = createContext(null);

// export function useWishlist() {
//     const context = useContext(WishlistContext);
//     if (!context) {
//         throw new Error("useWishlist must be used within a WishlistProvider");
//     }
//     return context;
// }

// export function WishlistProvider({ children }) {
//     const { session, signOut } = useAuth();
//     const [wishlist, setWishlist] = useState<any[]>([]);
//     const [isLoading, setIsLoading] = useState(false);

//     const fetchWishlist = useCallback(async () => {
//         if (session) {
//             setIsLoading(true);
//             try {
//                 const response = await apiClient.get('/api/wishlist');
//                 setWishlist(response.data);
//             } catch (error) {
//                 if (axios.isAxiosError(error) && error.response?.status === 401) {
//                     signOut();
//                 } else {
//                     console.error("فشل في جلب قائمة الأمنيات:", error);
//                     setWishlist([]);
//                 }
//             } finally {
//                 setIsLoading(false);
//             }
//         } else {
//             setWishlist([]);
//         }
//     }, [session, signOut]);

//     useEffect(() => {
//         fetchWishlist();
//     }, [session]); // ✨ تم الإصلاح
//     const addToWishlist = async (productId: string) => {
//         try {
//             await apiClient.post('/api/wishlist', { productId });
//             await fetchWishlist();
//         } catch (error) {
//             console.error("فشل في إضافة المنتج للأمنيات:", error);
//         }
//     };

//     const removeFromWishlist = async (productId: string) => {
//         try {
//             await apiClient.delete(`/api/wishlist/${productId}`);
//             await fetchWishlist();
//         } catch (error) {
//             console.error("فشل في حذف المنتج من الأمنيات:", error);
//         }
//     };

//     const isWishlisted = (productId: string) => {
//         return wishlist.some(item => item.product?._id === productId);
//     };

//    const value = useMemo(() => ({
//         wishlist,
//         addToWishlist,
//         removeFromWishlist,
//         isWishlisted,
//         isLoading
//     }), [
//         wishlist, 
//         isLoading, 
//         addToWishlist, 
//         removeFromWishlist, 
//         isWishlisted
//     ]);

//     return (
//         <WishlistContext.Provider value={value}>
//             {children}
//         </WishlistContext.Provider>
//     );
// }



// -------------------------------------------------------------------------------------
// ✅ توضيحات:
// 1. يوفر هذا الملف "Context" لإدارة بيانات قائمة الأمنيات ومشاركتها عبر جميع مكونات التطبيق.
// 2. يعتمد على `AuthContext` لجلب قائمة الأمنيات الخاصة بالمستخدم المسجل دخوله فقط.
// 3. يستخدم `useEffect(..., [session])` لجلب بيانات القائمة تلقائيًا عند تسجيل دخول المستخدم أو تسجيل خروجه، وهذا يحل مشكلة الحلقة اللانهائية.
// 4. الدوال مثل `addToWishlist` و `removeFromWishlist` تقوم بتعديل القائمة في الخادم ثم تعيد جلب البيانات المحدثة لضمان تزامنها.
// 5. تم استخدام `useCallback` و `useMemo` لضمان أفضل أداء ومنع عمليات إعادة التصيير غير الضرورية.
// -------------------------------------------------------------------------------------




// lib/context/WishlistContext.tsx

// ========================================================================
// 1. استيراد المكتبات والوظائف اللازمة من رياكت
// ========================================================================

// import React, {
//     createContext,      // لإنشاء Context جديد
//     useContext,         // للوصول إلى بيانات الـ Context من أي مكون
//     useState,           // لإدارة الحالة (state) داخل المكون
//     useEffect,          // لتشغيل التأثيرات الجانبية (side effects) مثل جلب البيانات
//     useCallback,        // لتحسين أداء الدوال ومنع إعادة إنشائها بدون داعٍ
//     useMemo,            // لتحسين أداء القيم المعقدة (مثل الكائنات) ومنع إعادة حسابها بدون داعٍ
//     ReactNode           // نوع بيانات (type) يمثل أي شيء يمكن عرضه في رياكت (مكونات، نصوص، إلخ)
// } from 'react';
// import { useAuth } from './AuthContext'; // استيراد hook المصادقة للوصول لبيانات المستخدم
// import apiClient from '../../libs/services/axiosClient'; // استيراد axios client المُعد مسبقًا
// import axios from 'axios'; // استيراد مكتبة axios الرئيسية للتحقق من أنواع الأخطاء

// // ========================================================================
// // 2. تعريف أنواع البيانات (TypeScript Types)
// // ========================================================================

// // تعريف شكل البيانات التي سيوفرها الـ Context للمكونات الأخرى
// interface WishlistContextType {
//     wishlist: any[];          // مصفوفة تحتوي على منتجات قائمة الأمنيات
//     isLoading: boolean;       // متغير لمعرفة ما إذا كان يتم حاليًا جلب البيانات
//     addToWishlist: (productId: string) => Promise<void>;      // دالة لإضافة منتج للقائمة
//     removeFromWishlist: (productId: string) => Promise<void>; // دالة لحذف منتج من القائمة
//     isWishlisted: (productId: string) => boolean;             // دالة للتحقق مما إذا كان المنتج في القائمة
// }

// // ========================================================================
// // 3. إنشاء الـ Context
// // ========================================================================

// // نقوم بإنشاء الـ Context مع قيمة افتراضية `null`
// // وتحديد نوع البيانات التي سيحملها باستخدام الواجهة (interface) التي عرفناها سابقًا
// const WishlistContext = createContext<WishlistContextType | null>(null);

// // ========================================================================
// // 4. إنشاء Custom Hook ليسهل استخدام الـ Context
// // ========================================================================

// // هذا الـ hook المخصص هو الطريقة الموصى بها لاستخدام الـ Context
// export function useWishlist() {
//     // نستخدم `useContext` للوصول إلى قيمة الـ Context الحالية
//     const context = useContext(WishlistContext);
//     // نتأكد من أن المكون الذي يستخدم هذا الـ hook موجود داخل WishlistProvider
//     if (!context) {
//         throw new Error("يجب استخدام useWishlist داخل WishlistProvider");
//     }
//     // نرجع قيمة الـ Context لاستخدامها في المكون
//     return context;
// }

// // واجهة لتحديد نوع `props` لمكون Provider
// interface WishlistProviderProps {
//     children: ReactNode; // `children` يمثل المكونات التي سيتم تغليفها
// }

// // ========================================================================
// // 5. إنشاء مكون الـ Provider الذي سيحتوي على كل المنطق
// // ========================================================================

// export function WishlistProvider({ children }: WishlistProviderProps) {
//     // --- الحالة (State) ---
//     // نستخدم `useAuth` للحصول على جلسة المستخدم (session) ودالة تسجيل الخروج
//     const { session, signOut } = useAuth();
//     // حالة لتخزين قائمة الأمنيات، تبدأ كمصفوفة فارغة
//     const [wishlist, setWishlist] = useState<any[]>([]);
//     // حالة لتتبع عملية تحميل البيانات، تبدأ بـ `false`
//     const [isLoading, setIsLoading] = useState(false);

//     // --- الدوال ---
//     // دالة جلب قائمة الأمنيات من الخادم
//     // نستخدم `useCallback` لمنع إعادة إنشاء هذه الدالة في كل مرة يتم فيها تحديث المكون
//     // إلا إذا تغيرت `session` أو `signOut`
//     const fetchWishlist = useCallback(async () => {
//         // نتحقق أولاً من وجود جلسة مستخدم (أنه مسجل دخوله)
//         if (session) {
//             setIsLoading(true); // نبدأ التحميل
//             try {
//                 // نرسل طلب GET إلى الخادم لجلب القائمة
//                 const response = await apiClient.get('/api/wishlist');
//                 // في حال النجاح، نحدّث حالة `wishlist` بالبيانات المستقبلة
//                 setWishlist(response.data);
//             } catch (error) {
//                 // في حال حدوث خطأ
//                 // نتحقق إذا كان الخطأ هو خطأ 401 (غير مصرح به)، مما يعني أن الجلسة قد تكون منتهية
//                 if (axios.isAxiosError(error) && error.response?.status === 401) {
//                     signOut(); // نقوم بتسجيل خروج المستخدم
//                 } else {
//                     // لأي خطأ آخر، نطبعه في الكونسول
//                     console.error("فشل في جلب قائمة الأمنيات:", error);
//                     setWishlist([]); // نفرّغ القائمة كإجراء احترازي
//                 }
//             } finally {
//                 // هذا الكود سيعمل دائمًا، سواء نجح الطلب أو فشل
//                 setIsLoading(false); // نوقف التحميل
//             }
//         } else {
//             // إذا لم يكن هناك جلسة مستخدم، نتأكد من أن القائمة فارغة
//             setWishlist([]);
//         }
//     }, [session, signOut]); // مصفوفة الاعتماديات: الدالة ستُعاد إنشاؤها فقط عند تغير هذه القيم

//     // `useEffect` هو hook لتشغيل "تأثير جانبي"
//     // هنا، نستخدمه لجلب قائمة الأمنيات تلقائيًا
//     useEffect(() => {
//         fetchWishlist();
//     }, [fetchWishlist]); // سيتم تشغيل هذا الـ hook فقط عندما تتغير دالة `fetchWishlist` (التي تعتمد على `session`)

//     // دالة لإضافة منتج جديد لقائمة الأمنيات
//     // نستخدم `useCallback` لتحسين الأداء
//     const addToWishlist = useCallback(async (productId: string) => {
//         try {
//             // نرسل طلب POST للخادم مع `productId`
//             await apiClient.post('/api/wishlist', { productId });
//             // بعد الإضافة الناجحة، نعيد جلب القائمة بأكملها لتحديث الواجهة
//             await fetchWishlist();
//         } catch (error) {
//             console.error("فشل في إضافة المنتج للأمنيات:", error);
//         }
//     }, [fetchWishlist]); // تعتمد على `fetchWishlist`

//     // دالة لحذف منتج من قائمة الأمنيات
//     // نستخدم `useCallback` لتحسين الأداء
//     const removeFromWishlist = useCallback(async (productId: string) => {
//         try {
//             // نرسل طلب DELETE للخادم مع `productId` في الرابط
//             await apiClient.delete(`/api/wishlist/${productId}`);
//             // بعد الحذف الناجح، نعيد جلب القائمة لتحديث الواجهة
//             await fetchWishlist();
//         } catch (error) {
//             console.error("فشل في حذف المنتج من الأمنيات:", error);
//         }
//     }, [fetchWishlist]); // تعتمد على `fetchWishlist`

//     // دالة مساعدة للتحقق مما إذا كان منتج معين موجودًا بالفعل في القائمة
//     const isWishlisted = useCallback((productId: string) => {
//         // `some` هي دالة مصفوفة ترجع `true` إذا كان عنصر واحد على الأقل يطابق الشرط
//         return wishlist.some(item => item?.product?._id === productId);
//     }, [wishlist]); // تعتمد على `wishlist`، لذا ستُعاد إنشاؤها عند تحديث القائمة

//     // --- قيمة الـ Context ---
//     // نستخدم `useMemo` لإنشاء كائن القيمة (value object) الذي سيتم تمريره للـ Provider
//     // هذا يضمن أن الكائن نفسه لا يُعاد إنشاؤه في كل تحديث للمكون،
//     // مما يمنع التحديثات غير الضرورية في المكونات التي تستهلك هذا الـ Context.
//     const value = useMemo(() => ({
//         wishlist,
//         addToWishlist,
//         removeFromWishlist,
//         isWishlisted,
//         isLoading
//     }), [
//         wishlist,
//         isLoading,
//         addToWishlist,
//         removeFromWishlist,
//         isWishlisted
//     ]); // مصفوفة الاعتماديات: الكائن سيعاد إنشاؤه فقط إذا تغيرت إحدى هذه القيم

//     // --- العرض (Render) ---
//     // نرجع مكون Provider ونمرر له الكائن `value` الذي أنشأناه
//     // `children` يمثل جميع المكونات التي سيتم تغليفها داخل هذا الـ Provider
//     // وبالتالي ستتمكن من الوصول إلى قيمة الـ Context.
//     return (
//         <WishlistContext.Provider value={value}>
//             {children}
//         </WishlistContext.Provider>
//     );
// }




// src/context/WishlistContext.tsx
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import apiClient from '../../libs/services/axiosClient';
import { useAuth } from '../../lib/context/AuthContext';

type WishlistItem = {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
    image: string;
  };
};

type WishlistContextType = {
  wishlist: WishlistItem[];
  fetchWishlist: () => Promise<void>;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
};

const WishlistContext = createContext<WishlistContextType>({
  wishlist: [],
  fetchWishlist: async () => {},
  addToWishlist: async () => {},
  removeFromWishlist: async () => {},
});

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session } = useAuth(); // ✅ استبدال useSession بـ useAuth
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  // ✅ جلب القائمة من السيرفر فقط بعد التأكد من وجود session
  const fetchWishlist = useCallback(async () => {
    if (!session) return;
    try {
      const response = await apiClient.get('/api/wishlist');
      setWishlist(response.data);
    } catch (error) {
      console.error('❌ فشل في جلب قائمة الأمنيات:', error);
    }
  }, [session]);

  // ✅ إضافة منتج للقائمة مع تحديث الحالة محليًا
  const addToWishlist = useCallback(async (productId: string) => {
    if (!session) return;
    try {
      const response = await apiClient.post('/api/wishlist', { productId });
      setWishlist(prev => [...prev, response.data]);
    } catch (error) {
      console.error('❌ فشل في إضافة المنتج للأمنيات:', error);
    }
  }, [session]);

  // ✅ حذف منتج من القائمة مع تحديث الحالة محليًا
  const removeFromWishlist = useCallback(async (productId: string) => {
    if (!session) return;
    try {
      await apiClient.delete(`/api/wishlist/${productId}`);
      setWishlist(prev => prev.filter(item => item.product._id !== productId));
    } catch (error) {
      console.error('❌ فشل في حذف المنتج من الأمنيات:', error);
    }
  }, [session]);

  // 📌 استدعاء القائمة فقط بعد توفر session
  useEffect(() => {
    if (session) {
      fetchWishlist();
    }
  }, [session, fetchWishlist]);

  return (
    <WishlistContext.Provider value={{ wishlist, fetchWishlist, addToWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
