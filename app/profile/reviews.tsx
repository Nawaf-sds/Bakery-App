
// import React, { useState, useEffect } from 'react';
// import { 
//   View, Text, StyleSheet, FlatList, Image, ActivityIndicator, 
//   TouchableOpacity, Modal, TextInput, Alert, Dimensions,
//   KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard 
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { Stack, useLocalSearchParams } from 'expo-router';
// import apiClient from '@/libs/services/axiosClient';

// const { width } = Dimensions.get('window');

// const MyReviewsScreen = () => {
//   const params = useLocalSearchParams();
//   const [reviews, setReviews] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   // حالات نافذة التقييم
//   const [modalVisible, setModalVisible] = useState(false);
//   const [rating, setRating] = useState(0);
//   const [comment, setComment] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // التحقق من صحة النموذج
//   const isFormValid = rating > 0 && comment.trim().length > 0;

//   // جلب التقييمات
//   const fetchReviews = async () => {
//     try {
//       const { data } = await apiClient.get('/api/reviews/myreviews');
//       setReviews(Array.isArray(data) ? data : (data.reviews || []));
//     } catch (error) {
//       console.error("خطأ جلب التقييمات:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchReviews();
//     if (params.productId) { setModalVisible(true); }
//   }, [params.productId]);

//   // معالجة الصور
//   const getImageUrl = (url?: any) => {
//     if (!url || url === "") return 'https://via.placeholder.com/150';
//     if (Array.isArray(url)) url = url[0];
//     if (url.toString().startsWith('http')) return url;
//     return `http://192.168.1.12:5000${url.startsWith('/') ? '' : '/'}${url}`;
//   };

//   // حذف الشكوى
//   const deleteReview = async (reviewId: string) => {
//     Alert.alert(
//       "حذف التقييم",
//       "هل أنت متأكد من الحذف؟ لا يمكن التراجع عن هذا الإجراء.",
//       [
//         { text: "إلغاء", style: "cancel" },
//         { 
//           text: "حذف", 
//           style: "destructive", 
//           onPress: async () => {
//             try {
//               // الآن السيرفر سيفهم هذا الطلب بعد التعديل
//               await apiClient.delete(`/api/reviews/${reviewId}`);
//               Alert.alert("تم", "تم حذف الشكوى بنجاح");
//               fetchReviews(); // تحديث القائمة لإخفاء المحذوف
//             } catch (error) {
//               Alert.alert("خطأ", "فشل الحذف، تأكد من تشغيل السيرفر");
//             }
//           }
//         }
//       ]
//     );
//   };

//   // إرسال التقييم
//   const handleSubmitReview = async () => {
//     if (!isFormValid) return Alert.alert("بيانات ناقصة", "النجوم والتعليق مطلوبان.");
//     setIsSubmitting(true);
//     try {
//       await apiClient.post('/api/reviews', {
//         productId: params.productId, rating, comment
//       });
//       Keyboard.dismiss();
//       setModalVisible(false);
//       Alert.alert("نجاح", "تم إرسال تقييمك بنجاح ✅");
//       setRating(0); setComment(''); fetchReviews();
//     } catch (error: any) {
//       if (error.response?.status === 400) {
//         Alert.alert("تنبيه", "لقد قيمت هذا المنتج مسبقاً");
//         setModalVisible(false);
//       } else {
//         Alert.alert("خطأ", "فشل الإرسال");
//       }
//     } finally { setIsSubmitting(false); }
//   };

//   const renderStars = (currentRating: number, size = 16, isInteractive = false) => (
//     <View style={styles.starsRow}>
//       {[1, 2, 3, 4, 5].map((num) => (
//         <TouchableOpacity key={num} disabled={!isInteractive} onPress={() => setRating(num)}>
//           <Ionicons 
//             name={num <= (isInteractive ? rating : currentRating) ? "star" : "star-outline"} 
//             size={size} color="#FFB800" style={{ marginLeft: 2 }}
//           />
//         </TouchableOpacity>
//       ))}
//     </View>
//   );

//   if (loading) return <View style={styles.centered}><ActivityIndicator size="large" color="#D2691E" /></View>;

//   return (
//     <View style={styles.container}>
//       <Stack.Screen options={{ headerTitle: 'متابعة التقييمات', headerBackTitleVisible: false }} />
      
//       <FlatList
//         data={reviews}
//         keyExtractor={(item) => item._id}
//         contentContainerStyle={styles.listContainer}
//         ListEmptyComponent={() => (
//            <View style={styles.emptyBox}>
//              <Ionicons name="chatbox-ellipses-outline" size={60} color="#ccc" />
//              <Text style={styles.emptyTitle}>لا توجد تقييمات</Text>
//            </View>
//         )}
//         renderItem={({ item }) => (
//           <View style={styles.reviewCard}>
//             {/* الصف العلوي: يحتوي على الصورة، التفاصيل، وزر الحذف */}
//             <View style={styles.cardHeaderRow}>
              
