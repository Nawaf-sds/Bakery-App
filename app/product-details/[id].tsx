

// //[id].tsx
// import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, FlatList, Dimensions, TouchableOpacity, Alert, Animated } from 'react-native';
// import React, { useEffect, useState, useRef } from 'react';
// import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
// import apiClient from '@/libs/services/axiosClient';
// import { Ionicons } from '@expo/vector-icons';

// type ProductTypeWithImages = {
//   _id: string;
//   name: string;
//   price: number;
//   description: string;
//   imageUrls: string[];
//   ingredients: string[];
//   size: string;
//   category: string;
//   dailyStock?: number;
// };

// const { width } = Dimensions.get('window');

// const ProductDetailsScreen = () => {
//   const { id } = useLocalSearchParams<{ id: string }>();
//   const router = useRouter();

//   const [product, setProduct] = useState<ProductTypeWithImages | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [quantity, setQuantity] = useState(1);
//   const [isAddingToCart, setIsAddingToCart] = useState(false);
  
//   // ✨ متغير لحركة نبض القلب
//   const heartScale = useRef(new Animated.Value(1)).current;

//   const viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 };
//   const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
//     if (viewableItems.length > 0) setActiveIndex(viewableItems[0].index);
//   }).current;

//   useEffect(() => {
//     const fetchProductDetails = async () => {
//       try {
//         const response = await apiClient.get(`/api/products/${id}`);
//         setProduct(response.data);
//       } catch (err: any) {
//         setError(err.message || 'فشل في جلب تفاصيل المنتج');
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     if (id) fetchProductDetails();
//   }, [id]);

// const getImageUrl = (source?: any) => {
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

//   const increment = () => {
//     if (product?.dailyStock && quantity >= product.dailyStock) return;
//     setQuantity(prev => prev + 1);
//   };

//   const decrement = () => { if (quantity > 1) setQuantity(prev => prev - 1); };

//   const totalPrice = product ? (product.price * quantity).toFixed(2) : 0;

//   // -------------------------------------------------------------------
//   // ✨ دالة إضافة المنتج للسلة
//   // -------------------------------------------------------------------
//   const handleAddToCart = async () => {
//     if (!product) return;
//     try {
//       setIsAddingToCart(true);
//       await apiClient.post('/api/cart', { productId: product._id, quantity: quantity });
//       Alert.alert("🛒 رائع!", "تمت إضافة المنتج إلى سلتك بنجاح.", [
//         { text: "متابعة التسوق", style: "cancel" },
//         { text: "الذهاب للسلة", onPress: () => router.push('/cart') }
//       ]);
//     } catch (err: any) {
//       console.error(err);
//       Alert.alert("❌ عذراً", "حدث خطأ أثناء إضافة المنتج للسلة.");
//     } finally {
//       setIsAddingToCart(false);
//     }
//   };

//   // -------------------------------------------------------------------
//   // ✨ دالة إضافة المنتج للمفضلة (الجديدة)
//   // -------------------------------------------------------------------
//   const handleToggleWishlist = async () => {
//     if (!product) return;
    
//     // تشغيل أنيميشن النبض للقلب
//     Animated.sequence([
//       Animated.timing(heartScale, { toValue: 1.4, duration: 150, useNativeDriver: true }),
//       Animated.timing(heartScale, { toValue: 1, duration: 150, useNativeDriver: true })
//     ]).start();

//     try {
//       // إرسال الطلب للسيرفر
//       await apiClient.post('/api/wishlist', { productId: product._id });
//       Alert.alert('نجاح', 'تم إضافة المنتج للمفضلة! ❤️');
//     } catch (error) {
//       Alert.alert('خطأ', 'حدث خطأ أثناء الإضافة للمفضلة');
//     }
//   };

//   if (isLoading) return <View style={styles.centered}><ActivityIndicator size="large" color="#D2691E" /></View>;
//   if (error || !product) return <View style={styles.centered}><Text style={styles.errorText}>{error}</Text></View>;

//   const images = product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls : [''];

