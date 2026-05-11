// import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons';
// import apiClient from '@/libs/services/axiosClient';

// type CartItem = {
//   _id?: string;
//   product: {
//     _id: string; 
//     name: string;
//     price: number;
//     imageUrls: string[];
//     dailyStock: number;
//   };
//   quantity: number;
// };

// const CartScreen = () => {
//   const router = useRouter();
  
//   const [cartItems, setCartItems] = useState<CartItem[]>([]);
//   const [totalPrice, setTotalPrice] = useState(0);
//   const [isLoading, setIsLoading] = useState(true);
//   const [updatingId, setUpdatingId] = useState<string | null>(null);

//  // دالة تحويل الرابط الذكية (تحل مشكلة الشاشة البيضاء والتحذيرات)
//   const getImageUrl = (source?: any) => {
//     // 1. إذا كان المصدر غير موجود أساساً
//     if (!source) return 'https://via.placeholder.com/150x150.png?text=No+Image';

//     let url = '';

//     // 2. استخراج الرابط سواء كان نصاً أو داخل مصفوفة
//     if (typeof source === 'string') {
//       url = source;
//     } else if (Array.isArray(source) && source.length > 0) {
//       url = source[0];
//     }

//     // 3. التأكد من أن الرابط ليس فارغاً بعد الاستخراج
//     if (!url || typeof url !== 'string' || url.trim() === '') {
//       return 'https://via.placeholder.com/150x150.png?text=No+Image';
//     }

//     // 4. بناء الرابط النهائي
//     if (url.startsWith('http')) return url;


//     const cleanPath = url.startsWith('/') ? url : `/${url}`;
    
//     return `${SERVER_URL}${cleanPath}`;
//   };

//   useEffect(() => { fetchCart(); }, []);

//   const handleUpdateQuantity = async (productId: string, currentQty: number, change: number, stock: number) => {
//     const newQty = currentQty + change; 
//     if (newQty < 1) return; 
//     if (newQty > stock) return Alert.alert("عذراً", `الكمية المتوفرة ${stock} فقط.`);
//     try {
//       setUpdatingId(productId);
//       const { data } = await apiClient.patch(`/api/cart/items/${productId}`, { quantity: newQty });
//       setCartItems(data.items);
//       setTotalPrice(data.totalPrice);
//     } catch (error) { Alert.alert("خطأ", "فشل التحديث"); } finally { setUpdatingId(null); }
//   };

//   const handleRemoveItem = async (productId: string) => {
//     try {
//       setUpdatingId(productId);
//       const { data } = await apiClient.delete(`/api/cart/items/${productId}`);
//       setCartItems(data.items);
//       setTotalPrice(data.totalPrice);
//     } catch (error) { Alert.alert("خطأ", "فشل الحذف"); } finally { setUpdatingId(null); }
//   };

//   // ✨ التعديل الجذري هنا: نرسل الرابط الكامل للصورة
//   const promptForReview = (product: any) => {
//     // 1. نقوم بتجهيز الرابط الكامل هنا قبل الإرسال
//     const fullImageUrl = getImageUrl(product.imageUrls?.[0]);

//     Alert.alert(
//       "تقييم المنتج",
//       `هل تريد تقييم "${product.name}"؟`,
//       [
//         { text: "لاحقاً", style: "cancel" },
//         { 
//           text: "نعم", 
//           onPress: () => router.push({ 
//             pathname: '/profile/reviews',
//             params: { 
//               productId: product._id, 
//               name: product.name, 
//               // 2. نرسل الرابط الجاهز (fullImageUrl)
//               image: fullImageUrl 
//             } 
//           }) 
//         }
//       ]
//     );
//   };

//   if (isLoading) return <View style={styles.centered}><ActivityIndicator size="large" color="#D2691E" /></View>;

//   if (cartItems.length === 0) {
//     return (
//       <View style={styles.emptyContainer}>
//         <Ionicons name="cart-outline" size={80} color="#ccc" />
//         <Text style={styles.emptyText}>السلة فارغة</Text>
//         <TouchableOpacity style={styles.shopNowBtn} onPress={() => router.push('/(tabs)')}><Text style={styles.shopNowText}>تصفح المخبوزات</Text></TouchableOpacity>
//       </View>
//     );
//   }