//               {/* يمين: صورة المنتج */}
//               <Image source={{ uri: getImageUrl(item.productId?.imageUrls?.[0]) }} style={styles.productThumb} />
              
//               {/* وسط: التفاصيل (الاسم، النجوم، الحالة) */}
//               <View style={styles.headerInfo}>
//                 <Text style={styles.pName} numberOfLines={1}>{item.productId?.name}</Text>
                
//                 {/* النجوم والحالة بجانب بعضهما */}
//                 <View style={styles.metaRow}>
//                    {renderStars(item.rating)}
//                    <View style={[styles.statusBadge, {backgroundColor: item.status === 'processed' ? '#E8F5E9' : '#FFF3E0'}]}>
//                       <Text style={[styles.statusText, {color: item.status === 'processed' ? '#2E7D32' : '#EF6C00'}]}>
//                         {item.status === 'processed' ? "تمت المعالجة" : "قيد المعالجة"}
//                       </Text>
//                    </View>
//                 </View>
//               </View>

//               {/* يسار: زر الحذف */}
//               <TouchableOpacity style={styles.deleteReviewBtn} onPress={() => deleteReview(item._id)}>
//                 <Ionicons name="trash-outline" size={22} color="#FF3B30" />
//               </TouchableOpacity>
//             </View>

//             {/* الأسفل: نص الشكوى */}
//             <View style={styles.commentBox}>
//               <Text style={styles.commentText}>{item.comment}</Text>
//             </View>
//           </View>
//         )}
//       />

//       {/* نافذة التقييم (Modal) */}
//       <Modal visible={modalVisible} animationType="fade" transparent={true}>
//         <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//           <View style={styles.modalOverlay}>
//             <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardView}>
//               <View style={styles.modalContent}>
//                 <TouchableOpacity style={styles.closeBtn} onPress={() => setModalVisible(false)}>
//                   <Ionicons name="close-circle" size={32} color="#ccc" />
//                 </TouchableOpacity>

//                 <Image source={{ uri: getImageUrl(params.image) }} style={styles.largeProductImg} />
//                 <Text style={styles.targetProductName}>{params.name}</Text>
//                 <Text style={styles.ratingHint}>تقييمك إجباري *</Text>
//                 {renderStars(0, 42, true)}

//                 <View style={styles.inputWrapper}>
//                   <TextInput
//                     style={styles.textArea}
//                     placeholder="اكتب ملاحظاتك (مطلوب) *"
//                     multiline
//                     value={comment}
//                     onChangeText={setComment}
//                     textAlign="right"
//                     returnKeyType="done"
//                     blurOnSubmit={true}
//                     onSubmitEditing={Keyboard.dismiss}
//                   />
//                 </View>

//                 <TouchableOpacity 
//                   style={[styles.submitBtn, !isFormValid && styles.disabledBtn]} 
//                   onPress={handleSubmitReview} 
//                   disabled={isSubmitting || !isFormValid}
//                 >
//                   <Text style={styles.submitBtnText}>{!isFormValid ? "أكمل البيانات" : "إرسال التقييم"}</Text>
//                 </TouchableOpacity>
//               </View>
//             </KeyboardAvoidingView>
//           </View>
//         </TouchableWithoutFeedback>
//       </Modal>
//     </View>
//   );
// };

// export default MyReviewsScreen;

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#F8F9FB' },
//   centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   listContainer: { padding: 16 },
  
//   // تصميم البطاقة الجديد
//   reviewCard: { backgroundColor: '#fff', borderRadius: 16, padding: 12, marginBottom: 15, elevation: 2 },
//   cardHeaderRow: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between' },
  
//   // الصورة بجانب التقييم
//   productThumb: { width: 65, height: 65, borderRadius: 10, marginLeft: 12, backgroundColor: '#eee' },
  
//   headerInfo: { flex: 1, alignItems: 'flex-end', justifyContent: 'center' },
//   pName: { fontSize: 15, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  
//   // صف يجمع النجوم والحالة
//   metaRow: { flexDirection: 'column', alignItems: 'flex-end' },
//   starsRow: { flexDirection: 'row-reverse', marginBottom: 4 },
  
//   statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 5 },
//   statusText: { fontSize: 10, fontWeight: 'bold' },

//   // زر الحذف
//   deleteReviewBtn: { padding: 10, backgroundColor: '#FFF5F5', borderRadius: 10, marginRight: 5 },

//   commentBox: { marginTop: 12, backgroundColor: '#FDF7F0', padding: 10, borderRadius: 10, borderRightWidth: 3, borderRightColor: '#D2691E' },
//   commentText: { textAlign: 'right', fontSize: 13, color: '#555' },
//   emptyBox: { marginTop: 100, alignItems: 'center' },
//   emptyTitle: { fontSize: 16, color: '#999', marginTop: 10 },

