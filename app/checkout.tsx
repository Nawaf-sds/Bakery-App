import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import apiClient from '@/libs/services/axiosClient';

const CheckoutScreen = () => {
  const router = useRouter();
  
  // حالات حفظ البيانات التي سيدخلها العميل
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('عند الاستلام'); // القيمة الافتراضية
  const [isSubmitting, setIsSubmitting] = useState(false);

  // خيارات الدفع المتاحة (يجب أن تتطابق مع الموديل في السيرفر)
  const paymentOptions = ['عند الاستلام', 'مدى', 'Apple Pay', 'بطاقة ائتمان'];

  // دالة إرسال الطلب للسيرفر
  const handlePlaceOrder = async () => {
    // 1. حماية: التأكد من إدخال العنوان
    if (!address.trim()) {
      Alert.alert('تنبيه', 'يرجى إدخال عنوان التوصيل أولاً.');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // 2. إرسال الطلب للسيرفر (السيرفر سيسحب المنتجات والسعر من السلة تلقائياً)
      const { data } = await apiClient.post('/api/orders', {
        shippingAddress: address,
        paymentMethod: paymentMethod
      });

      // 3. نجاح الطلب: إظهار رسالة شكر وتوجيه العميل للرئيسية
      Alert.alert('🎉 شكراً لك!', 'تم استلام طلبك بنجاح وجاري تجهيزه.', [
        { 
          text: 'العودة للرئيسية', 
          onPress: () => router.replace('/(tabs)') // توجيه للشاشة الرئيسية (بدون زر رجوع للخلف)
        }
      ]);

    } catch (error: any) {
      console.error(error);
      Alert.alert('خطأ', error.response?.data?.message || 'حدث خطأ أثناء إتمام الطلب، يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      <Text style={styles.title}>إتمام الطلب</Text>

      {/* قسم العنوان */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>عنوان التوصيل</Text>
        <TextInput
          style={styles.input}
          placeholder="مثال: الرياض، حي الملقا، شارع الأبراج..."
          value={address}
          onChangeText={setAddress}
          multiline
          textAlign="right"
        />
      </View>

      {/* قسم طريقة الدفع */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>طريقة الدفع</Text>
        {paymentOptions.map((option) => (
          <TouchableOpacity 
            key={option} 
            style={[styles.paymentOption, paymentMethod === option && styles.paymentOptionSelected]}
            onPress={() => setPaymentMethod(option)}
          >
            <Ionicons 
              name={paymentMethod === option ? "radio-button-on" : "radio-button-off"} 
              size={24} 
              color={paymentMethod === option ? "#D2691E" : "#ccc"} 
            />
            <Text style={[styles.paymentText, paymentMethod === option && styles.paymentTextSelected]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* زر تأكيد الطلب */}
      <TouchableOpacity 
        style={[styles.submitBtn, isSubmitting && { opacity: 0.7 }]} 
        onPress={handlePlaceOrder}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitBtnText}>تأكيد الطلب</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default CheckoutScreen;

// التنسيقات
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333', textAlign: 'center', marginTop: 40, marginBottom: 30 },
  section: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', textAlign: 'right', marginBottom: 15 },
  input: { backgroundColor: '#f5f5f5', borderRadius: 8, padding: 15, fontSize: 16, minHeight: 80, textAlignVertical: 'top' },
  paymentOption: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  paymentOptionSelected: { backgroundColor: '#fffaf0' },
  paymentText: { fontSize: 16, color: '#666', marginRight: 10 },
  paymentTextSelected: { color: '#D2691E', fontWeight: 'bold' },
  submitBtn: { backgroundColor: '#D2691E', padding: 18, borderRadius: 25, alignItems: 'center', marginTop: 20, marginBottom: 40 },
  submitBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});