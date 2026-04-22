// import { FlatList, StyleSheet, ActivityIndicator, View, Text, Dimensions, Image, TouchableOpacity, RefreshControl, Alert, Animated } from 'react-native';
// import React, { useEffect, useState, useRef } from 'react';
// import apiClient from '@/libs/services/axiosClient';
// import { getProducts } from '@/libs/services/productService';
// import ProductItem from '@/components/ProductItem';
// import { Stack, useRouter } from 'expo-router';
// import Header from '@/components/Header';
// import { Ionicons } from '@expo/vector-icons';

// type ProductType = { _id: string; name: string; description: string; price: number; imageUrls: string[]; ingredients: string[]; size: string; category: string; };
// type PromotionType = { _id: string; image: string; link?: string; };

// const { width } = Dimensions.get('window');

// // ⚠️ 1. تحديث الـ IP إلى 11 ليتطابق مع اللوج الخاص بك
// const SERVER_URL = 'http://192.168.1.11:5000';

// // 💡 2. الدالة الذكية لمعالجة الصور (عامة لتعمل على السلايدر والمنتجات)
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
  
//   const SERVER_URL = 'http://192.168.1.11:5000';
//   const cleanPath = url.startsWith('/') ? url : `/${url}`;
  
//   // طباعة الرابط النهائي في الكونسول لنتأكد أنه سليم 100%
//   console.log("Final Image URL:", `${SERVER_URL}${cleanPath}`);
  
//   return `${SERVER_URL}${cleanPath}`;
// };

// // --- السلايدر الإعلاني ---
// const PromotionsSlider = ({ data }: { data: PromotionType[] }) => {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const flatListRef = useRef<FlatList<PromotionType> | null>(null);

//   useEffect(() => {
//     if (!data || data.length === 0) return;
//     const interval = setInterval(() => {
//       const nextIndex = (currentIndex + 1) % data.length;
//       if (flatListRef.current) flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
//     }, 2500);
//     return () => clearInterval(interval);
//   }, [currentIndex, data]);

//   if (!data || data.length === 0) return null;

//   return (
//     <View style={styles.promoSliderContainer}>
//       <FlatList
//         ref={flatListRef} data={data} keyExtractor={(item) => item._id}
//         renderItem={({ item }) => (
//           // ✨ تطبيق الدالة الذكية على صور الإعلانات
//           <Image 
//             source={{ uri: getImageUrl(item.image) }} 
//             style={styles.promoSliderImage} 
//             defaultSource={{ uri: 'https://via.placeholder.com/400x200.png?text=No+Image' }}
//           />
//         )}
//         horizontal pagingEnabled showsHorizontalScrollIndicator={false}
//         onMomentumScrollEnd={(event) => { setCurrentIndex(Math.round(event.nativeEvent.contentOffset.x / (width - 10))); }}
//         contentContainerStyle={{ paddingHorizontal: 10 }}
//       />
//       <View style={styles.promoPagination}>
//         {data.map((_, index) => <View key={index} style={[styles.dot, { opacity: index === currentIndex ? 1 : 0.5 }]} />)}
//       </View>
//     </View>
//   );
// };

// // --- الشاشة الرئيسية ---
// export default function HomeScreen() {
//   const router = useRouter(); 

//   const [products, setProducts] = useState<ProductType[]>([]);
//   const [promotions, setPromotions] = useState<PromotionType[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<any>(null);
//   const [refreshing, setRefreshing] = useState(false);

//   const toggleWishlist = async (productId: string) => {
//     try {
//       await apiClient.post('/api/wishlist', { productId });
//       Alert.alert('نجاح', 'تم إضافة المنتج للمفضلة! ❤️');
//     } catch (error) {
//       Alert.alert('خطأ', 'حدث خطأ أثناء الإضافة للمفضلة');
//     }
//   };

//   const fetchData = async () => {
//     try {
//       const [productsResponse, promotionsResponse] = await Promise.all([ getProducts(), apiClient.get('/api/promotions') ]);
//       setProducts(productsResponse);
//       setPromotions(promotionsResponse.data);
//     } catch (err: any) { setError(err); } finally { setLoading(false); setRefreshing(false); }
//   };

//   useEffect(() => { fetchData(); }, []);
//   const onRefresh = () => { setRefreshing(true); fetchData(); };

