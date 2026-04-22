
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const cloudinaryPackage = require('multer-storage-cloudinary');

// -----------------------------------------------------------------------------
// سبب المشكلة: 
// التحديث الجديد لمكتبة (multer-storage-cloudinary) غيّر طريقة تصدير الكلاس.
// في النسخ القديمة كان يُصدر الكلاس مباشرة، وفي النسخ الجديدة أصبح داخل كائن (Object).
// هذا التغيير هو ما تسبب في خطأ "CloudinaryStorage is not a constructor" 
// لأن الكود القديم كان يحاول تشغيل الكائن كأنه كلاس برمجي.
//
// طريقة الحل: 
// السطر التالي يعمل كـ "استدعاء ذكي" (Universal Import). 
// الكود يبحث أولاً عن الكلاس بداخل الكائن (ليتناسب مع النسخ الجديدة)، 
// وإذا لم يجده (في حال كانت النسخة قديمة)، فإنه يستخدم الحزمة مباشرة.
// -----------------------------------------------------------------------------
const CloudinaryStorage = cloudinaryPackage.CloudinaryStorage || cloudinaryPackage;

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'BakeryProducts',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
});

const upload = multer({ storage: storage });

module.exports = upload;