//   const renderCartItem = ({ item }: { item: CartItem }) => {
//     if (!item.product || !item.product._id) return null; 
//     return (
//       <View style={styles.cartCard}>
//         <Image source={{ uri: getImageUrl(item.product.imageUrls?.[0]) }} style={styles.itemImage} />
//         <View style={styles.itemDetails}>
//           <Text style={styles.itemName} numberOfLines={1}>{item.product.name}</Text>
//           <Text style={styles.itemPrice}>{item.product.price} ر.س</Text>
//         </View>
//         <View style={styles.actionsContainer}>
//           <View style={styles.topActions}>
//              <TouchableOpacity onPress={() => promptForReview(item.product)} style={styles.starBtn}>
//               <Ionicons name="star" size={22} color="#FFB800" />
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => handleRemoveItem(item.product._id)} disabled={updatingId === item.product._id} style={styles.deleteBtn}>
//               <Ionicons name="trash-outline" size={22} color="#FF3B30" />
//             </TouchableOpacity>
//           </View>
//           <View style={styles.counter}>
//             <TouchableOpacity onPress={() => handleUpdateQuantity(item.product._id, item.quantity, -1, item.product.dailyStock)}>
//               <Ionicons name="remove-circle-outline" size={28} color={item.quantity <= 1 ? "#ccc" : "#333"} />
//             </TouchableOpacity>
//             {updatingId === item.product._id ? <ActivityIndicator size="small" color="#D2691E" /> : <Text style={styles.qtyText}>{item.quantity}</Text>}
//             <TouchableOpacity onPress={() => handleUpdateQuantity(item.product._id, item.quantity, 1, item.product.dailyStock)}>
//               <Ionicons name="add-circle-outline" size={28} color="#D2691E" />
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.headerTitle}>سلة المشتريات</Text>
//       <FlatList data={cartItems} keyExtractor={(item) => item.product._id} renderItem={renderCartItem} contentContainerStyle={{ padding: 15, paddingBottom: 100 }} />
//       <View style={styles.footer}>
//         <View style={styles.totalContainer}>
//           <Text style={styles.totalLabel}>الإجمالي:</Text>
//           <Text style={styles.totalAmount}>{totalPrice.toFixed(2)} ر.س</Text>
//         </View>
//         <TouchableOpacity style={styles.checkoutBtn} onPress={() => router.push('/checkout')}>
//           <Text style={styles.checkoutText}>إتمام الطلب</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default CartScreen;

// const styles = StyleSheet.create({
//   centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9f9f9' },
//   container: { flex: 1, backgroundColor: '#f9f9f9' },
//   headerTitle: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginTop: 50, marginBottom: 15 },
//   emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   emptyText: { fontSize: 18, color: '#666', marginVertical: 20 },
//   shopNowBtn: { backgroundColor: '#D2691E', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 25 },
//   shopNowText: { color: '#fff', fontWeight: 'bold' },
//   cartCard: { flexDirection: 'row-reverse', backgroundColor: '#fff', borderRadius: 16, padding: 12, marginBottom: 15, elevation: 3, alignItems: 'center' },
//   itemImage: { width: 85, height: 85, borderRadius: 12, backgroundColor: '#eee' },
//   itemDetails: { flex: 1, marginHorizontal: 12 },
//   itemName: { fontSize: 15, fontWeight: 'bold', textAlign: 'right' },
//   itemPrice: { fontSize: 15, color: '#D2691E', fontWeight: 'bold', textAlign: 'right' },
//   actionsContainer: { alignItems: 'center', justifyContent: 'space-between', height: 85 },
//   topActions: { flexDirection: 'row', alignSelf: 'flex-start' },
//   starBtn: { marginRight: 10, padding: 2 },
//   deleteBtn: { padding: 2 },
//   counter: { flexDirection: 'row-reverse', alignItems: 'center' },
//   qtyText: { fontSize: 16, fontWeight: 'bold', marginHorizontal: 8 },
//   footer: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#fff', padding: 20, borderTopWidth: 1, borderColor: '#eee', flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' },
//   totalContainer: { alignItems: 'flex-end' },
//   totalLabel: { color: '#666' },
//   totalAmount: { fontSize: 20, fontWeight: 'bold' },
//   checkoutBtn: { backgroundColor: '#D2691E', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 25 },
//   checkoutText: { color: '#fff', fontWeight: 'bold' }
// });