//   const formatDataForAlternatingLayout = (data: ProductType[]) => {
//     const formattedData = [];
//     let i = 0;
//     while (i < data.length) {
//       const pair = [];
//       if (data[i]) pair.push(data[i]);
//       if (data[i + 1]) pair.push(data[i + 1]);
//       if (pair.length > 0) formattedData.push({ type: 'pair', items: pair, id: `pair_${i}` });
//       i += 2;
//       if (i < data.length) { formattedData.push({ type: 'full', items: [data[i]], id: `full_${i}` }); i += 1; }
//     }
//     return formattedData;
//   };

//   const AnimatedHeartBtn = ({ onPress }: { onPress: () => void }) => {
//     const scale = useRef(new Animated.Value(1)).current; 
//     const handlePress = (e: any) => {
//       e.stopPropagation(); 
//       Animated.sequence([
//         Animated.timing(scale, { toValue: 1.4, duration: 150, useNativeDriver: true }),
//         Animated.timing(scale, { toValue: 1, duration: 150, useNativeDriver: true })
//       ]).start(() => onPress());
//     };
//     return (
//       <TouchableOpacity onPress={handlePress}>
//         <Animated.View style={{ transform: [{ scale }] }}>
//           <Ionicons name="heart-outline" size={26} color="#D2691E" />
//         </Animated.View>
//       </TouchableOpacity>
//     );
//   };

//   if (loading) return <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#D2691E" /></View>;
//   if (error) return <View style={styles.errorContainer}><Text style={styles.errorText}>حدث خطأ في الاتصال.</Text></View>;

//   return (
//     <>
//       <Stack.Screen options={{ headerShown: true, header: () => <Header /> }} />
//       <View style={styles.container}>
//         <FlatList
//           ListHeaderComponent={<PromotionsSlider data={promotions} />}
//           data={formatDataForAlternatingLayout(products)}
//           keyExtractor={(item) => item.id}
//           numColumns={1}
//           contentContainerStyle={styles.list}
//           renderItem={({ item }) => {
//             if (item.type === 'pair') {
//               return (
//                 <View style={styles.rowContainer}>
//                   <View style={styles.halfWidth}><ProductItem item={item.items[0]} onToggleWishlist={toggleWishlist} /></View>
//                   {item.items[1] ? (
//                     <View style={styles.halfWidth}><ProductItem item={item.items[1]} onToggleWishlist={toggleWishlist} /></View>
//                   ) : <View style={styles.halfWidth} />}
//                 </View>
//               );
//             } 
//             else {
//               const fullItem = item.items[0];
//               return (
//               <TouchableOpacity style={styles.fullCard} onPress={() => router.push(`/product-details/${fullItem._id}`)} activeOpacity={0.9}>
                  
//                   {/* ✨ تطبيق الدالة الذكية على البطاقة العريضة */}
//                   <Image 
//                     source={{ uri: getImageUrl(fullItem.imageUrls) }} 
//                     style={styles.fullCardImage} 
//                     defaultSource={{ uri: 'https://via.placeholder.com/400x200.png?text=No+Image' }}
//                   />
                  
//                   <View style={styles.fullCardInfo}>
//                     <View style={styles.titleRow}>
//                       <Text style={styles.fullCardName} numberOfLines={1}>{fullItem.name}</Text>
//                       <AnimatedHeartBtn onPress={() => toggleWishlist(fullItem._id)} />
//                     </View>
//                     <Text style={styles.fullCardPrice}>{fullItem.price} ر.س</Text>
//                   </View>
//                 </TouchableOpacity>
//               );
//             }
//           }}
//           refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
//         />
//       </View>
//     </>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#F7F7F7' },
//   list: { paddingHorizontal: 15, paddingBottom: 30 },
//   loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   errorText: { color: 'red', textAlign: 'center' },

//   promoSliderContainer: { height: 180, marginBottom: 20, borderRadius: 15, overflow: 'hidden', backgroundColor: '#E8F5E9', marginTop: 10 },
//   promoSliderImage: { width: width - 30, height: '100%', resizeMode: 'cover', borderRadius: 15, backgroundColor: '#eee' },
//   promoPagination: { flexDirection: 'row', position: 'absolute', bottom: 10, alignSelf: 'center' },
//   dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff', marginHorizontal: 4, shadowColor: '#000', shadowOpacity: 0.5, shadowRadius: 2, elevation: 3 },

