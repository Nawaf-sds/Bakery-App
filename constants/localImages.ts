// ملف يربط أسماء الصور المحلية بمسارات require الثابتة
// تأكد أن coffee-cup.jpg موجودة فعلاً في assets/images/

const localImages: Record<string, any> = {
  'coffee-cup.jpg': require('../../assets/images/coffee-cup.jpg'),
  // أضف المزيد من الصور هنا إذا احتجت
};

export default localImages;