// //cart.tsx
// import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons';
// import apiClient from '@/libs/services/axiosClient';

// type CartItem = {
//   _id?: string;
//   product: {
//     _id: string;
//     name: string;
//     price: number;
//     imageUrls?: string[];
//     image?: string;
//     dailyStock: number;
//   };
//   quantity: number;
// };

// const CartScreen = () => {
//   const router = useRouter();
//   const [cartItems, setCartItems] = useState<CartItem[]>([]);
//   const [totalPrice, setTotalPrice] = useState(0);
//   const [isLoading, setIsLoading] = useState(true);
//   const [updatingId, setUpdatingId] = useState<string | null>(null);

//   // 1. الدالة الذكية لمعالجة الصور (تمنع الشاشة البيضاء والتحذيرات)
//  const getImageUrl = (source?: any) => {
//   if (!source) return 'https://via.placeholder.com/400x200.png?text=No+Image';
//   let url = '';
  
//   if (typeof source === 'string') url = source;
//   else if (Array.isArray(source) && source.length > 0) url = source[0];

//   if (!url || typeof url !== 'string' || url.trim() === '') {
//     return 'https://via.placeholder.com/400x200.png?text=No+Image';
//   }
  
//   // 🚨 السطر السحري الجديد: تحويل مسارات ويندوز إلى مسارات إنترنت صحيحة
//   url = url.replace(/\\/g, '/');

//   if (url.startsWith('http')) return url;
  
//   const SERVER_URL = 'http://192.168.1.28:5000';
//   const cleanPath = url.startsWith('/') ? url : `/${url}`;
  
//   // طباعة الرابط النهائي في الكونسول لنتأكد أنه سليم 100%
//   console.log("Final Image URL:", `${SERVER_URL}${cleanPath}`);
  
//   return `${SERVER_URL}${cleanPath}`;
// };

//   // 2. دالة جلب السلة (تم إعادتها لمكانها الصحيح)
//   const fetchCart = async () => {
//     try {
//       const { data } = await apiClient.get('/api/cart');
//       setCartItems(data.items || []);
//       setTotalPrice(data.totalPrice || 0);
//     } catch (error) {
//       console.error("خطأ في جلب السلة:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // 3. استدعاء الجلب عند فتح الشاشة
//   useEffect(() => {
//     fetchCart();
//   }, []);

//   const handleUpdateQuantity = async (productId: string, currentQty: number, change: number, stock: number) => {
//     const newQty = currentQty + change;
//     if (newQty < 1) return;
//     if (newQty > stock) return Alert.alert("عذراً", `الكمية المتوفرة ${stock} فقط.`);
//     try {
//       setUpdatingId(productId);
//       const { data } = await apiClient.patch(`/api/cart/items/${productId}`, { quantity: newQty });
//       setCartItems(data.items);
//       setTotalPrice(data.totalPrice);
//     } catch (error) { Alert.alert("خطأ", "فشل التحديث"); } finally { setUpdatingId(null); }
//   };

//   const handleRemoveItem = async (productId: string) => {
//     try {
//       setUpdatingId(productId);
//       const { data } = await apiClient.delete(`/api/cart/items/${productId}`);
//       setCartItems(data.items);
//       setTotalPrice(data.totalPrice);
//     } catch (error) { Alert.alert("خطأ", "فشل الحذف"); } finally { setUpdatingId(null); }
//   };

//   // دالة الذهاب للتقييم مع تمرير الصورة بشكل صحيح
//   const promptForReview = (product: any) => {
//     const fullImageUrl = getImageUrl(product.imageUrls || product.image);
//     Alert.alert(
//       "تقييم المنتج",
//       `هل تريد تقييم "${product.name}"؟`,
//       [
//         { text: "لاحقاً", style: "cancel" },
//         {
//           text: "نعم",
//           onPress: () => router.push({
//             pathname: '/profile/reviews',
//             params: { productId: product._id, name: product.name, image: fullImageUrl }
//           })
//         }
//       ]
//     );
//   };

//   if (isLoading) return <View style={styles.centered}><ActivityIndicator size="large" color="#D2691E" /></View>;