//   return (
//     <View style={styles.container}>
//       <Stack.Screen
//         options={{
//           headerTitle: '',
//           headerTransparent: true,
//           headerBackTitleVisible: true,
//           headerLeft: () => (
//             <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
//               <Ionicons name="arrow-back" size={24} color="#333" />
//             </TouchableOpacity>
//           ),
//           headerRight: () => (
//             // ✨ تعديل زر القلب: أصبح قابلاً للضغط ويرتبط بدالة المفضلة والأنيميشن
//             <TouchableOpacity style={styles.headerButton} onPress={handleToggleWishlist}>
//               <Animated.View style={{ transform: [{ scale: heartScale }] }}>
//                 <Ionicons name="heart-outline" size={24} color="#D2691E" />
//               </Animated.View>
//             </TouchableOpacity>
//           ),
//         }}
//       />
      
//       <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
//         <View>
//           <FlatList
//             data={images}
//             keyExtractor={(item, index) => index.toString()}
//             renderItem={({ item }) => <Image source={{ uri: getImageUrl(item) }} style={styles.image} />}
//             horizontal pagingEnabled showsHorizontalScrollIndicator={false}
//             onViewableItemsChanged={onViewableItemsChanged} viewabilityConfig={viewabilityConfig}
//           />
//           <View style={styles.pagination}>
//             {images.length > 1 && images.map((_, index) => (
//               <View key={index} style={[styles.dot, { backgroundColor: index === activeIndex ? '#D2691E' : '#FFF' }]} />
//             ))}
//           </View>
//         </View>

//         <View style={styles.detailsContainer}>
//           <View style={styles.titleRow}>
//             <Text style={styles.name}>{product.name}</Text>
//             <Text style={styles.price}>{product.price} ر.س</Text>
//           </View>

//           <View style={styles.badgesRow}>
//             <View style={styles.badge}><Text style={styles.badgeText}>{product.category}</Text></View>
//             <View style={styles.badge}><Text style={styles.badgeText}>الحجم: {product.size}</Text></View>
//           </View>

//           <Text style={styles.sectionTitle}>الوصف</Text>
//           <Text style={styles.description}>{product.description || 'لا يوجد وصف متاح لهذا المنتج.'}</Text>

//           {product.ingredients && product.ingredients.length > 0 && (
//             <>
//               <Text style={styles.sectionTitle}>المكونات</Text>
//               <Text style={styles.description}>{product.ingredients.join('، ')}</Text>
//             </>
//           )}
//         </View>
//       </ScrollView>

//       <View style={styles.footer}>
//         <View style={styles.counterContainer}>
//           <TouchableOpacity onPress={decrement} style={styles.counterBtn}>
//             <Ionicons name="remove" size={24} color="#333" />
//           </TouchableOpacity>
//           <Text style={styles.counterText}>{quantity}</Text>
//           <TouchableOpacity onPress={increment} style={styles.counterBtn}>
//             <Ionicons name="add" size={24} color="#333" />
//           </TouchableOpacity>
//         </View>

//         <TouchableOpacity 
//           style={[styles.addToCartButton, isAddingToCart && { opacity: 0.7 }]}
//           onPress={handleAddToCart} disabled={isAddingToCart}
//         >
//           {isAddingToCart ? (
//             <ActivityIndicator color="#fff" />
//           ) : (
//             <>
//               <Text style={styles.addToCartButtonText}>إضافة للسلة</Text>
//               <View style={styles.totalPriceBadge}>
//                 <Text style={styles.totalPriceText}>{totalPrice} ر.س</Text>
//               </View>
//             </>
//           )}
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default ProductDetailsScreen;

