// 🟢 إعدادات السيرفر باستخدام Express.js
//    npm start

//دخول إلى مجلد السيرفر
//    cd Back-end
// cd Back-end/Server

// ------------------------------
// Server.js (Clean & Working & RESRTful & Secure & Optimized)
// هذا هو الملف الرئيسي للسيرفر، حيث يتم إعداد Express، تحميل Middlewares، تعريف Routes، والاتصال بقاعدة البيانات.
// تم تحسينه ليكون أكثر أمانًا، تنظيمًا، واحترافية، مع إضافة حماية ضد MongoDB injection، وتحسينات في الأداء والأمان.
// ------------------------------

// 🟢 تحميل المكتبات
const express = require('express');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');

// 🟢 تحميل متغيرات البيئة من config/.env
dotenv.config({ path: path.join(__dirname, '..', 'config', '.env') });

// 🟢 استدعاء ملف Config الخاص بالمشروع
const config = require('../Config/Config');
const connectDB = require('../MongoDB/MongoDB');

// 🟢 استدعاء Middlewares
const { logger } = require('../middleware/loggerMiddleware'); 
const { notFound } = require('../middleware/notFoundMiddleware');
const { errorHandler } = require('../middleware/errorMiddleware');

// 🟢 استدعاء Routes
const authRoutes = require('../Routes/authRoutes');
const uploadRoutes = require('../Routes/uploadRoutes');
const userRoutes = require('../Routes/userRoutes');
const orderRoutes = require('../Routes/orderRoutes');
const cartRoutes = require('../Routes/cartRoutes');
const deliveryRoutes = require('../Routes/deliveryRoutes');
const couponRoutes = require('../Routes/couponRoutes');
const categoryRoutes = require('../Routes/categoryRoutes');
const productRoutes = require('../Routes/productRoutes');
const wishlistRoutes = require('../Routes/wishlistRoutes');
const reviewRoutes = require('../Routes/reviewRoutes'); // استيراد المسار الجديد
const promotionRoutes = require('../routes/promotionRoutes');

// 🟢 إنشاء app
const app = express();

// 🟢 Middlewares عامة
app.use(cors());
app.use(express.json());
// 1. الأمان: حماية الـ Headers (مع السماح لتطبيق الجوال بقراءة الصور)
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
// 2. المراقبة: طباعة الطلبات في التيرمينال (سترى الآن كل طلب يظهر أمامك)
app.use(morgan('dev')); 

// 3. قراءة البيانات (تأكد أنها موجودة لديك)
app.use(express.json());
// 🟢 Static Files (لعرض الصور المرفوعة محليًا)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// 🟢 Rate Limiting (الطريقة الاحترافية)

// قاعدة صارمة للمصادقة
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 20, // 20 محاولة تسجيل دخول/إنشاء حساب كل 15 دقيقة
  message: 'محاولات كثيرة جدًا، يرجى المحاولة مرة أخرى بعد 15 دقيقة.'
});

// قاعدة مرنة لباقي الطلبات
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 200, // 200 طلب عادي كل 15 دقيقة
  standardHeaders: true,
  legacyHeaders: false,
});

// 🟢 حماية بيانات الطلب من MongoDB query injection
// هذه الدالة ستزيل أي مفتاح يبدأ بـ $ أو يحتوي على . من جسم الطلب، مما يمنع الهجمات الشائعة
// يمكنك تعديلها لتناسب احتياجاتك، لكنها توفر حماية أساسية ضد هجمات MongoDB injection
const sanitizeObject = (obj, req) => {
  if (!obj || typeof obj !== 'object') return;
  for (const key of Object.keys(obj)) {
    if (key.startsWith('$') || key.includes('.')) {
      delete obj[key];
      console.warn(`Removed dangerous key: ${key} in ${req.method} ${req.path}`);
    } else if (typeof obj[key] === 'object') {
      sanitizeObject(obj[key], req);
    }
  }
};

const requestSanitizer = (req, res, next) => {
  sanitizeObject(req.body, req);
  next();
};

app.use(requestSanitizer);

// 🟢 الاتصال بقاعدة البيانات
connectDB();


// تطبيق القاعدة الصارمة على مسارات المصادقة الحساسة
app.use('/api/auth', authLimiter, authRoutes); // <-- تم إضافة القاعدة الصارمة هنا

// تطبيق القاعدة المرنة على باقي المسارات العامة
app.use('/api/upload', apiLimiter, uploadRoutes); // <-- تم إضافة القاعدة المرنة هنا
app.use('/api/users', apiLimiter, userRoutes);
app.use('/api/orders', apiLimiter, orderRoutes);
app.use('/api/cart', apiLimiter, cartRoutes);
app.use('/api/delivery', apiLimiter, deliveryRoutes);
app.use('/api/coupons', apiLimiter, couponRoutes);
app.use('/api/categories', apiLimiter, categoryRoutes);
app.use('/api/products', apiLimiter, productRoutes);
app.use('/api/wishlist', apiLimiter, wishlistRoutes);
app.use('/api/reviews', apiLimiter, reviewRoutes);
app.use('/api/promotions', apiLimiter, promotionRoutes);
//////////////////////////////////////////////////////////






// ✅ Middleware للأخطاء والتسجيل (يجب إضافتهم بعد الـ Routes)
app.use(logger);
app.use(notFound);
app.use(errorHandler);


