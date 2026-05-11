// // 1. استيراد المكتبات الأساسية لـ React و React Native
// import React, { useRef } from 'react'; // useRef يُستخدم لحفظ حالة الأنيميشن
// import { View, Text, StyleSheet, Image, TouchableOpacity, Animated } from 'react-native'; // مكونات الواجهة الأساسية
// import { Ionicons } from '@expo/vector-icons'; // الأيقونات (أيقونة القلب)
// import { useRouter } from 'expo-router'; // أداة التنقل بين الصفحات

// // 2. المكون الرئيسي للبطاقة ويستقبل بيانات المنتج ودالة المفضلة
// const ProductItem = ({ item, onToggleWishlist }: any) => {
//   const router = useRouter(); // تفعيل أداة التنقل
  
//   // 3. تجهيز متغير الأنيميشن (يبدأ بحجم 1 وهو الحجم الطبيعي)
//   const scaleValue = useRef(new Animated.Value(1)).current;

//   // 4. دالة تشغيل الأنيميشن عند الضغط على القلب
//   const handleHeartPress = (e: any) => {
//     e.stopPropagation(); // 🚨 مهم جداً: يمنع فتح صفحة تفاصيل المنتج عند الضغط على القلب فقط
    
//     // تشغيل الأنيميشن: يكبر الزر إلى 1.4 ثم يعود إلى 1 بسرعة (تأثير النبض)
//     Animated.sequence([
//       Animated.timing(scaleValue, { toValue: 1.4, duration: 150, useNativeDriver: true }),
//       Animated.timing(scaleValue, { toValue: 1, duration: 150, useNativeDriver: true })
//     ]).start(() => {
//       // بعد انتهاء "النبضة"، قم باستدعاء دالة إضافة المنتج للمفضلة
//       if(onToggleWishlist) onToggleWishlist(item._id);
//     });
//   };

//   // 5. معالجة رابط الصورة (إذا لم توجد صورة يعرض صورة احتياطية)
//   const imageUrl = item.imageUrls?.[0] ? 
//     (item.imageUrls[0].startsWith('http') ? item.imageUrls[0] : `http://192.168.1.12:5000${item.imageUrls[0].startsWith('/') ? '' : '/'}${item.imageUrls[0]}`) 
//     : 'https://via.placeholder.com/150';

//   // 6. رسم البطاقة
//   return (
//     // زر يحيط بالبطاقة كاملة لكي تفتح تفاصيل المنتج عند الضغط عليها
//     // 🚨 هنا يمكنك تعديل المسار '/product/' ليتطابق مع مجلدك (مثلاً '/details/')
//     <TouchableOpacity 
//   style={styles.card} 
//   onPress={() => router.push(`/product-details/${item._id}`)} 
//   activeOpacity={0.9}
// >
//       {/* 7. صورة المنتج (أصبحت بدون قلب فوقها) */}
//       <Image source={{ uri: imageUrl }} style={styles.image} />
      
//       {/* 8. منطقة المعلومات (الاسم، السعر، والقلب) */}
//       <View style={styles.info}>
        
//         {/* صف يحتوي على اسم المنتج وزر القلب بجانبه */}
//         <View style={styles.titleRow}>
//           {/* اسم المنتج */}
//           <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
          
//           {/* زر القلب مع الأنيميشن */}
//           <TouchableOpacity onPress={handleHeartPress}>
//             <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
//               <Ionicons name="heart-outline" size={24} color="#D2691E" />
//             </Animated.View>
//           </TouchableOpacity>
//         </View>

//         {/* سعر المنتج تحت الاسم */}
//         <Text style={styles.price}>{item.price} ر.س</Text>
//       </View>
//     </TouchableOpacity>
//   );
// };

// export default ProductItem;

// // 9. التنسيقات (الأنماط)
// const styles = StyleSheet.create({
//   // تنسيق البطاقة الأساسية (خلفية بيضاء، حواف دائرية، ظل خفيف)
//   card: { backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, marginBottom: 15 },
//   // تنسيق الصورة
//   image: { width: '100%', height: 140, resizeMode: 'cover' },
//   // تنسيق منطقة المعلومات السفلية
//   info: { padding: 12 },
//   // ✨ تنسيق الصف الذي يجمع الاسم والقلب (row-reverse ليكون من اليمين لليسار)
//   titleRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
//   // تنسيق اسم المنتج (يأخذ المساحة المتبقية لكي لا يغطي على القلب)
//   name: { color: '#333', fontSize: 14, fontWeight: 'bold', textAlign: 'right', flex: 1, marginLeft: 10 },
//   // تنسيق السعر
//   price: { color: '#D2691E', fontSize: 15, fontWeight: 'bold', textAlign: 'right' },
// });

//ProductItem.tsx
import React, { useRef } from 'react'; 
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated } from 'react-native'; 
import { Ionicons } from '@expo/vector-icons'; 
import { useRouter } from 'expo-router'; 

const SERVER_URL = 'http://192.168.1.28:5000';

const getImageUrl = (source?: any) => {
  if (!source) return 'http://via.placeholder.com/400x200.png?text=No+Image';
  let url = '';
  
  if (typeof source === 'string') url = source;
  else if (Array.isArray(source) && source.length > 0) url = source[0];

  if (!url || typeof url !== 'string' || url.trim() === '') {
    return 'http://via.placeholder.com/400x200.png?text=No+Image';
  }
  
  url = url.replace(/\\/g, '/');

  // التحقق من البروتوكول لتجنب التكرار
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  
  const cleanPath = url.startsWith('/') ? url : `/${url}`;
  
  return `${SERVER_URL}${cleanPath}`;
};

const ProductItem = ({ item, onToggleWishlist }: any) => {
  const router = useRouter(); 
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handleHeartPress = (e: any) => {
    e.stopPropagation(); 
    Animated.sequence([
      Animated.timing(scaleValue, { toValue: 1.4, duration: 150, useNativeDriver: true }),
      Animated.timing(scaleValue, { toValue: 1, duration: 150, useNativeDriver: true })
    ]).start(() => {
      if(onToggleWishlist) onToggleWishlist(item._id);
    });
  };

  const productImg = getImageUrl(item.imageUrls || item.image);

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => router.push(`/product-details/${item._id}`)} 
      activeOpacity={0.9}
    >
      <Image 
        source={{ uri: productImg }} 
        style={styles.image} 
      />
      
      <View style={styles.info}>
        <View style={styles.titleRow}>
          <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
          <TouchableOpacity onPress={handleHeartPress}>
            <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
              <Ionicons name="heart-outline" size={24} color="#D2691E" />
            </Animated.View>
          </TouchableOpacity>
        </View>

        <Text style={styles.price}>{item.price} ر.س</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ProductItem;

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff',marginTop: 22, borderRadius: 26, overflow: 'hidden', elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, marginBottom: 15 },
  image: { width: '100%', height: 220,  resizeMode: 'cover', backgroundColor: '#eee' },
  info: { padding: 13 },
  titleRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 },
  name: { color: '#333', fontSize: 14, fontWeight: 'bold', textAlign: 'right', flex: 1, marginLeft: 10 },
  price: { color: '#D2691E', fontSize: 15, fontWeight: 'bold', textAlign: 'right' },
});