// const styles = StyleSheet.create({
//   centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   container: { flex: 1, backgroundColor: '#fff' },
//   headerButton: { backgroundColor: 'rgba(255,255,255,0.9)', padding: 8, borderRadius: 20, marginHorizontal: 10, marginTop: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 1.41, elevation: 2 },
//   image: { width: width, height: 400, resizeMode: 'cover' },
//   pagination: { flexDirection: 'row', position: 'absolute', bottom: 50, alignSelf: 'center' },
//   dot: { width: 8, height: 8, borderRadius: 4, marginHorizontal: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.5, shadowRadius: 1 },
//   detailsContainer: { paddingHorizontal: 20, paddingTop: 25, backgroundColor: '#fff', marginTop: -30, borderTopLeftRadius: 30, borderTopRightRadius: 30, minHeight: 400 },
//   titleRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
//   name: { fontSize: 24, fontWeight: 'bold', color: '#333', flex: 1, textAlign: 'right' },
//   price: { fontSize: 22, fontWeight: 'bold', color: '#D2691E' },
//   badgesRow: { flexDirection: 'row-reverse', marginBottom: 20 },
//   badge: { backgroundColor: '#f5f5f5', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15, marginLeft: 10 },
//   badgeText: { color: '#666', fontSize: 14, fontWeight: '500' },
//   sectionTitle: { fontSize: 18, fontWeight: 'bold', textAlign: 'right', marginTop: 10, marginBottom: 8, color: '#333' },
//   description: { fontSize: 15, lineHeight: 24, color: '#666', textAlign: 'right' },
//   footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 15, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f0f0f0', flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 25 },
//   counterContainer: { flexDirection: 'row-reverse', alignItems: 'center', backgroundColor: '#f5f5f5', borderRadius: 25, paddingHorizontal: 5, paddingVertical: 5, marginRight: 10 },
//   counterBtn: { backgroundColor: '#fff', padding: 8, borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 1, elevation: 2 },
//   counterText: { fontSize: 18, fontWeight: 'bold', marginHorizontal: 15, color: '#333' },
//   addToCartButton: { backgroundColor: '#D2691E', flex: 1, flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 20, borderRadius: 25 },
//   addToCartButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
//   totalPriceBadge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
//   totalPriceText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
//   errorText: { color: 'red', fontSize: 16 },
// });






// [id].tsx
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, FlatList, Dimensions, TouchableOpacity, Alert, Animated } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import apiClient from '@/libs/services/axiosClient';
import { Ionicons } from '@expo/vector-icons';

type ProductTypeWithImages = {
  _id: string;
  name: string;
  price: number;
  description: string;
  imageUrls: string[];
  ingredients: string[];
  size: string;
  category: string;
  dailyStock?: number;
};

const { width } = Dimensions.get('window');

const ProductDetailsScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [product, setProduct] = useState<ProductTypeWithImages | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  const heartScale = useRef(new Animated.Value(1)).current;

  const viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 };
  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) setActiveIndex(viewableItems[0].index);
  }).current;

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await apiClient.get(`/api/products/${id}`);
        setProduct(response.data);
      } catch (err: any) {
        setError(err.message || 'فشل في جلب تفاصيل المنتج');
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchProductDetails();
  }, [id]);

  const getImageUrl = (source?: any) => {
    const PLACEHOLDER = 'https://via.placeholder.com/400x200.png?text=No+Image';
    if (!source) return PLACEHOLDER;
    let url = '';
    if (typeof source === 'string') url = source;
    else if (Array.isArray(source) && source.length > 0) url = source[0];

    if (!url || typeof url !== 'string' || url.trim() === '') {
      return PLACEHOLDER;
    }
    
    url = url.trim().replace(/\\/g, '/');
    if (url.startsWith('http')) return url;
    
    const SERVER_URL = 'http://192.168.1.28:5000';
    const cleanPath = url.startsWith('/') ? url : `/${url}`;
    return `${SERVER_URL}${cleanPath}`;
  };

  const increment = () => {
    if (product?.dailyStock && quantity >= product.dailyStock) return;
    setQuantity(prev => prev + 1);
  };

  const decrement = () => { if (quantity > 1) setQuantity(prev => prev - 1); };

  const totalPrice = product ? (product.price * quantity).toFixed(2) : 0;

  // -------------------------------------------------------------------
  // 🛠️ تم تعديل هذه الدالة لضمان ظهور التنبيه (Alert) بدون أخطاء
  // -------------------------------------------------------------------
  const handleAddToCart = async () => {
    if (!product) return;
    try {
      setIsAddingToCart(true);
      await apiClient.post('/api/cart', { productId: product._id, quantity: quantity });
      
      // نستخدم تأخير بسيط 100 ملي ثانية لضمان أن حالة التحميل قد انتهت وأنه لا يوجد تداخل
      setTimeout(() => {
        Alert.alert(
          "🛒 رائع!", 
          "تمت إضافة المنتج إلى سلتك بنجاح.", 
          [
            { text: "متابعة التسوق", style: "cancel" },
            { text: "الذهاب للسلة", onPress: () => router.push('/cart') }
          ]
        );
      }, 100);

    } catch (err: any) {
      console.error("Cart Error: ", err?.response?.data || err.message);
      setTimeout(() => {
        Alert.alert("❌ عذراً", "حدث خطأ أثناء إضافة المنتج للسلة.");
      }, 100);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleWishlist = async () => {
    if (!product) return;
    Animated.sequence([
      Animated.timing(heartScale, { toValue: 1.4, duration: 150, useNativeDriver: true }),
      Animated.timing(heartScale, { toValue: 1, duration: 150, useNativeDriver: true })
    ]).start();

    try {
      await apiClient.post('/api/wishlist', { productId: product._id });
      Alert.alert('نجاح', 'تم إضافة المنتج للمفضلة! ❤️');
    } catch (error) {
      Alert.alert('خطأ', 'حدث خطأ أثناء الإضافة للمفضلة');
    }
  };

  if (isLoading) return <View style={styles.centered}><ActivityIndicator size="large" color="#D2691E" /></View>;
  if (error || !product) return <View style={styles.centered}><Text style={styles.errorText}>{error}</Text></View>;

  const images = product.imageUrls && Array.isArray(product.imageUrls) 
    ? product.imageUrls.filter(img => img && typeof img === 'string' && img.trim() !== '') 
    : [];
  if (images.length === 0) images.push('');

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: '',
          headerTransparent: true,
          headerBackTitleVisible: true,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity style={styles.headerButton} onPress={handleToggleWishlist}>
              <Animated.View style={{ transform: [{ scale: heartScale }] }}>
                <Ionicons name="heart-outline" size={24} color="#D2691E" />
              </Animated.View>
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <View>
          <FlatList
            data={images}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => <Image source={{ uri: getImageUrl(item) }} style={styles.image} />}
            horizontal pagingEnabled showsHorizontalScrollIndicator={false}
            onViewableItemsChanged={onViewableItemsChanged} viewabilityConfig={viewabilityConfig}
          />
          <View style={styles.pagination}>
            {images.length > 1 && images.map((_, index) => (
              <View key={index} style={[styles.dot, { backgroundColor: index === activeIndex ? '#D2691E' : '#FFF' }]} />
            ))}
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.name}>{product.name}</Text>
            <Text style={styles.price}>{product.price} ر.س</Text>
          </View>

          <View style={styles.badgesRow}>
            <View style={styles.badge}><Text style={styles.badgeText}>{product.category}</Text></View>
            <View style={styles.badge}><Text style={styles.badgeText}>الحجم: {product.size}</Text></View>
          </View>

          <Text style={styles.sectionTitle}>الوصف</Text>
          <Text style={styles.description}>{product.description || 'لا يوجد وصف متاح لهذا المنتج.'}</Text>

          {product.ingredients && product.ingredients.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>المكونات</Text>
              <Text style={styles.description}>{product.ingredients.join('، ')}</Text>
            </>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.counterContainer}>
          <TouchableOpacity onPress={decrement} style={styles.counterBtn}>
            <Ionicons name="remove" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.counterText}>{quantity}</Text>
          <TouchableOpacity onPress={increment} style={styles.counterBtn}>
            <Ionicons name="add" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.addToCartButton, isAddingToCart && { opacity: 0.7 }]}
          onPress={handleAddToCart} disabled={isAddingToCart}
        >
          {isAddingToCart ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.addToCartButtonText}>إضافة للسلة</Text>
              <View style={styles.totalPriceBadge}>
                <Text style={styles.totalPriceText}>{totalPrice} ر.س</Text>
              </View>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProductDetailsScreen;

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, backgroundColor: '#fff' },
  headerButton: { backgroundColor: 'rgba(255,255,255,0.9)', padding: 8, borderRadius: 20, marginHorizontal: 10, marginTop: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 1.41, elevation: 2 },
  image: { width: width, height: 400, resizeMode: 'cover' },
  pagination: { flexDirection: 'row', position: 'absolute', bottom: 50, alignSelf: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, marginHorizontal: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.5, shadowRadius: 1 },
  detailsContainer: { paddingHorizontal: 20, paddingTop: 25, backgroundColor: '#fff', marginTop: -30, borderTopLeftRadius: 30, borderTopRightRadius: 30, minHeight: 400 },
  titleRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  name: { fontSize: 24, fontWeight: 'bold', color: '#333', flex: 1, textAlign: 'right' },
  price: { fontSize: 22, fontWeight: 'bold', color: '#D2691E' },
  badgesRow: { flexDirection: 'row-reverse', marginBottom: 20 },
  badge: { backgroundColor: '#f5f5f5', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15, marginLeft: 10 },
  badgeText: { color: '#666', fontSize: 14, fontWeight: '500' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', textAlign: 'right', marginTop: 10, marginBottom: 8, color: '#333' },
  description: { fontSize: 15, lineHeight: 24, color: '#666', textAlign: 'right' },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 15, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f0f0f0', flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 25 },
  counterContainer: { flexDirection: 'row-reverse', alignItems: 'center', backgroundColor: '#f5f5f5', borderRadius: 25, paddingHorizontal: 5, paddingVertical: 5, marginRight: 10 },
  counterBtn: { backgroundColor: '#fff', padding: 8, borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 1, elevation: 2 },
  counterText: { fontSize: 18, fontWeight: 'bold', marginHorizontal: 15, color: '#333' },
  addToCartButton: { backgroundColor: '#D2691E', flex: 1, flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 20, borderRadius: 25 },
  addToCartButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  totalPriceBadge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  totalPriceText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  errorText: { color: 'red', fontSize: 16 },
});