//   // Modal Styles
//   modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
//   keyboardView: { width: '100%', alignItems: 'center' },
//   modalContent: { width: width * 0.85, backgroundColor: '#fff', borderRadius: 25, padding: 20, alignItems: 'center' },
//   closeBtn: { alignSelf: 'flex-start' },
//   largeProductImg: { width: 100, height: 100, borderRadius: 50, marginBottom: 10, borderWidth: 3, borderColor: '#FDF7F0' },
//   targetProductName: { fontSize: 18, fontWeight: 'bold', color: '#D2691E', textAlign: 'center' },
//   ratingHint: { fontSize: 14, color: '#D2691E', marginTop: 15, marginBottom: 5, fontWeight: 'bold' },
//   inputWrapper: { width: '100%', marginTop: 10, backgroundColor: '#F5F5F5', borderRadius: 12, padding: 10 },
//   textArea: { height: 80, fontSize: 14, color: '#333' },
//   submitBtn: { backgroundColor: '#D2691E', width: '100%', padding: 15, borderRadius: 12, marginTop: 20, alignItems: 'center' },
//   disabledBtn: { backgroundColor: '#ccc' },
//   submitBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
// });
import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, FlatList, Image, ActivityIndicator, 
  TouchableOpacity, Modal, TextInput, Alert, Dimensions,
  KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams } from 'expo-router';
import apiClient from '@/libs/services/axiosClient';

const { width } = Dimensions.get('window');

// ⚠️ تأكد أن هذا العنوان صحيح
const SERVER_URL = 'http://192.168.1.20:5000';

