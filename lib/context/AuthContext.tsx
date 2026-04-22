// // lib/context/AuthContext.tsx

// import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
// import * as SecureStore from 'expo-secure-store';

// const TOKEN_KEY = 'my-jwt-token';

// type AuthContextType = {
//   session: any;
//   isLoading: boolean;
//   signIn: (userSession: any) => Promise<void>;
//   signOut: () => Promise<void>;
// };

// const AuthContext = createContext<AuthContextType | null>(null);

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// }

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [session, setSession] = useState<any>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const loadSession = async () => {
//       try {
//         const storedSession = await SecureStore.getItemAsync(TOKEN_KEY);
//         if (storedSession) {
//           setSession(JSON.parse(storedSession));
//         }
//       } catch (e) {
//         console.error('Failed to load session from storage', e);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     loadSession();
//   }, []);

//   const signIn = async (userSession: any) => {
//     setSession(userSession);
//     await SecureStore.setItemAsync(TOKEN_KEY, JSON.stringify(userSession));
//   };

//   const signOut = async () => {
//     setSession(null);
//     await SecureStore.deleteItemAsync(TOKEN_KEY);
//   };

//   const value = useMemo(
//     () => ({
//       session,
//       isLoading,
//       signIn,
//       signOut,
//     }),
//     [session, isLoading]
//   );

//   return (
    
//     <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
//   )
// }


////////////////////////////////////////////////////////////////////////////////////////


// lib/context/AuthContext.tsx

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';

// استخدام ثابت للمفتاح هو ممارسة ممتازة
const TOKEN_KEY = 'my-jwt-token';

// تعريف الأنواع (Types) للكود
type AuthContextType = {
  session: any;
  isLoading: boolean;
  signIn: (userSession: any) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const storedSession = await SecureStore.getItemAsync(TOKEN_KEY);
        if (storedSession) {
          setSession(JSON.parse(storedSession));
        }
      } catch (e) {
        console.error('Failed to load session from storage', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadSession();
  }, []);

  // ✨ التحسين الأول: استخدام useCallback لتثبيت الدوال
  const signIn = useCallback(async (userSession: any) => {
    setSession(userSession);
    await SecureStore.setItemAsync(TOKEN_KEY, JSON.stringify(userSession));
  }, []);

  const signOut = useCallback(async () => {
    setSession(null);
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  }, []);

  // ✨ التحسين الثاني: تحديث مصفوفة الاعتماديات
  const value = useMemo(
    () => ({
      session,
      isLoading,
      signIn,
      signOut,
    }),
    [session, isLoading, signIn, signOut] // إضافة signIn و signOut هنا
  );

  // ✨ التحسين الثالث: معالجة حالة التحميل الأولية
  // هذا يضمن عدم عرض أي شيء حتى يتم التأكد من حالة تسجيل الدخول
  if (isLoading) {
    // يمكنك عرض شاشة تحميل كاملة هنا إذا أردت
    return null;
  }

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  )
}


// -------------------------------------------------------------------------------------
// ✅ توضيحات الكود الاحترافي:
// 1. استخدمنا مكتبة `expo-secure-store` لتخزين بيانات جلسة المستخدم بشكل آمن ومشفر.
// 2. عند بدء تشغيل التطبيق، يتحقق `useEffect` من وجود جلسة محفوظة ويقوم بتحميلها.
// 3. عند تسجيل الدخول (`signIn`)، يتم حفظ الجلسة الجديدة في التخزين الآمن.
// 4. عند تسجيل الخروج (`signOut`)، يتم حذف الجلسة من التخزين الآمن.
// 5. استخدمنا `useCallback` لتثبيت دوال `signIn` و `signOut`، مما يحسن الأداء ويمنع إعادة التصيير (re-renders) غير الضرورية.
// 6. أضفنا معالجة لحالة التحميل (`isLoading`) لمنع "ومضة" الشاشة (تجنب ظهور شاشة تسجيل الدخول للحظة) عند فتح التطبيق لمستخدم مسجل دخوله بالفعل.
// -------------------------------------------------------------------------------------