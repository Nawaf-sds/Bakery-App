

// // 1. استيراد المكونات الأساسية من React Native لبناء واجهة المستخدم (نصوص، أزرار، صور، مساحات تمرير، وتنبيهات Alert)
// import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, FlatList, Dimensions, TouchableOpacity, Alert } from 'react-native';
// // 2. استيراد أوامر React الأساسية: useState (لحفظ البيانات مؤقتاً)، useEffect (لتنفيذ الأوامر عند فتح الصفحة)، useRef (لحفظ مرجع للشاشة)
// import React, { useEffect, useState, useRef } from 'react';
// // 3. استيراد أدوات التنقل من Expo: useLocalSearchParams (لجلب البيانات من الرابط مثل الـ id)، Stack (للتحكم بالشريط العلوي)، useRouter (للانتقال بين الصفحات)
// import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
// // 4. استيراد أداة الاتصال بالسيرفر (Axios) التي برمجتها سابقاً
// import apiClient from '@/libs/services/axiosClient';
// // 5. استيراد مكتبة الأيقونات
// import { Ionicons } from '@expo/vector-icons';

// // 6. تعريف "شكل" البيانات التي نتوقع استلامها من السيرفر (TypeScript Type) لتجنب الأخطاء
// type ProductTypeWithImages = {
//   _id: string;
//   name: string;
//   price: number;
//   description: string;
//   imageUrls: string[];
//   ingredients: string[];
//   size: string;
//   category: string;
//   dailyStock?: number; // أضفناها للتحقق من الكمية المتوفرة
// };

// // 7. حساب عرض شاشة الجوال الحالي لاستخدامه في تكبير الصور لتملأ الشاشة
// const { width } = Dimensions.get('window');

// const ProductDetailsScreen = () => {
//   // 8. سحب رقم الـ id الخاص بالمنتج من الصفحة السابقة (التي ضغط عليها المستخدم)
//   const { id } = useLocalSearchParams<{ id: string }>();
//   // 9. تفعيل أداة الانتقال بين الصفحات
//   const router = useRouter();

//   // 10. إنشاء "حالات" (States) لحفظ المتغيرات التي تتغير في الشاشة:
//   const [product, setProduct] = useState<ProductTypeWithImages | null>(null); // حفظ بيانات المنتج
//   const [isLoading, setIsLoading] = useState(true); // حالة التحميل (دائرة التحميل للصفحة)
//   const [error, setError] = useState<string | null>(null); // حفظ أي خطأ يظهر
//   const [activeIndex, setActiveIndex] = useState(0); // حفظ رقم الصورة الحالية (لتحريك النقاط أسفل الصورة)
//   const [quantity, setQuantity] = useState(1); // حفظ الكمية التي اختارها العميل (تبدأ بـ 1)
  
//   // 💡 [تعديل جديد]: حالة مسؤولة عن تتبع عملية إضافة المنتج للسلة (لكي نظهر دائرة تحميل على الزر نفسه)
//   const [isAddingToCart, setIsAddingToCart] = useState(false);

//   // 11. إعدادات لمعرفة أي صورة تظهر حالياً على الشاشة بنسبة 50% أو أكثر
//   const viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 };
  
//   // 12. دالة تتنفذ عندما يمرر المستخدم الصور بأصبعه، وظيفتها تحديث رقم الصورة الحالية (activeIndex)
//   const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
//     if (viewableItems.length > 0) setActiveIndex(viewableItems[0].index);
//   }).current;

//   // 13. دالة useEffect: تعمل مرة واحدة فقط بمجرد فتح الشاشة لجلب بيانات المنتج من السيرفر
//   useEffect(() => {
//     const fetchProductDetails = async () => {
//       try {
//         // الاتصال بالسيرفر وجلب المنتج بناءً على الـ id
//         const response = await apiClient.get(`/api/products/${id}`);
//         setProduct(response.data); // حفظ البيانات المستلمة في الـ State
//       } catch (err: any) {
//         setError(err.message || 'فشل في جلب تفاصيل المنتج'); // حفظ الخطأ إن وُجد
//       } finally {
//         setIsLoading(false); // إيقاف دائرة التحميل سواء نجحنا أو فشلنا
//       }
//     };