//   rowContainer: { flexDirection: 'row-reverse', justifyContent: 'space-between' },
//   halfWidth: { width: '48%' },

//   fullCard: { width: '100%', borderRadius: 16, overflow: 'hidden', marginBottom: 15, backgroundColor: '#fff', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3 },
//   fullCardImage: { width: '100%', height: 180, resizeMode: 'cover', backgroundColor: '#eee' },
//   fullCardInfo: { padding: 15 },
//   titleRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
//   fullCardName: { color: '#333', fontSize: 18, fontWeight: 'bold', textAlign: 'right', flex: 1, marginLeft: 10 },
//   fullCardPrice: { color: '#D2691E', fontSize: 16, fontWeight: 'bold', textAlign: 'right' },
// });


import { FlatList, StyleSheet, ActivityIndicator, View, Text, Dimensions, Image, TouchableOpacity, RefreshControl, Alert, Animated } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import apiClient from '@/libs/services/axiosClient';
import { getProducts } from '@/libs/services/productService';
import ProductItem from '@/components/ProductItem';
import { Stack, useRouter } from 'expo-router';
import Header from '@/components/Header';
import { Ionicons } from '@expo/vector-icons';

type ProductType = { _id: string; name: string; description: string; price: number; imageUrls: string[]; ingredients: string[]; size: string; category: string; };
type PromotionType = { _id: string; image: string; link?: string; };

const { width } = Dimensions.get('window');

const SERVER_URL = 'https://192.168.1.20:5000';

const getImageUrl = (source?: any) => {
  if (!source) return 'https://via.placeholder.com/400x200.png?text=No+Image';
  let url = '';
  
  if (typeof source === 'string') url = source;
  else if (Array.isArray(source) && source.length > 0) url = source[0];

  if (!url || typeof url !== 'string' || url.trim() === '') {
    return 'https://via.placeholder.com/400x200.png?text=No+Image';
  }
  
  url = url.replace(/\\/g, '/');

  if (url.startsWith('https://')) return url;
  
  const cleanPath = url.startsWith('/') ? url : `/${url}`;
  
  return `${SERVER_URL}${cleanPath}`;
};

// --- السلايدر الإعلاني ---
const PromotionsSlider = ({ data }: { data: PromotionType[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<PromotionType> | null>(null);

  useEffect(() => {
    if (!data || data.length === 0) return;
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % data.length;
      if (flatListRef.current) flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
    }, 2500);
    return () => clearInterval(interval);
  }, [currentIndex, data]);

  if (!data || data.length === 0) return null;

  return (
    <View style={styles.promoSliderContainer}>
      <FlatList
        ref={flatListRef} data={data} keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          // 🚨 التعديل هنا: تم إزالة defaultSource تماماً 
          <Image 
            source={{ uri: getImageUrl(item.image) }} 
            style={styles.promoSliderImage} 
          />
        )}
        horizontal pagingEnabled showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => { setCurrentIndex(Math.round(event.nativeEvent.contentOffset.x / (width - 10))); }}
        contentContainerStyle={{ paddingHorizontal: 10 }}
      />
      <View style={styles.promoPagination}>
        {data.map((_, index) => <View key={index} style={[styles.dot, { opacity: index === currentIndex ? 1 : 0.5 }]} />)}
      </View>
    </View>
  );
};

