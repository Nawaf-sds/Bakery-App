// ملف يربط أسماء الصور المحلية بمسارات require الثابتة
// ضعه داخل مجلد assets بجانب images

const localImages: Record<string, any> = {
  'coffee-2.jpg': require('./images/coffee-2.jpg'),
  'sale-banner.jpg': require('./images/sale-banner.jpg'),
  // أضف المزيد من الصور هنا إذا احتجت
};

export default localImages;