//     if (id) fetchProductDetails(); // تنفيذ الدالة فقط إذا كان الـ id موجوداً
//   }, [id]); // [id] تعني: أعد تنفيذ الدالة إذا تغير الـ id

//   // 14. دالة ذكية لإصلاح روابط الصور (إذا كانت محلية تدمجها مع الـ IP، وإذا كانت سحابية تتركها)
//   const getImageUrl = (url?: string) => {
//     if (!url) return 'https://via.placeholder.com/400x400.png?text=No+Image'; // صورة افتراضية عند الخطأ
//     if (url.startsWith('http')) return url; // رابط سحابي سليم
//     return `http://192.168.1.12:5000${url.startsWith('/') ? url : `/${url}`}`; // دمج الرابط المحلي
//   };

//   // 15. دالة لزيادة الكمية (العداد +)
//   const increment = () => {
//     // تمنع العميل من طلب كمية أكبر من الموجودة في المخزون (dailyStock)
//     if (product?.dailyStock && quantity >= product.dailyStock) return;
//     setQuantity(prev => prev + 1); // إضافة 1 للرقم الحالي
//   };

//   // 16. دالة لإنقاص الكمية (العداد -)
//   const decrement = () => {
//     // تمنع النزول تحت الرقم 1 (لا يوجد طلب بصفر)
//     if (quantity > 1) setQuantity(prev => prev - 1);
//   };

//   // 17. حساب السعر الإجمالي: نضرب سعر المنتج بالكمية المختارة ونضع رقمين بعد الفاصلة (toFixed)
//   const totalPrice = product ? (product.price * quantity).toFixed(2) : 0;

//   // 💡 [تعديل جديد]: دالة إضافة المنتج إلى سلة المشتريات في السيرفر
//   const handleAddToCart = async () => {
//     if (!product) return; // حماية: إذا كانت الشاشة فارغة لا تفعل شيئاً

//     try {
//       setIsAddingToCart(true); // تشغيل حالة التحميل (الزر سيتحول لعلامة تحميل)
      
//       // إرسال طلب نوع POST إلى مسار السلة في السيرفر، ونرسل له رقم المنتج والكمية المطلوبة
//       await apiClient.post('http://192.168.1.12:5000/api/cart', {
//         productId: product._id,
//         quantity: quantity
//       });

//       // إذا نجح السيرفر في إضافة الطلب، نظهر رسالة نجاح جميلة للمستخدم
//       Alert.alert("🛒 رائع!", "تمت إضافة المنتج إلى سلتك بنجاح.", [
//         { text: "متابعة التسوق", style: "cancel" }, // زر لإغلاق الرسالة
//         { text: "الذهاب للسلة", onPress: () => router.push('/cart') } // زر ينقل المستخدم لشاشة السلة
//       ]);

//     } catch (err: any) {
//       console.error(err);
//       // إذا فشل الاتصال، نظهر رسالة خطأ
//       Alert.alert("❌ عذراً", "حدث خطأ أثناء إضافة المنتج للسلة، يرجى المحاولة مرة أخرى.");
//     } finally {
//       setIsAddingToCart(false); // إيقاف دائرة التحميل للزر سواء نجحنا أو فشلنا
//     }
//   };

//   // 18. إذا كانت الشاشة تحمل البيانات، نعرض دائرة التحميل ونوقف قراءة باقي الكود مؤقتاً
//   if (isLoading) {
//     return (
//       <View style={styles.centered}>
//         <ActivityIndicator size="large" color="#D2691E" />
//       </View>
//     );
//   }

//   // 19. إذا حدث خطأ أو لم نجد المنتج، نعرض رسالة الخطأ
//   if (error || !product) {
//     return (
//       <View style={styles.centered}>
//         <Text style={styles.errorText}>{error}</Text>
//       </View>
//     );
//   }

//   // 20. التأكد من وجود مصفوفة صور، وإن لم توجد نضع مصفوفة فارغة لكي لا يتعطل التطبيق
//   const images = product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls : [''];

