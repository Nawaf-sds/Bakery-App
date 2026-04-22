import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Share, Modal, Linking, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'expo-router';
import * as StoreReview from 'expo-store-review';

// مكون سطر القائمة (آمن تماماً من الأخطاء)
const ProfileListItem = ({ icon, text, secondaryText, onPress, hasChevron = true, isDestructive = false }: any) => (
  <TouchableOpacity style={styles.listItem} onPress={onPress}>
    <View style={styles.listItemContent}>
      <View style={[styles.iconContainer, isDestructive ? { backgroundColor: '#FFEBEE' } : null]}>
        <Ionicons name={icon} size={22} color={isDestructive ? '#e74c3c' : '#D2691E'} />
      </View>
      <Text style={[styles.listItemText, isDestructive ? { color: '#e74c3c' } : null]}>{text}</Text>
    </View>
    <View style={styles.listItemContent}>
      {secondaryText ? <Text style={styles.secondaryText}>{secondaryText}</Text> : null}
      {hasChevron ? <Ionicons name="chevron-back-outline" size={20} color="#ccc" /> : null}
    </View>
  </TouchableOpacity>
);

const ProfileScreen = () => {
  const { signOut, session } = useAuth();
  const router = useRouter();

  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [contactModalVisible, setContactModalVisible] = useState(false);

  const handleRateApp = async () => {
    const isAvailable = await StoreReview.isAvailableAsync();
    if (isAvailable) {
      StoreReview.requestReview();
    } else {
      Alert.alert('تنبيه', 'خاصية التقييم غير متاحة على هذا المحاكي أو الجهاز.');
    }
  };

  const openDialer = () => { Linking.openURL('tel:+0565315920'); setContactModalVisible(false); };
  const openEmail = () => { Linking.openURL('mailto:nwaf.o.th@gmail.com'); setContactModalVisible(false); };

  const handleShareApp = async () => {
    try {
      await Share.share({ message: 'اكتشف ألذ المخبوزات على تطبيقنا! حمله الآن 🍪' });
    } catch (error) {
      console.error('فشل في مشاركة التطبيق');
    }
  };

  const handleEditProfile = () => {
    Alert.alert('قريباً', 'صفحة تعديل البيانات قيد البرمجة 🛠️');
  };

  const handleChangeLanguage = () => {
    Alert.alert('تغيير اللغة', 'التطبيق حالياً يدعم اللغة العربية فقط 🇸🇦');
  };

  if (!session) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#D2691E" />
      </View>
    );
  }

  const defaultAvatar = `https://ui-avatars.com/api/?name=${session?.user?.name || 'م'}&background=FFF3E0&color=D2691E&bold=true`;
  const userAvatar = session?.user?.avatar ? session.user.avatar : defaultAvatar;

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>حسابي</Text>
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        <View style={styles.userInfoCard}>
          <Image source={{ uri: userAvatar }} style={styles.avatar} />
          <View style={styles.userInfoText}>
            <Text style={styles.userName}>{session?.user?.name || 'مستخدم'}</Text>
            <Text style={styles.userEmail}>{session?.user?.email || 'لا يوجد بريد'}</Text>
          </View>
          <TouchableOpacity style={styles.editBtn} onPress={handleEditProfile}>
            <Ionicons name="create-outline" size={20} color="#D2691E" />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>التسوق</Text>
        <View style={styles.cardGroup}>
          {/* ✨ التعديل الأول: تغيير المسار ليتطابق مع مجلد profile */}
          <ProfileListItem icon="heart-outline" text="المفضلة" onPress={() => router.push('/profile/wishlist')} />
          <View style={styles.divider} />
          <ProfileListItem icon="star-outline" text="تقييماتي للمنتجات" onPress={() => router.push('/profile/reviews')} />
        </View>

        <Text style={styles.sectionTitle}>الإعدادات والمساعدة</Text>
        <View style={styles.cardGroup}>
          <ProfileListItem icon="language-outline" text="لغة التطبيق" secondaryText="العربية" onPress={handleChangeLanguage} />
          <View style={styles.divider} />
          <ProfileListItem icon="call-outline" text="تواصل معنا" onPress={() => setContactModalVisible(true)} />
          <View style={styles.divider} />
          <ProfileListItem icon="document-text-outline" text="الصفحات التعريفية" onPress={() => setInfoModalVisible(true)} />
        </View>

        <Text style={styles.sectionTitle}>عن التطبيق</Text>
        <View style={styles.cardGroup}>
          <ProfileListItem icon="share-social-outline" text="مشاركة التطبيق مع الأصدقاء" hasChevron={false} onPress={handleShareApp} />
          <View style={styles.divider} />
          <ProfileListItem icon="star-half-outline" text="قيم تجربتك للتطبيق" hasChevron={false} onPress={handleRateApp} />
        </View>

        <View style={[styles.cardGroup, { marginTop: 15 }]}>
            <ProfileListItem icon="log-out-outline" text="تسجيل الخروج" hasChevron={false} isDestructive={true} onPress={signOut} />
        </View>

      </ScrollView>

      <Modal animationType="slide" transparent={true} visible={contactModalVisible} onRequestClose={() => setContactModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>كيف يمكننا مساعدتك؟</Text>
            
            <TouchableOpacity style={styles.modalOptionBtn} onPress={openDialer}>
              <View style={styles.modalIconBg}><Ionicons name="call" size={24} color="#D2691E" /></View>
              <Text style={styles.modalOptionText}>الاتصال الهاتفي</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalOptionBtn} onPress={openEmail}>
              <View style={styles.modalIconBg}><Ionicons name="mail" size={24} color="#D2691E" /></View>
              <Text style={styles.modalOptionText}>إرسال بريد إلكتروني</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelBtn} onPress={() => setContactModalVisible(false)}>
              <Text style={styles.cancelBtnText}>إلغاء</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal animationType="slide" transparent={true} visible={infoModalVisible} onRequestClose={() => setInfoModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>الصفحات التعريفية</Text>
            
            {/* ✨ التعديل الثاني: تعديل اسم الملف ليطابق about-us.tsx الموجود داخل مجلد profile */}
            <TouchableOpacity style={styles.modalOptionBtn} onPress={() => { setInfoModalVisible(false); router.push('/profile/about-us'); }}>
              <Text style={styles.modalOptionText}>من نحن</Text>
              <Ionicons name="chevron-back" size={20} color="#ccc" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalOptionBtn} onPress={() => { setInfoModalVisible(false); Alert.alert('قريباً', 'سياسة الخصوصية'); }}>
              <Text style={styles.modalOptionText}>سياسة الخصوصية</Text>
              <Ionicons name="chevron-back" size={20} color="#ccc" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelBtn} onPress={() => setInfoModalVisible(false)}>
              <Text style={styles.cancelBtnText}>إغلاق</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9f9f9' },
  container: { flex: 1, backgroundColor: '#f5f7fa' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginTop: 55, marginBottom: 15, color: '#333' },
  
  userInfoCard: { flexDirection: 'row-reverse', alignItems: 'center', backgroundColor: '#fff', padding: 20, marginHorizontal: 20, marginBottom: 10, borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  avatar: { width: 65, height: 65, borderRadius: 35, borderWidth: 2, borderColor: '#f0f0f0' },
  userInfoText: { flex: 1, marginRight: 15, alignItems: 'flex-end' },
  userName: { fontSize: 19, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  userEmail: { fontSize: 14, color: '#888' },
  editBtn: { backgroundColor: '#FFF3E0', padding: 10, borderRadius: 12 },

  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#888', textAlign: 'right', marginHorizontal: 25, marginTop: 25, marginBottom: 10 },
  cardGroup: { backgroundColor: '#fff', borderRadius: 20, marginHorizontal: 20, paddingHorizontal: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 2 },
  
  listItem: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 15 },
  listItemContent: { flexDirection: 'row-reverse', alignItems: 'center' },
  iconContainer: { width: 38, height: 38, borderRadius: 10, backgroundColor: '#FFF3E0', justifyContent: 'center', alignItems: 'center', marginLeft: 15 },
  listItemText: { fontSize: 16, color: '#333', fontWeight: '500' },
  secondaryText: { fontSize: 14, color: '#888', marginRight: 10 },
  divider: { height: 1, backgroundColor: '#f0f0f0', marginLeft: 65, marginRight: 15 }, 

  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
  modalContent: { backgroundColor: '#fff', padding: 25, borderTopLeftRadius: 30, borderTopRightRadius: 30, alignItems: 'center' },
  modalHandle: { width: 40, height: 5, backgroundColor: '#ddd', borderRadius: 10, marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 25 },
  modalOptionBtn: { flexDirection: 'row-reverse', alignItems: 'center', backgroundColor: '#f9f9f9', padding: 15, borderRadius: 16, width: '100%', marginBottom: 12 },
  modalIconBg: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFF3E0', justifyContent: 'center', alignItems: 'center', marginLeft: 15 },
  modalOptionText: { flex: 1, textAlign: 'right', fontSize: 16, fontWeight: '500', color: '#333' },
  cancelBtn: { marginTop: 15, padding: 15, width: '100%', alignItems: 'center', backgroundColor: '#f0f0f0', borderRadius: 16 },
  cancelBtnText: { fontSize: 16, fontWeight: 'bold', color: '#666' }
});