// 🟢 تشغيل السيرفر
// الشكل الصحيح (يستمع لكل الاتصالات على الشبكة)
const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running in development mode on port ${PORT}`);
});






// --------------------------------------------------------------------------------------------------------------------------
// Server.js (GraphQL & Express & Secure & Optimized Version - Apollo Server v4 with Express Integration - Clean & Working)
//------------------------------------------------------------------------------------------------------------------------------
// GraphQL هو بديل قوي لـ REST، يسمح لك بإنشاء API مرنة وقابلة للتطوير. في هذا المثال، سنستخدم Apollo Server مع Express لإنشاء سيرفر GraphQL متكامل.
// هذا الملف يقوم بإعداد Express، تحميل Middlewares، تعريف نقطة نهاية GraphQL، والاتصال بقاعدة البيانات. تم تحسينه ليكون أكثر أمانًا وتنظيمًا.
// ملاحظة: تأكد من أن لديك ملفات TypeDefs و Resolvers جاهزة في مجلد GraphQL الخاص بك، وأنك قمت بتثبيت الحزم اللازمة مثل @apollo/server و @apollo/server/express4.
// ------------------------------

// 🟢 تحميل المكتبات
// const express = require('express');
// const cors = require('cors');
// const path = require('path');
// const rateLimit = require('express-rate-limit');
// const dotenv = require('dotenv');
// const helmet = require('helmet');
// const morgan = require('morgan');
// const { ApolloServer } = require('@apollo/server');
// const { expressMiddleware } = require('@apollo/server/express4');

// // 🟢 تحميل متغيرات البيئة
// dotenv.config({ path: path.join(__dirname, '..', 'config', '.env') });

// // 🟢 استدعاء ملف Config الخاص بالمشروع وقاعدة البيانات
// const connectDB = require('../MongoDB/MongoDB');

// // 🟢 استدعاء GraphQL Schema & Resolvers (يفضل تجميعها في مجلد واحد)
// const { mergedTypeDefs, mergedResolvers } = require('../GraphQL');

// // 🟢 استدعاء Middlewares
// const { logger } = require('../middleware/loggerMiddleware'); 
// const { notFound } = require('../middleware/notFoundMiddleware');
// const { errorHandler } = require('../middleware/errorMiddleware');

// // 🟢 إنشاء app
// const app = express();

// // 🟢 Middlewares عامة
// app.use(cors());
// app.use(express.json());

// // 1. الأمان: إعدادات Helmet (تم التعديل للسماح بـ GraphQL Sandbox في بيئة التطوير)
// app.use(helmet({
//   crossOriginEmbedderPolicy: false,
//   contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
// }));

// // 2. المراقبة
// app.use(morgan('dev')); 

// // 🟢 Static Files (لعرض الصور المرفوعة محليًا)
// app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// // 🟢 Rate Limiting (تم دمجها لنقطة النهاية الخاصة بـ GraphQL)
// const apiLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 300, 
//   standardHeaders: true,
//   legacyHeaders: false,
// });

// // 🟢 حماية بيانات الطلب من MongoDB query injection
// const sanitizeObject = (obj, req) => {
//   if (!obj || typeof obj !== 'object') return;
//   for (const key of Object.keys(obj)) {
//     if (key.startsWith('$') || key.includes('.')) {
//       delete obj[key];
//       console.warn(`Removed dangerous key: ${key}`);
//     } else if (typeof obj[key] === 'object') {
//       sanitizeObject(obj[key], req);
//     }
//   }
// };

// app.use((req, res, next) => {
//   if (req.body) sanitizeObject(req.body, req);
//   next();
// });

// // 🟢 دالة تشغيل السيرفر (ضرورية لأن Apollo v4 يحتاج إلى await)
// async function startServer() {
//   // 1. الاتصال بقاعدة البيانات
//   await connectDB();

//   // 2. إعداد Apollo Server
//   const server = new ApolloServer({
//     typeDefs: mergedTypeDefs,
//     resolvers: mergedResolvers,
//     // للتعامل مع الأخطاء بطريقة مخصصة (اختياري)
//     formatError: (formattedError, error) => {
//       return formattedError;
//     },
//   });

//   // 3. تشغيل Apollo
//   await server.start();

//   // 4. ربط مسار GraphQL مع Express وتمرير الـ Context (مهم للمصادقة)
//   app.use(
//     '/graphql',
//     cors(),
//     express.json(),
//     apiLimiter,
//     expressMiddleware(server, {
//       context: async ({ req, res }) => {
//         // هنا يمكنك استخراج التوكن من الـ Headers وتمرير المستخدم للـ Resolvers
//         const token = req.headers.authorization || '';
//         return { req, res, token };
//       },
//     })
//   );

//   // ✅ Middleware للأخطاء والتسجيل (لباقي مسارات الـ Express إن وجدت)
//   app.use(logger);
//   app.use(notFound);
//   app.use(errorHandler);

//   // 🟢 تشغيل السيرفر النهائي
//   const PORT = process.env.PORT || 5000;
//   app.listen(PORT, '0.0.0.0', () => {
//     console.log(`🚀 Server is running on http://0.0.0.0:${PORT}/graphql`);
//   });
// }

// // استدعاء دالة التشغيل
// startServer();