//   if (cartItems.length === 0) {
//     return (
//       <View style={styles.emptyContainer}>
//         <Ionicons name="cart-outline" size={80} color="#ccc" />
//         <Text style={styles.emptyText}>السلة فارغة</Text>
//         <TouchableOpacity style={styles.shopNowBtn} onPress={() => router.push('/(tabs)')}>
//           <Text style={styles.shopNowText}>تصفح المخبوزات</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   const renderCartItem = ({ item }: { item: CartItem }) => {
//     if (!item.product || !item.product._id) return null;
//     return (
//       <View style={styles.cartCard}>
//         {/* 🖼️ هنا يتم عرض الصورة بأمان تام */}
//         <Image
//           source={{ uri: getImageUrl(item.product.imageUrls || item.product.image) }}
//           style={styles.itemImage}
//           defaultSource={{ uri: 'https://via.placeholder.com/150x150.png?text=No+Image' }}
//         />
//         <View style={styles.itemDetails}>
//           <Text style={styles.itemName} numberOfLines={1}>{item.product.name}</Text>
//           <Text style={styles.itemPrice}>{item.product.price} ر.س</Text>
//         </View>
//         <View style={styles.actionsContainer}>
//           <View style={styles.topActions}>
//              <TouchableOpacity onPress={() => promptForReview(item.product)} style={styles.starBtn}>
//               <Ionicons name="star" size={22} color="#FFB800" />
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => handleRemoveItem(item.product._id)} disabled={updatingId === item.product._id} style={styles.deleteBtn}>
//               <Ionicons name="trash-outline" size={22} color="#FF3B30" />
//             </TouchableOpacity>
//           </View>
//           <View style={styles.counter}>
//             <TouchableOpacity onPress={() => handleUpdateQuantity(item.product._id, item.quantity, -1, item.product.dailyStock)}>
//               <Ionicons name="remove-circle-outline" size={28} color={item.quantity <= 1 ? "#ccc" : "#333"} />
//             </TouchableOpacity>
//             {updatingId === item.product._id ? <ActivityIndicator size="small" color="#D2691E" /> : <Text style={styles.qtyText}>{item.quantity}</Text>}
//             <TouchableOpacity onPress={() => handleUpdateQuantity(item.product._id, item.quantity, 1, item.product.dailyStock)}>
//               <Ionicons name="add-circle-outline" size={28} color="#D2691E" />
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.headerTitle}>سلة المشتريات</Text>
//       <FlatList data={cartItems} keyExtractor={(item) => item.product._id} renderItem={renderCartItem} contentContainerStyle={{ padding: 15, paddingBottom: 100 }} />
//       <View style={styles.footer}>
//         <View style={styles.totalContainer}>
//           <Text style={styles.totalLabel}>الإجمالي:</Text>
//           <Text style={styles.totalAmount}>{totalPrice.toFixed(2)} ر.س</Text>
//         </View>
//         <TouchableOpacity style={styles.checkoutBtn} onPress={() => router.push('/checkout')}>
//           <Text style={styles.checkoutText}>إتمام الطلب</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default CartScreen;

// const styles = StyleSheet.create({
//   centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9f9f9' },
//   container: { flex: 1, backgroundColor: '#f9f9f9' },
//   headerTitle: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginTop: 50, marginBottom: 15 },
//   emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   emptyText: { fontSize: 18, color: '#666', marginVertical: 20 },
//   shopNowBtn: { backgroundColor: '#D2691E', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 25 },
//   shopNowText: { color: '#fff', fontWeight: 'bold' },
//   cartCard: { flexDirection: 'row-reverse', backgroundColor: '#fff', borderRadius: 16, padding: 12, marginBottom: 15, elevation: 3, alignItems: 'center' },
//   itemImage: { width: 85, height: 85, borderRadius: 12, backgroundColor: '#eee' },
//   itemDetails: { flex: 1, marginHorizontal: 12 },
//   itemName: { fontSize: 15, fontWeight: 'bold', textAlign: 'right' },
//   itemPrice: { fontSize: 15, color: '#D2691E', fontWeight: 'bold', textAlign: 'right' },
//   actionsContainer: { alignItems: 'center', justifyContent: 'space-between', height: 85 },
//   topActions: { flexDirection: 'row', alignSelf: 'flex-start' },
//   starBtn: { marginRight: 10, padding: 2 },
//   deleteBtn: { padding: 2 },
//   counter: { flexDirection: 'row-reverse', alignItems: 'center' },
//   qtyText: { fontSize: 16, fontWeight: 'bold', marginHorizontal: 8 },
//   footer: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#fff', padding: 20, borderTopWidth: 1, borderColor: '#eee', flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' },
//   totalContainer: { alignItems: 'flex-end' },
//   totalLabel: { color: '#666' },
//   totalAmount: { fontSize: 20, fontWeight: 'bold' },
//   checkoutBtn: { backgroundColor: '#D2691E', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 25 },
//   checkoutText: { color: '#fff', fontWeight: 'bold' }
// });