// import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, FlatList, Dimensions, TouchableOpacity, Alert, Animated } from 'react-native';
// import React, { useEffect, useState, useRef } from 'react';
// import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
// import apiClient from '@/libs/services/axiosClient';
// import { Ionicons } from '@expo/vector-icons';

// type ProductTypeWithImages = {
//   _id: string;
//   name: string;
//   price: number;
//   description: string;
//   imageUrls: string[];
//   ingredients: string[];
//   size: string;
//   category: string;
//   dailyStock?: number;
// };

// const { width } = Dimensions.get('window');

// const ProductDetailsScreen = () => {
//   const { id } = useLocalSearchParams<{ id: string }>();
//   const router = useRouter();

//   const [product, setProduct] = useState<ProductTypeWithImages | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [quantity, setQuantity] = useState(1);
//   const [isAddingToCart, setIsAddingToCart] = useState(false);
  
//   // ✨ متغير لحركة نبض القلب
//   const heartScale = useRef(new Animated.Value(1)).current;

//   const viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 };
//   const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
//     if (viewableItems.length > 0) setActiveIndex(viewableItems[0].index);
//   }).current;

//   useEffect(() => {
//     const fetchProductDetails = async () => {
//       try {
//         const response = await apiClient.get(`/api/products/${id}`);
//         setProduct(response.data);
//       } catch (err: any) {
//         setError(err.message || 'فشل في جلب تفاصيل المنتج');
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     if (id) fetchProductDetails();
//   }, [id]);

//   // 🛠️ التعديل الأول: تأمين الدالة وتنظيف الروابط من المسافات
//   const getImageUrl = (source?: any) => {
//     const PLACEHOLDER = 'https://via.placeholder.com/400x200.png?text=No+Image';
//     if (!source) return PLACEHOLDER;
    
//     let url = '';
//     if (typeof source === 'string') url = source;
//     else if (Array.isArray(source) && source.length > 0) url = source[0];

//     // التحقق من أن النص ليس فارغاً
//     if (!url || typeof url !== 'string' || url.trim() === '') {
//       return PLACEHOLDER;
//     }
    
//     // ✨ السطر السحري: إزالة المسافات من الأطراف وتحويل مسارات ويندوز
//     url = url.trim().replace(/\\/g, '/');

//     if (url.startsWith('http')) return url;
    
//     const SERVER_URL = 'http://192.168.1.28:5000';
//     const cleanPath = url.startsWith('/') ? url : `/${url}`;
    
//     return `${SERVER_URL}${cleanPath}`;
//   };

//   const increment = () => {
//     if (product?.dailyStock && quantity >= product.dailyStock) return;
//     setQuantity(prev => prev + 1);
//   };

//   const decrement = () => { if (quantity > 1) setQuantity(prev => prev - 1); };

//   const totalPrice = product ? (product.price * quantity).toFixed(2) : 0;

