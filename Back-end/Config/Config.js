// Back-end/Config/config.js

// تحميل متغيرات البيئة من .env
require('dotenv').config();

module.exports = {
  // اتصال قاعدة البيانات
  mongoURI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bakeryDB',

  // رقم البورت
  port: process.env.PORT || 5000,

  // مفتاح التشفير للتوكن
  jwtSecret: process.env.JWT_SECRET || 'Nawaf@1425/19',
};