//   return (
//     <View style={styles.container}>
//       {/* 21. تخصيص الشريط العلوي للشاشة (إخفاء العنوان، جعله شفافاً، وضع زر الرجوع وزر المفضلة) */}
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
//             <TouchableOpacity style={styles.headerButton}>
//               <Ionicons name="heart-outline" size={24} color="#333" />
//             </TouchableOpacity>
//           ),
//         }}
//       />
      
//       {/* 22. مساحة التمرير (لكي يتمكن المستخدم من النزول للأسفل لقراءة الوصف) */}
//       <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        
//         {/* 23. قسم عرض معرض الصور (FlatList للتمرير الأفقي بين الصور) */}
//         <View>
//           <FlatList
//             data={images} // البيانات هي مصفوفة الصور
//             keyExtractor={(item, index) => index.toString()} // إعطاء مفتاح فريد لكل صورة
//             renderItem={({ item }) => (
//               <Image source={{ uri: getImageUrl(item) }} style={styles.image} /> // رسم الصورة على الشاشة
//             )}
//             horizontal // جعل التمرير أفقياً وليس عمودياً
//             pagingEnabled // السماح بالانتقال صورة بصورة كاملة (نظام الصفحات)
//             showsHorizontalScrollIndicator={false} // إخفاء خط التمرير السفلي
//             onViewableItemsChanged={onViewableItemsChanged} // تتبع الصورة الحالية
//             viewabilityConfig={viewabilityConfig}
//           />
//           {/* 24. نقاط المؤشر أسفل الصورة (تُلون بالبرتقالي للصورة النشطة) */}
//           <View style={styles.pagination}>
//             {images.length > 1 && images.map((_, index) => (
//               <View
//                 key={index}
//                 style={[styles.dot, { backgroundColor: index === activeIndex ? '#D2691E' : '#FFF' }]}
//               />
//             ))}
//           </View>
//         </View>

//         {/* 25. الحاوية البيضاء التي تضم اسم المنتج وسعره وتفاصيله (صممت لترتفع فوق الصورة قليلاً) */}
//         <View style={styles.detailsContainer}>
          
//           {/* 26. سطر العنوان والسعر */}
//           <View style={styles.titleRow}>
//             <Text style={styles.name}>{product.name}</Text>
//             <Text style={styles.price}>{product.price} ر.س</Text>
//           </View>

//           {/* 27. سطر التصنيفات (الفئة والحجم) */}
//           <View style={styles.badgesRow}>
//             <View style={styles.badge}><Text style={styles.badgeText}>{product.category}</Text></View>
//             <View style={styles.badge}><Text style={styles.badgeText}>الحجم: {product.size}</Text></View>
//           </View>

//           {/* 28. قسم الوصف */}
//           <Text style={styles.sectionTitle}>الوصف</Text>
//           <Text style={styles.description}>
//             {product.description || 'لا يوجد وصف متاح لهذا المنتج.'}
//           </Text>

//           {/* 29. قسم المكونات (يظهر فقط إذا كان هناك مكونات مسجلة) */}
//           {product.ingredients && product.ingredients.length > 0 && (
//             <>
//               <Text style={styles.sectionTitle}>المكونات</Text>
//               <Text style={styles.description}>{product.ingredients.join('، ')}</Text>
//             </>
//           )}
//         </View>
//       </ScrollView>

//       {/* 30. الفوتر الثابت أسفل الشاشة (يحتوي على العداد وزر الإضافة للسلة) */}
//       <View style={styles.footer}>
        
//         {/* 31. أزرار التحكم بالكمية (+ و -) */}
//         <View style={styles.counterContainer}>
//           <TouchableOpacity onPress={decrement} style={styles.counterBtn}>
//             <Ionicons name="remove" size={24} color="#333" />
//           </TouchableOpacity>
//           <Text style={styles.counterText}>{quantity}</Text>
//           <TouchableOpacity onPress={increment} style={styles.counterBtn}>
//             <Ionicons name="add" size={24} color="#333" />
//           </TouchableOpacity>
//         </View>