//   // ✨ دالة إضافة المنتج للسلة
//   const handleAddToCart = async () => {
//     if (!product) return;
//     try {
//       setIsAddingToCart(true);
//       await apiClient.post('/api/cart', { productId: product._id, quantity: quantity });
//       Alert.alert("🛒 رائع!", "تمت إضافة المنتج إلى سلتك بنجاح.", [
//         { text: "متابعة التسوق", style: "cancel" },
//         { text: "الذهاب للسلة", onPress: () => router.push('/cart') }
//       ]);
//     } catch (err: any) {
//       console.error(err);
//       Alert.alert("❌ عذراً", "حدث خطأ أثناء إضافة المنتج للسلة.");
//     } finally {
//       setIsAddingToCart(false);
//     }
//   };

//   // ✨ دالة إضافة المنتج للمفضلة (الجديدة)
//   const handleToggleWishlist = async () => {
//     if (!product) return;
    
//     // تشغيل أنيميشن النبض للقلب
//     Animated.sequence([
//       Animated.timing(heartScale, { toValue: 1.4, duration: 150, useNativeDriver: true }),
//       Animated.timing(heartScale, { toValue: 1, duration: 150, useNativeDriver: true })
//     ]).start();

//     try {
//       await apiClient.post('/api/wishlist', { productId: product._id });
//       Alert.alert('نجاح', 'تم إضافة المنتج للمفضلة! ❤️');
//     } catch (error) {
//       Alert.alert('خطأ', 'حدث خطأ أثناء الإضافة للمفضلة');
//     }
//   };

//   if (isLoading) return <View style={styles.centered}><ActivityIndicator size="large" color="#D2691E" /></View>;
//   if (error || !product) return <View style={styles.centered}><Text style={styles.errorText}>{error}</Text></View>;

//   // 🛠️ التعديل الثاني: فلترة المصفوفة من أي مسارات فارغة أو تالفة لكي لا يتعطل السلايدر
//   const images = product.imageUrls && Array.isArray(product.imageUrls) 
//     ? product.imageUrls.filter(img => img && typeof img === 'string' && img.trim() !== '') 
//     : [];
  
//   // إذا كانت المصفوفة فارغة تماماً، نضيف عنصراً فارغاً لكي يعمل الـ Placeholder
//   if (images.length === 0) images.push('');

//   return (
//     <View style={styles.container}>
//       <Stack.Screen
//         options={{
//           headerTitle: '',
//           headerTransparent: true,
//           headerBackTitleVisible: false,
//           headerLeft: () => (
//             <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
//               <Ionicons name="arrow-back" size={24} color="#333" />
//             </TouchableOpacity>
//           ),
//           headerRight: () => (
//             <TouchableOpacity style={styles.headerButton} onPress={handleToggleWishlist}>
//               <Animated.View style={{ transform: [{ scale: heartScale }] }}>
//                 <Ionicons name="heart-outline" size={24} color="#D2691E" />
//               </Animated.View>
//             </TouchableOpacity>
//           ),
//         }}
//       />
      
//       <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
//         <View>
//           <FlatList
//             data={images}
//             keyExtractor={(item, index) => index.toString()}
//             renderItem={({ item }) => {
//               // 🛠️ التعديل الثالث: حماية نهائية للمكون
//               const finalUri = getImageUrl(item);
//               return (
//                 <Image 
//                   source={{ uri: finalUri && finalUri.trim() !== '' ? finalUri : 'https://via.placeholder.com/400x200.png?text=No+Image' }} 
//                   style={styles.image} 
//                 />
//               );
//             }}
//             horizontal 
//             pagingEnabled 
//             showsHorizontalScrollIndicator={false}
//             onViewableItemsChanged={onViewableItemsChanged} 
//             viewabilityConfig={viewabilityConfig}
//           />
//           <View style={styles.pagination}>
//             {images.length > 1 && images.map((_, index) => (
//               <View key={index} style={[styles.dot, { backgroundColor: index === activeIndex ? '#D2691E' : '#FFF' }]} />
//             ))}
//           </View>
//         </View>

//         <View style={styles.detailsContainer}>
//           <View style={styles.titleRow}>
//             <Text style={styles.name}>{product.name}</Text>
//             <Text style={styles.price}>{product.price} ر.س</Text>
//           </View>

