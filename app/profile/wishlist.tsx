// 1. استيراد المكتبات اللازمة للواجهة والاتصال بالسيرفر والتنقل
import React, { useState, useEffect } from 'react'; 
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // للأيقونات
import { Stack, useRouter } from 'expo-router'; // للتنقل وتعديل شريط العناوين
import apiClient from '@/libs/services/axiosClient'; // أداة الاتصال بالسيرفر الخاصة بك

const WishlistScreen = () => {
  const router = useRouter(); // تفعيل أداة الانتقال بين الصفحات
  
  // 2. تعريف حالات الشاشة (البيانات، حالة التحميل)
  const [wishlistItems, setWishlistItems] = useState<any[]>([]); 
  const [isLoading, setIsLoading] = useState(true);

  // 3. دالة جلب البيانات مع "فلتر" لتنظيف المنتجات المحذوفة من قاعدة البيانات
  const fetchWishlist = async () => {
    try {
      // طلب قائمة المفضلة من السيرفر
      const { data } = await apiClient.get('/api/wishlist');
      // التأكد من استخراج البيانات سواء كانت داخل مصفوفة أو كائن
      const rawItems = data.products ? data.products : data; 

      // تحويل البيانات لتكون مصفوفة منتجات مباشرة
      let extractedProducts = rawItems.map((item: any) => {
        return item.productId || item.product || item;
      });

      // ✨ [حل مشكلة الوهمي]: تصفية المنتجات التي لا تملك بيانات حقيقية (اسم أو ID)
      extractedProducts = extractedProducts.filter((p: any) => p && p._id && p.name);

      setWishlistItems(extractedProducts); // حفظ المنتجات النظيفة فقط
    } catch (error) {
      console.error("خطأ في جلب المفضلة:", error);
    } finally {
      setIsLoading(false); // إيقاف دائرة التحميل
    }
  };

  // 4. تشغيل الجلب فور فتح الشاشة
  useEffect(() => {
    fetchWishlist();
  }, []);

  // 5. دالة الحذف النهائي من السيرفر (استخدام DELETE)
  const handleRemoveItem = async (productId: string) => {
    try {
      // إرسال طلب حذف حقيقي للسيرفر باستخدام معرف المنتج
      await apiClient.delete(`/api/wishlist/${productId}`);
      
      // تحديث الحالة في الواجهة فوراً ليختفي المنتج أمام المستخدم
      setWishlistItems(prev => prev.filter(item => item._id !== productId));
    } catch (error) {
      // إذا فشل السيرفر نظهر تنبيه
      Alert.alert('خطأ', 'لم نتمكن من إزالة المنتج من السيرفر');
    }
  };

  // 6. دالة إضافة المنتج للسلة مباشرة من هنا
  const handleAddToCart = async (productId: string) => {
    try {
      await apiClient.post('/api/cart', { productId, quantity: 1 });
      Alert.alert('🛒 رائع!', 'تمت إضافة المخبوزات إلى سلتك.', [
        { text: 'متابعة', style: 'cancel' },
        { text: 'الذهاب للسلة', onPress: () => router.push('/cart') }
      ]);
    } catch (error) {
      Alert.alert('خطأ', 'حدثت مشكلة أثناء الإضافة للسلة');
    }
  };

  // 7. دالة معالجة رابط الصورة لضمان ظهورها دوماً
  const getImageUrl = (product: any) => {
    let url = product.imageUrls?.[0] || product.image; 
    if (!url) return 'https://via.placeholder.com/150x150.png?text=No+Image';
    if (url.startsWith('http')) return url;
    return `http://192.168.1.12:5000${url.startsWith('/') ? url : `/${url}`}`;
  };

  // 8. واجهة التحميل (ActivityIndicator)
  if (isLoading) {
    return <View style={styles.centered}><ActivityIndicator size="large" color="#D2691E" /></View>;
  }

  // 9. واجهة "المفضلة فارغة"
  if (wishlistItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Stack.Screen options={{ headerTitle: 'المفضلة', headerBackTitleVisible: false }} />
        <View style={styles.emptyIconCircle}>
          <Ionicons name="heart-half-outline" size={60} color="#D2691E" />
        </View>
        <Text style={styles.emptyTitle}>مفضلتك فارغة!</Text>
        <TouchableOpacity style={styles.shopNowBtn} onPress={() => router.push('/(tabs)')}>
          <Text style={styles.shopNowText}>تصفح المنيو</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 10. رسم الشاشة الرئيسية للمفضلة مع القائمة (FlatList)
  return (
    <View style={styles.container}>
      {/* تخصيص عنوان الهيدر في Expo Router */}
      <Stack.Screen options={{ headerTitle: 'مفضلتي', headerBackTitleVisible: false }} />
      
      <FlatList
        data={wishlistItems}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          // بطاقة المنتج: عند الضغط عليها تفتح تفاصيل المنتج
          <TouchableOpacity 
            style={styles.card} 
            activeOpacity={0.9}
            onPress={() => router.push(`/product-details/${item._id}`)} 
          >
            <Image source={{ uri: getImageUrl(item) }} style={styles.itemImage} />
            <View style={styles.itemDetails}>
              <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.itemPrice}>{item.price} ر.س</Text>
            </View>
            {/* أزرار السلة والحذف */}
            <View style={styles.actionsContainer}>
              <TouchableOpacity style={styles.addToCartBtn} onPress={() => handleAddToCart(item._id)}>
                <Ionicons name="cart" size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteBtn} onPress={() => handleRemoveItem(item._id)}>
                <Ionicons name="trash-outline" size={20} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default WishlistScreen; // تصدير المكون لكي يعمل في Expo Router

// 11. التنسيقات (Styles)
const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F7F8FA' },
  container: { flex: 1, backgroundColor: '#F7F8FA' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 30 },
  emptyIconCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#FFF3E0', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  emptyTitle: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  shopNowBtn: { backgroundColor: '#D2691E', paddingHorizontal: 40, paddingVertical: 15, borderRadius: 30, marginTop: 20 },
  shopNowText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  listContainer: { padding: 15 },
  card: { flexDirection: 'row-reverse', backgroundColor: '#fff', borderRadius: 16, padding: 12, marginBottom: 15, elevation: 3, alignItems: 'center' },
  itemImage: { width: 80, height: 80, borderRadius: 12 },
  itemDetails: { flex: 1, marginHorizontal: 15 },
  itemName: { fontSize: 16, fontWeight: 'bold', color: '#333', textAlign: 'right' },
  itemPrice: { fontSize: 16, color: '#D2691E', fontWeight: 'bold', textAlign: 'right', marginTop: 5 },
  actionsContainer: { alignItems: 'center', justifyContent: 'space-between', height: 85 },
  addToCartBtn: { backgroundColor: '#D2691E', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  deleteBtn: { backgroundColor: '#FFEBEE', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }
});