// cart.tsx
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
// 🛠️ لاحظ التعديل هنا: استوردنا useCallback
import React, { useState, useCallback } from 'react';
// 🛠️ لاحظ التعديل هنا: استوردنا useFocusEffect
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import apiClient from '@/libs/services/axiosClient';

type CartItem = {
  _id?: string;
  product: {
    _id: string;
    name: string;
    price: number;
    imageUrls?: string[];
    image?: string;
    dailyStock: number;
  };
  quantity: number;
};

const CartScreen = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const getImageUrl = (source?: any) => {
    const PLACEHOLDER = 'https://via.placeholder.com/400x200.png?text=No+Image';
    if (!source) return PLACEHOLDER;
    let url = '';
    
    if (typeof source === 'string') url = source;
    else if (Array.isArray(source) && source.length > 0) url = source[0];

    if (!url || typeof url !== 'string' || url.trim() === '') return PLACEHOLDER;
    
    url = url.trim().replace(/\\/g, '/');

    if (url.startsWith('http')) return url;
    
    const SERVER_URL = 'http://192.168.1.28:5000';
    const cleanPath = url.startsWith('/') ? url : `/${url}`;
    
    return `${SERVER_URL}${cleanPath}`;
  };

  const fetchCart = async () => {
    try {
      setIsLoading(true); // نضمن عرض مؤشر التحميل عند التحديث
      const { data } = await apiClient.get('/api/cart');
      setCartItems(data.items || []);
      setTotalPrice(data.totalPrice || 0);
    } catch (error) {
      console.error("خطأ في جلب السلة:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------------------------------------------------
  // 🛠️ الحل السحري للتحديث التلقائي: استخدام useFocusEffect بدلاً من useEffect
  // -------------------------------------------------------------------
  useFocusEffect(
    useCallback(() => {
      fetchCart();
    }, [])
  );

  const handleUpdateQuantity = async (productId: string, currentQty: number, change: number, stock: number) => {
    const newQty = currentQty + change;
    if (newQty < 1) return;
    if (newQty > stock) return Alert.alert("عذراً", `الكمية المتوفرة ${stock} فقط.`);
    try {
      setUpdatingId(productId);
      const { data } = await apiClient.patch(`/api/cart/items/${productId}`, { quantity: newQty });
      setCartItems(data.items);
      setTotalPrice(data.totalPrice);
    } catch (error) { Alert.alert("خطأ", "فشل التحديث"); } finally { setUpdatingId(null); }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      setUpdatingId(productId);
      const { data } = await apiClient.delete(`/api/cart/items/${productId}`);
      setCartItems(data.items);
      setTotalPrice(data.totalPrice);
    } catch (error) { Alert.alert("خطأ", "فشل الحذف"); } finally { setUpdatingId(null); }
  };

  const promptForReview = (product: any) => {
    const fullImageUrl = getImageUrl(product.imageUrls || product.image);
    Alert.alert(
      "تقييم المنتج",
      `هل تريد تقييم "${product.name}"؟`,
      [
        { text: "لاحقاً", style: "cancel" },
        {
          text: "نعم",
          onPress: () => router.push({
            pathname: '/profile/reviews',
            params: { productId: product._id, name: product.name, image: fullImageUrl }
          })
        }
      ]
    );
  };

  if (isLoading) return <View style={styles.centered}><ActivityIndicator size="large" color="#D2691E" /></View>;

  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="cart-outline" size={80} color="#ccc" />
        <Text style={styles.emptyText}>السلة فارغة</Text>
        <TouchableOpacity style={styles.shopNowBtn} onPress={() => router.push('/(tabs)')}>
          <Text style={styles.shopNowText}>تصفح المخبوزات</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderCartItem = ({ item }: { item: CartItem }) => {
    if (!item.product || !item.product._id) return null;
    return (
      <View style={styles.cartCard}>
        <Image
          source={{ uri: getImageUrl(item.product.imageUrls || item.product.image) }}
          style={styles.itemImage}
        />
        <View style={styles.itemDetails}>
          <Text style={styles.itemName} numberOfLines={1}>{item.product.name}</Text>
          <Text style={styles.itemPrice}>{item.product.price} ر.س</Text>
        </View>
        <View style={styles.actionsContainer}>
          <View style={styles.topActions}>
             <TouchableOpacity onPress={() => promptForReview(item.product)} style={styles.starBtn}>
              <Ionicons name="star" size={22} color="#FFB800" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleRemoveItem(item.product._id)} disabled={updatingId === item.product._id} style={styles.deleteBtn}>
              <Ionicons name="trash-outline" size={22} color="#FF3B30" />
            </TouchableOpacity>
          </View>
          <View style={styles.counter}>
            <TouchableOpacity onPress={() => handleUpdateQuantity(item.product._id, item.quantity, -1, item.product.dailyStock)}>
              <Ionicons name="remove-circle-outline" size={28} color={item.quantity <= 1 ? "#ccc" : "#333"} />
            </TouchableOpacity>
            {updatingId === item.product._id ? <ActivityIndicator size="small" color="#D2691E" /> : <Text style={styles.qtyText}>{item.quantity}</Text>}
            <TouchableOpacity onPress={() => handleUpdateQuantity(item.product._id, item.quantity, 1, item.product.dailyStock)}>
              <Ionicons name="add-circle-outline" size={28} color="#D2691E" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>سلة المشتريات</Text>
      <FlatList data={cartItems} keyExtractor={(item) => item.product._id} renderItem={renderCartItem} contentContainerStyle={{ padding: 15, paddingBottom: 100 }} />
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>الإجمالي:</Text>
          <Text style={styles.totalAmount}>{totalPrice.toFixed(2)} ر.س</Text>
        </View>
        <TouchableOpacity style={styles.checkoutBtn} onPress={() => router.push('/checkout')}>
          <Text style={styles.checkoutText}>إتمام الطلب</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9f9f9' },
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  headerTitle: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginTop: 50, marginBottom: 15 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 18, color: '#666', marginVertical: 20 },
  shopNowBtn: { backgroundColor: '#D2691E', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 25 },
  shopNowText: { color: '#fff', fontWeight: 'bold' },
  cartCard: { flexDirection: 'row-reverse', backgroundColor: '#fff', borderRadius: 16, padding: 12, marginBottom: 15, elevation: 3, alignItems: 'center' },
  itemImage: { width: 85, height: 85, borderRadius: 12, backgroundColor: '#eee' },
  itemDetails: { flex: 1, marginHorizontal: 12 },
  itemName: { fontSize: 15, fontWeight: 'bold', textAlign: 'right' },
  itemPrice: { fontSize: 15, color: '#D2691E', fontWeight: 'bold', textAlign: 'right' },
  actionsContainer: { alignItems: 'center', justifyContent: 'space-between', height: 85 },
  topActions: { flexDirection: 'row', alignSelf: 'flex-start' },
  starBtn: { marginRight: 10, padding: 2 },
  deleteBtn: { padding: 2 },
  counter: { flexDirection: 'row-reverse', alignItems: 'center' },
  qtyText: { fontSize: 16, fontWeight: 'bold', marginHorizontal: 8 },
  footer: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#fff', padding: 20, borderTopWidth: 1, borderColor: '#eee', flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' },
  totalContainer: { alignItems: 'flex-end' },
  totalLabel: { color: '#666' },
  totalAmount: { fontSize: 20, fontWeight: 'bold' },
  checkoutBtn: { backgroundColor: '#D2691E', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 25 },
  checkoutText: { color: '#fff', fontWeight: 'bold' }
});