//           <View style={styles.badgesRow}>
//             <View style={styles.badge}><Text style={styles.badgeText}>{product.category}</Text></View>
//             <View style={styles.badge}><Text style={styles.badgeText}>الحجم: {product.size}</Text></View>
//           </View>

//           <Text style={styles.sectionTitle}>الوصف</Text>
//           <Text style={styles.description}>{product.description || 'لا يوجد وصف متاح لهذا المنتج.'}</Text>

//           {product.ingredients && product.ingredients.length > 0 && (
//             <>
//               <Text style={styles.sectionTitle}>المكونات</Text>
//               <Text style={styles.description}>{product.ingredients.join('، ')}</Text>
//             </>
//           )}
//         </View>
//       </ScrollView>

//       <View style={styles.footer}>
//         <View style={styles.counterContainer}>
//           <TouchableOpacity onPress={decrement} style={styles.counterBtn}>
//             <Ionicons name="remove" size={24} color="#333" />
//           </TouchableOpacity>
//           <Text style={styles.counterText}>{quantity}</Text>
//           <TouchableOpacity onPress={increment} style={styles.counterBtn}>
//             <Ionicons name="add" size={24} color="#333" />
//           </TouchableOpacity>
//         </View>

//         <TouchableOpacity 
//           style={[styles.addToCartButton, isAddingToCart && { opacity: 0.7 }]}
//           onPress={handleAddToCart} disabled={isAddingToCart}
//         >
//           {isAddingToCart ? (
//             <ActivityIndicator color="#fff" />
//           ) : (
//             <>
//               <Text style={styles.addToCartButtonText}>إضافة للسلة</Text>
//               <View style={styles.totalPriceBadge}>
//                 <Text style={styles.totalPriceText}>{totalPrice} ر.س</Text>
//               </View>
//             </>
//           )}
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default ProductDetailsScreen;

// const styles = StyleSheet.create({
//   centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   container: { flex: 1, backgroundColor: '#fff' },
//   headerButton: { backgroundColor: 'rgba(255,255,255,0.9)', padding: 8, borderRadius: 20, marginHorizontal: 10, marginTop: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 1.41, elevation: 2 },
//   image: { width: width, height: 400, resizeMode: 'cover' },
//   pagination: { flexDirection: 'row', position: 'absolute', bottom: 50, alignSelf: 'center' },
//   dot: { width: 8, height: 8, borderRadius: 4, marginHorizontal: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.5, shadowRadius: 1 },
//   detailsContainer: { paddingHorizontal: 20, paddingTop: 25, backgroundColor: '#fff', marginTop: -30, borderTopLeftRadius: 30, borderTopRightRadius: 30, minHeight: 400 },
//   titleRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
//   name: { fontSize: 24, fontWeight: 'bold', color: '#333', flex: 1, textAlign: 'right' },
//   price: { fontSize: 22, fontWeight: 'bold', color: '#D2691E' },
//   badgesRow: { flexDirection: 'row-reverse', marginBottom: 20 },
//   badge: { backgroundColor: '#f5f5f5', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15, marginLeft: 10 },
//   badgeText: { color: '#666', fontSize: 14, fontWeight: '500' },
//   sectionTitle: { fontSize: 18, fontWeight: 'bold', textAlign: 'right', marginTop: 10, marginBottom: 8, color: '#333' },
//   description: { fontSize: 15, lineHeight: 24, color: '#666', textAlign: 'right' },
//   footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 15, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f0f0f0', flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 25 },
//   counterContainer: { flexDirection: 'row-reverse', alignItems: 'center', backgroundColor: '#f5f5f5', borderRadius: 25, paddingHorizontal: 5, paddingVertical: 5, marginRight: 10 },
//   counterBtn: { backgroundColor: '#fff', padding: 8, borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 1, elevation: 2 },
//   counterText: { fontSize: 18, fontWeight: 'bold', marginHorizontal: 15, color: '#333' },
//   addToCartButton: { backgroundColor: '#D2691E', flex: 1, flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 20, borderRadius: 25 },
//   addToCartButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
//   totalPriceBadge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
//   totalPriceText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
//   errorText: { color: 'red', fontSize: 16 },
// });