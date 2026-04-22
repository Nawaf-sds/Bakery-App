// lib/context/CartContext.tsx

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';
import apiClient from '../../libs/services/axiosClient';
import axios from 'axios';

// The rest of the file outside the provider can stay the same...
const CartContext = createContext(null);

export function useCart() {
    const context = useContext(CartContext);
    if (context === null) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}


export function CartProvider({ children }) {
    const { session, signOut } = useAuth();
    const [cart, setCart] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchCart = useCallback(async () => {
        if (session) {
            setIsLoading(true);
            try {
                const response = await apiClient.get('/api/cart');
                setCart(response.data);
            } catch (error) {
                if (axios.isAxiosError(error) && error.response?.status === 401) {
                    signOut();
                } else {
                    console.error( "فشل جلب السلة:", error);
                    setCart(null);
                }
            } finally {
                setIsLoading(false);
            }
        } else {
            setCart(null);
        }
    }, [session, signOut]);

    // ✨ الإصلاح الأساسي للمشكلة السابقة (الحلقة اللانهائية) ✨
    useEffect(() => {
        fetchCart();
    }, [session]);

    const updateQuantity = async (itemId: string, newQuantity: number) => {
        try {
            await apiClient.patch(`/api/cart/items/${itemId}`, { quantity: newQuantity });
            await fetchCart();
        } catch (error) {
            console.error("فشل تحديث الكمية:", error);
        }
    };

    const removeFromCart = async (itemId: string) => {
        try {
            await apiClient.delete(`/api/cart/items/${itemId}`);
            await fetchCart();
        } catch (error) {
            console.error("فشل حذف المنتج:", error);
        }
    };

    const value = useMemo(() => ({
        cart,
        fetchCart,
        updateQuantity,
        removeFromCart,
        isLoading
    }), [cart, isLoading, fetchCart]);

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}



// -------------------------------------------------------------------------------------
// ✅ توضيحات:
// 1. يوفر هذا الملف "Context" لإدارة بيانات سلة التسوق ومشاركتها عبر جميع مكونات التطبيق.
// 2. يعتمد على `AuthContext` لجلب السلة الخاصة بالمستخدم المسجل دخوله فقط.
// 3. يستخدم `useEffect(..., [session])` لجلب بيانات السلة تلقائيًا عند تسجيل دخول المستخدم أو تسجيل خروجه، وهذا يحل مشكلة الحلقة اللانهائية.
// 4. الدوال مثل `updateQuantity` و `removeFromCart` تقوم بتعديل السلة في الخادم ثم تعيد جلب البيانات المحدثة لضمان تزامنها.
// 5. تم استخدام `useCallback` و `useMemo` لضمان أفضل أداء ومنع عمليات إعادة التصيير غير الضرورية.
// -------------------------------------------------------------------------------------