const MyReviewsScreen = () => {
  const params = useLocalSearchParams();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // حالات النافذة
  const [modalVisible, setModalVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // التحقق من الإدخال
  const isFormValid = rating > 0 && comment.trim().length > 0;

  // 1. جلب التقييمات
  const fetchReviews = async () => {
    try {
      const { data } = await apiClient.get('/api/reviews/myreviews');
      // طباعة البيانات للتأكد
      console.log("Reviews fetched:", data.length);
      setReviews(Array.isArray(data) ? data : (data.reviews || []));
    } catch (error) {
      console.error("خطأ جلب التقييمات:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
    if (params.productId) { setModalVisible(true); }
  }, [params.productId]);

  // 2. دالة الصور الذكية
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

  // حذف الشكوى
  const deleteReview = async (reviewId: string) => {
    Alert.alert("حذف", "تأكيد الحذف؟", [
      { text: "إلغاء", style: "cancel" },
      { text: "حذف", style: "destructive", onPress: async () => {
          try {
            await apiClient.delete(`/api/reviews/${reviewId}`);
            fetchReviews(); // تحديث القائمة
          } catch (e) { Alert.alert("خطأ", "فشل الحذف"); }
        }
      }
    ]);
  };

  // إرسال التقييم
  const handleSubmitReview = async () => {
    if (!isFormValid) return Alert.alert("تنبيه", "أكمل البيانات");
    setIsSubmitting(true);
    try {
      // لاحظ: هنا نرسل productId كما هو، لأن السيرفر يحتاجه عند الإنشاء
      await apiClient.post('/api/reviews', { productId: params.productId, rating, comment });
      Keyboard.dismiss();
      setModalVisible(false);
      Alert.alert("تم", "شكراً لك ✅");
      setRating(0); setComment(''); 
      fetchReviews(); // تحديث القائمة لإظهار التقييم الجديد
    } catch (e: any) {
      if (e.response?.status === 400) {
         Alert.alert("تنبيه", "مقيم مسبقاً");
         setModalVisible(false);
      } else {
         Alert.alert("خطأ", "فشل الإرسال");
      }
    } finally { setIsSubmitting(false); }
  };

  const renderStars = (currentRating: number, size = 16, interactive = false) => (
    <View style={styles.starsRow}>
      {[1, 2, 3, 4, 5].map((num) => (
        <TouchableOpacity key={num} disabled={!interactive} onPress={() => setRating(num)}>
          <Ionicons name={num <= (interactive ? rating : currentRating) ? "star" : "star-outline"} size={size} color="#FFB800" />
        </TouchableOpacity>
      ))}
    </View>
  );

  if (loading) return <View style={styles.centered}><ActivityIndicator size="large" color="#D2691E" /></View>;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerTitle: 'التقييمات', headerBackTitleVisible: false }} />
      
      <FlatList
        data={reviews}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<View style={styles.emptyBox}><Text>لا توجد تقييمات</Text></View>}
        renderItem={({ item }) => {
          // 🛡️ التعديل هنا: استخدام item.product ليتوافق مع السيرفر الجديد
          const product = item.product || item.productId || { name: 'جار التحميل...' };
          const productImg = getImageUrl(product);

          return (
            <View style={styles.reviewCard}>
              <View style={styles.cardHeaderRow}>
                {/* الصورة */}
                <Image source={{ uri: productImg }} style={styles.productThumb} />
                
                {/* التفاصيل */}
                <View style={styles.headerInfo}>
                  <Text style={styles.pName} numberOfLines={1}>{product.name}</Text>
                  <View style={styles.metaRow}>
                     {renderStars(item.rating)}
                     <View style={[styles.statusBadge, {backgroundColor: item.status === 'processed' ? '#E8F5E9' : '#FFF3E0'}]}>
                        <Text style={[styles.statusText, {color: item.status === 'processed' ? '#2E7D32' : '#EF6C00'}]}>
                          {item.status === 'processed' ? "تمت المعالجة" : "قيد المعالجة"}
                        </Text>
                     </View>
                  </View>
                </View>

                {/* الحذف */}
                <TouchableOpacity style={styles.deleteReviewBtn} onPress={() => deleteReview(item._id)}>
                  <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                </TouchableOpacity>
              </View>

              <View style={styles.commentBox}>
                <Text style={styles.commentText}>{item.comment}</Text>
              </View>
            </View>
          );
        }}
      />

      {/* النافذة المنبثقة */}
      <Modal visible={modalVisible} animationType="fade" transparent={true}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardView}>
              <View style={styles.modalContent}>
                <TouchableOpacity style={styles.closeBtn} onPress={() => setModalVisible(false)}>
                  <Ionicons name="close-circle" size={32} color="#ccc" />
                </TouchableOpacity>
                <Image source={{ uri: getImageUrl(params.image) }} style={styles.largeProductImg} />
                <Text style={styles.targetProductName}>{params.name}</Text>
                <Text style={styles.ratingHint}>تقييم إجباري *</Text>
                {renderStars(0, 42, true)}
                <View style={styles.inputWrapper}>
                  <TextInput style={styles.textArea} placeholder="ملاحظاتك..." multiline value={comment} onChangeText={setComment} textAlign="right" />
                </View>
                <TouchableOpacity style={[styles.submitBtn, !isFormValid && styles.disabledBtn]} onPress={handleSubmitReview} disabled={isSubmitting || !isFormValid}>
                  <Text style={styles.submitBtnText}>{!isFormValid ? "أكمل البيانات" : "إرسال"}</Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default MyReviewsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContainer: { padding: 16 },
  reviewCard: { backgroundColor: '#fff', borderRadius: 16, padding: 12, marginBottom: 15, elevation: 2 },
  cardHeaderRow: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between' },
  productThumb: { width: 65, height: 65, borderRadius: 10, marginLeft: 12, backgroundColor: '#eee', borderWidth: 1, borderColor: '#ddd' },
  headerInfo: { flex: 1, alignItems: 'flex-end', justifyContent: 'center' },
  pName: { fontSize: 15, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  metaRow: { flexDirection: 'column', alignItems: 'flex-end' },
  starsRow: { flexDirection: 'row-reverse', marginBottom: 4 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 5 },
  statusText: { fontSize: 10, fontWeight: 'bold' },
  deleteReviewBtn: { padding: 10, backgroundColor: '#FFF5F5', borderRadius: 10, marginRight: 5 },
  commentBox: { marginTop: 12, backgroundColor: '#FDF7F0', padding: 10, borderRadius: 10, borderRightWidth: 3, borderRightColor: '#D2691E' },
  commentText: { textAlign: 'right', fontSize: 13, color: '#555' },
  emptyBox: { marginTop: 100, alignItems: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  keyboardView: { width: '100%', alignItems: 'center' },
  modalContent: { width: width * 0.85, backgroundColor: '#fff', borderRadius: 25, padding: 20, alignItems: 'center' },
  closeBtn: { alignSelf: 'flex-start' },
  largeProductImg: { width: 100, height: 100, borderRadius: 50, marginBottom: 10, borderWidth: 3, borderColor: '#FDF7F0' },
  targetProductName: { fontSize: 18, fontWeight: 'bold', color: '#D2691E', textAlign: 'center' },
  ratingHint: { fontSize: 14, color: '#D2691E', marginTop: 15, marginBottom: 5, fontWeight: 'bold' },
  inputWrapper: { width: '100%', marginTop: 10, backgroundColor: '#F5F5F5', borderRadius: 12, padding: 10 },
  textArea: { height: 80, fontSize: 14, color: '#333' },
  submitBtn: { backgroundColor: '#D2691E', width: '100%', padding: 15, borderRadius: 12, marginTop: 20, alignItems: 'center' },
  disabledBtn: { backgroundColor: '#ccc' },
  submitBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});