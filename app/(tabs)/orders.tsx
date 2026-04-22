import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import apiClient from '@/libs/services/axiosClient';

// 1. تعريف شكل بيانات الطلب (مطابق لما يرسله السيرفر)
type Order = {
  _id: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  items: any[];
};

const OrdersScreen = () => {
  const router = useRouter();
  
  // حالات حفظ البيانات
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 2. دالة جلب الطلبات من السيرفر
  const fetchMyOrders = async () => {
    try {
      const { data } = await apiClient.get('/api/orders/myorders');
      
      // ترتيب الطلبات من الأحدث إلى الأقدم
      const sortedOrders = data.sort((a: Order, b: Order) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      setOrders(sortedOrders);
    } catch (error) {
      console.error("خطأ في جلب الطلبات:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // تشغيل دالة الجلب عند فتح الشاشة
  useEffect(() => {
    fetchMyOrders();
  }, []);

  // 3. دالة لتلوين حالة الطلب بشكل احترافي
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'قيد التجهيز': return '#FFA500'; // برتقالي
      case 'قيد التوصيل': return '#1E90FF'; // أزرق
      case 'مكتمل': return '#32CD32';       // أخضر
      case 'ملغي': return '#FF3B30';        // أحمر
      default: return '#666666';            // رمادي
    }
  };

  // 4. واجهة التحميل
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#D2691E" />
      </View>
    );
  }

  // 5. واجهة عدم وجود طلبات سابقة
  if (orders.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="receipt-outline" size={80} color="#ccc" />
        <Text style={styles.emptyText}>لم تقم بأي طلبات حتى الآن</Text>
        <TouchableOpacity style={styles.shopNowBtn} onPress={() => router.push('/(tabs)')}>
          <Text style={styles.shopNowText}>ابدأ التسوق</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 6. تصميم كرت الطلب الواحد
  const renderOrderCard = ({ item }: { item: Order }) => {
    // تنسيق التاريخ ليظهر بشكل جميل
    const orderDate = new Date(item.createdAt).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    return (
      <View style={styles.orderCard}>
        {/* رأس الكرت: رقم الطلب والتاريخ */}
        <View style={styles.cardHeader}>
          <Text style={styles.orderId}>طلب #{item._id.slice(-6).toUpperCase()}</Text>
          <Text style={styles.orderDate}>{orderDate}</Text>
        </View>

        {/* تفاصيل الطلب: السعر وعدد المنتجات */}
        <View style={styles.cardBody}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>عدد المنتجات:</Text>
            <Text style={styles.infoValue}>{item.items?.length || 0} منتجات</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>الإجمالي:</Text>
            <Text style={styles.totalPrice}>{item.totalPrice.toFixed(2)} ر.س</Text>
          </View>
        </View>

        {/* ذيل الكرت: حالة الطلب */}
        <View style={styles.cardFooter}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '15' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {item.status}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  // 7. الواجهة الرئيسية للشاشة
  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>طلباتي السابقة</Text>
      
      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        renderItem={renderOrderCard}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

// 🚨 هذا هو السطر الذي كان مفقوداً ويسبب المشكلة!
export default OrdersScreen;

// التنسيقات (متناسقة مع باقي التطبيق)
const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9f9f9' },
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginTop: 50, marginBottom: 20, color: '#333' },
  
  // تنسيقات الشاشة الفارغة
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9f9f9' },
  emptyText: { fontSize: 18, color: '#666', marginTop: 15, marginBottom: 25 },
  shopNowBtn: { backgroundColor: '#D2691E', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 25 },
  shopNowText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  
  // تنسيقات القائمة والكرت
  listContainer: { padding: 15, paddingBottom: 120 },
  orderCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 3 },
  
  cardHeader: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#f0f0f0', paddingBottom: 12, marginBottom: 12 },
  orderId: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  orderDate: { fontSize: 14, color: '#888' },
  
  cardBody: { marginBottom: 12 },
  infoRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  infoLabel: { fontSize: 15, color: '#666' },
  infoValue: { fontSize: 15, color: '#333', fontWeight: 'bold' },
  totalPrice: { fontSize: 18, color: '#D2691E', fontWeight: 'bold' },
  
  cardFooter: { flexDirection: 'row-reverse', justifyContent: 'flex-start' },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  statusText: { fontSize: 14, fontWeight: 'bold' }
});