//         {/* 💡 [تعديل جديد]: 32. زر الإضافة للسلة (تغير ليدعم حالة التحميل والدالة الجديدة) */}
//         <TouchableOpacity 
//           style={[styles.addToCartButton, isAddingToCart && { opacity: 0.7 }]} // بهتان لون الزر قليلاً أثناء إرسال الطلب
//           onPress={handleAddToCart} // تنفيذ دالة الإضافة التي برمجناها في الأعلى عند الضغط
//           disabled={isAddingToCart} // إيقاف الزر إذا كان قيد التحميل لمنع الضغط المزدوج
//         >
//           {isAddingToCart ? (
//             // إذا كانت isAddingToCart = true، نعرض دائرة تحميل بيضاء صغيرة بدلاً من النص
//             <ActivityIndicator color="#fff" />
//           ) : (
//             // إذا كان false، نعرض النص الطبيعي مع السعر
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

// // 33. التنسيقات (CSS الخاصة بـ React Native لتجميل العناصر)
// const styles = StyleSheet.create({
//   centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   container: { flex: 1, backgroundColor: '#fff' },
//   headerButton: {
//     backgroundColor: 'rgba(255,255,255,0.9)', // لون أبيض نصف شفاف
//     padding: 8,
//     borderRadius: 20,
//     marginHorizontal: 10,
//     marginTop: 10,
//     shadowColor: '#000', // إضافة ظل للزر
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.2,
//     shadowRadius: 1.41,
//     elevation: 2,
//   },
//   image: {
//     width: width, // عرض الصورة يساوي عرض الشاشة
//     height: 400,
//     resizeMode: 'cover', // قص أطراف الصورة لتعبئة المساحة بالكامل
//   },
//   pagination: {
//     flexDirection: 'row', // وضع النقاط بجانب بعضها
//     position: 'absolute', // جعل النقاط تطفو فوق الصورة
//     bottom: 50,
//     alignSelf: 'center',
//   },
//   dot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     marginHorizontal: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.5,
//     shadowRadius: 1,
//   },
//   detailsContainer: {
//     paddingHorizontal: 20,
//     paddingTop: 25,
//     backgroundColor: '#fff',
//     marginTop: -30, // رفع الحاوية البيضاء لتغطي الجزء السفلي من الصورة (تأثير بصري جميل)
//     borderTopLeftRadius: 30, // تدوير الزوايا العلوية
//     borderTopRightRadius: 30,
//     minHeight: 400,
//   },
//   titleRow: {
//     flexDirection: 'row-reverse', // جعل ترتيب العناصر من اليمين لليسار (عربي)
//     justifyContent: 'space-between', // وضع مسافة قصوى بين الاسم والسعر
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   name: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#333',
//     flex: 1,
//     textAlign: 'right', // محاذاة النص لليمين
//   },
//   price: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#D2691E',
//   },
//   badgesRow: {
//     flexDirection: 'row-reverse',
//     marginBottom: 20,
//   },
//   badge: {
//     backgroundColor: '#f5f5f5',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 15, // زر دائري الحواف
//     marginLeft: 10,
//   },
//   badgeText: {
//     color: '#666',
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     textAlign: 'right',
//     marginTop: 10,
//     marginBottom: 8,
//     color: '#333',
//   },
//   description: {
//     fontSize: 15,
//     lineHeight: 24, // المسافة بين الأسطر لسهولة القراءة
//     color: '#666',
//     textAlign: 'right',
//   },
//   footer: {
//     position: 'absolute', // تثبيت الفوتر في أسفل الشاشة دائماً
//     bottom: 0,
//     left: 0,
//     right: 0,
//     padding: 15,
//     backgroundColor: '#fff',
//     borderTopWidth: 1,
//     borderTopColor: '#f0f0f0',
//     flexDirection: 'row-reverse', // العداد يسار والسلة يمين
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingBottom: 25, // لإعطاء مساحة في شاشات الآيفون التي لا تحتوي على أزرار سفلية
//   },
//   counterContainer: {
//     flexDirection: 'row-reverse',
//     alignItems: 'center',
//     backgroundColor: '#f5f5f5',
//     borderRadius: 25,
//     paddingHorizontal: 5,
//     paddingVertical: 5,
//     marginRight: 10,
//   },
//   counterBtn: {
//     backgroundColor: '#fff',
//     padding: 8,
//     borderRadius: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 1,
//     elevation: 2,
//   },
//   counterText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginHorizontal: 15,
//     color: '#333',
//   },
//   addToCartButton: {
//     backgroundColor: '#D2691E',
//     flex: 1, // تمدد الزر ليأخذ المساحة المتبقية
//     flexDirection: 'row-reverse',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 15,
//     paddingHorizontal: 20,
//     borderRadius: 25,
//   },
//   addToCartButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   totalPriceBadge: {
//     backgroundColor: 'rgba(255,255,255,0.2)', // خلفية بيضاء شفافة للسعر
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 10,
//   },
//   totalPriceText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   errorText: { color: 'red', fontSize: 16 },
// });




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
  
  // ✨ متغير لحركة نبض القلب
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
  if (!source) return 'https://via.placeholder.com/400x200.png?text=No+Image';
  let url = '';
  
  if (typeof source === 'string') url = source;
  else if (Array.isArray(source) && source.length > 0) url = source[0];

  if (!url || typeof url !== 'string' || url.trim() === '') {
    return 'https://via.placeholder.com/400x200.png?text=No+Image';
  }
  
  // 🚨 السطر السحري الجديد: تحويل مسارات ويندوز إلى مسارات إنترنت صحيحة
  url = url.replace(/\\/g, '/');

  if (url.startsWith('http')) return url;
  
  const SERVER_URL = 'http://192.168.1.20:5000';
  const cleanPath = url.startsWith('/') ? url : `/${url}`;
  
  // طباعة الرابط النهائي في الكونسول لنتأكد أنه سليم 100%
  console.log("Final Image URL:", `${SERVER_URL}${cleanPath}`);
  
  return `${SERVER_URL}${cleanPath}`;
};

  const increment = () => {
    if (product?.dailyStock && quantity >= product.dailyStock) return;
    setQuantity(prev => prev + 1);
  };

  const decrement = () => { if (quantity > 1) setQuantity(prev => prev - 1); };

  const totalPrice = product ? (product.price * quantity).toFixed(2) : 0;

  // -------------------------------------------------------------------
  // ✨ دالة إضافة المنتج للسلة
  // -------------------------------------------------------------------
  const handleAddToCart = async () => {
    if (!product) return;
    try {
      setIsAddingToCart(true);
      await apiClient.post('/api/cart', { productId: product._id, quantity: quantity });
      Alert.alert("🛒 رائع!", "تمت إضافة المنتج إلى سلتك بنجاح.", [
        { text: "متابعة التسوق", style: "cancel" },
        { text: "الذهاب للسلة", onPress: () => router.push('/cart') }
      ]);
    } catch (err: any) {
      console.error(err);
      Alert.alert("❌ عذراً", "حدث خطأ أثناء إضافة المنتج للسلة.");
    } finally {
      setIsAddingToCart(false);
    }
  };

  // -------------------------------------------------------------------
  // ✨ دالة إضافة المنتج للمفضلة (الجديدة)
  // -------------------------------------------------------------------
  const handleToggleWishlist = async () => {
    if (!product) return;
    
    // تشغيل أنيميشن النبض للقلب
    Animated.sequence([
      Animated.timing(heartScale, { toValue: 1.4, duration: 150, useNativeDriver: true }),
      Animated.timing(heartScale, { toValue: 1, duration: 150, useNativeDriver: true })
    ]).start();

    try {
      // إرسال الطلب للسيرفر
      await apiClient.post('/api/wishlist', { productId: product._id });
      Alert.alert('نجاح', 'تم إضافة المنتج للمفضلة! ❤️');
    } catch (error) {
      Alert.alert('خطأ', 'حدث خطأ أثناء الإضافة للمفضلة');
    }
  };

  if (isLoading) return <View style={styles.centered}><ActivityIndicator size="large" color="#D2691E" /></View>;
  if (error || !product) return <View style={styles.centered}><Text style={styles.errorText}>{error}</Text></View>;

  const images = product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls : [''];

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: '',
          headerTransparent: true,
          headerBackTitleVisible: false,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            // ✨ تعديل زر القلب: أصبح قابلاً للضغط ويرتبط بدالة المفضلة والأنيميشن
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