// --- الشاشة الرئيسية ---
export default function HomeScreen() {
  const router = useRouter(); 

  const [products, setProducts] = useState<ProductType[]>([]);
  const [promotions, setPromotions] = useState<PromotionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  const toggleWishlist = async (productId: string) => {
    try {
      await apiClient.post('/api/wishlist', { productId });
      Alert.alert('نجاح', 'تم إضافة المنتج للمفضلة! ❤️');
    } catch (error) {
      Alert.alert('خطأ', 'حدث خطأ أثناء الإضافة للمفضلة');
    }
  };

  const fetchData = async () => {
    try {
      const [productsResponse, promotionsResponse] = await Promise.all([ getProducts(), apiClient.get('/api/promotions') ]);
      setProducts(productsResponse);
      setPromotions(promotionsResponse.data);
    } catch (err: any) { setError(err); } finally { setLoading(false); setRefreshing(false); }
  };

  useEffect(() => { fetchData(); }, []);
  const onRefresh = () => { setRefreshing(true); fetchData(); };

  const formatDataForAlternatingLayout = (data: ProductType[]) => {
    const formattedData = [];
    let i = 0;
    while (i < data.length) {
      const pair = [];
      if (data[i]) pair.push(data[i]);
      if (data[i + 1]) pair.push(data[i + 1]);
      if (pair.length > 0) formattedData.push({ type: 'pair', items: pair, id: `pair_${i}` });
      i += 2;
      if (i < data.length) { formattedData.push({ type: 'full', items: [data[i]], id: `full_${i}` }); i += 1; }
    }
    return formattedData;
  };

  const AnimatedHeartBtn = ({ onPress }: { onPress: () => void }) => {
    const scale = useRef(new Animated.Value(1)).current; 
    const handlePress = (e: any) => {
      e.stopPropagation(); 
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.4, duration: 150, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 150, useNativeDriver: true })
      ]).start(() => onPress());
    };
    return (
      <TouchableOpacity onPress={handlePress}>
        <Animated.View style={{ transform: [{ scale }] }}>
          <Ionicons name="heart-outline" size={26} color="#D2691E" />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  if (loading) return <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#D2691E" /></View>;
  if (error) return <View style={styles.errorContainer}><Text style={styles.errorText}>حدث خطأ في الاتصال.</Text></View>;

  return (
    <>
      <Stack.Screen options={{ headerShown: true, header: () => <Header /> }} />
      <View style={styles.container}>
        <FlatList
          ListHeaderComponent={<PromotionsSlider data={promotions} />}
          data={formatDataForAlternatingLayout(products)}
          keyExtractor={(item) => item.id}
          numColumns={1}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            if (item.type === 'pair') {
              return (
                <View style={styles.rowContainer}>
                  <View style={styles.halfWidth}><ProductItem item={item.items[0]} onToggleWishlist={toggleWishlist} /></View>
                  {item.items[1] ? (
                    <View style={styles.halfWidth}><ProductItem item={item.items[1]} onToggleWishlist={toggleWishlist} /></View>
                  ) : <View style={styles.halfWidth} />}
                </View>
              );
            } 
            else {
              const fullItem = item.items[0];
              return (
              <TouchableOpacity style={styles.fullCard} onPress={() => router.push(`/product-details/${fullItem._id}`)} activeOpacity={0.9}>
                  
                  {/* 🚨 التعديل هنا: تم إزالة defaultSource تماماً */}
                  <Image 
                    source={{ uri: getImageUrl(fullItem.imageUrls) }} 
                    style={styles.fullCardImage} 
                  />
                  
                  <View style={styles.fullCardInfo}>
                    <View style={styles.titleRow}>
                      <Text style={styles.fullCardName} numberOfLines={1}>{fullItem.name}</Text>
                      <AnimatedHeartBtn onPress={() => toggleWishlist(fullItem._id)} />
                    </View>
                    <Text style={styles.fullCardPrice}>{fullItem.price} ر.س</Text>
                  </View>
                </TouchableOpacity>
              );
            }
          }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F7F7' },
  list: { paddingHorizontal: 15, paddingBottom: 30 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: 'red', textAlign: 'center' },

  promoSliderContainer: { height: 180, marginBottom: 20, borderRadius: 15, overflow: 'hidden', backgroundColor: '#E8F5E9', marginTop: 10 },
  promoSliderImage: { width: width - 30, height: '100%', resizeMode: 'cover', borderRadius: 15, backgroundColor: '#eee' },
  promoPagination: { flexDirection: 'row', position: 'absolute', bottom: 10, alignSelf: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff', marginHorizontal: 4, shadowColor: '#000', shadowOpacity: 0.5, shadowRadius: 2, elevation: 3 },

  rowContainer: { flexDirection: 'row-reverse', justifyContent: 'space-between' },
  halfWidth: { width: '48%' },

  fullCard: { width: '100%', borderRadius: 16, overflow: 'hidden', marginBottom: 15, backgroundColor: '#fff', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3 },
  fullCardImage: { width: '100%', height: 180, resizeMode: 'cover', backgroundColor: '#eee' },
  fullCardInfo: { padding: 15 },
  titleRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  fullCardName: { color: '#333', fontSize: 18, fontWeight: 'bold', textAlign: 'right', flex: 1, marginLeft: 10 },
  fullCardPrice: { color: '#D2691E', fontSize: 16, fontWeight: 'bold', textAlign: 'right' },
});