// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
// const User = require('../models/user');


// const { OAuth2Client } = require('google-auth-library');
// const User = require('../models/user'); // تأكد من مسار الموديل الخاص بك
// const jwt = require('jsonwebtoken');

// // يجب إضافة GOOGLE_CLIENT_ID في ملف .env لاحقاً
// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// exports.googleLogin = async (req, res) => {
//   try {
//     const { idToken } = req.body;

//     // 1. التحقق من صحة التوكن مع جوجل
//     const ticket = await client.verifyIdToken({
//       idToken: idToken,
//       audience: process.env.GOOGLE_CLIENT_ID,
//     });
    
//     // 2. استخراج بيانات المستخدم من جوجل
//     const { email, name, picture } = ticket.getPayload();

//     // 3. التحقق هل المستخدم موجود في قاعدة بياناتنا؟
//     let user = await User.findOne({ email });

//     if (!user) {
//       // إذا لم يكن موجوداً، قم بإنشاء حساب جديد له
//       user = await User.create({
//         name: name,
//         email: email,
//         password: Math.random().toString(36).slice(-8) + process.env.JWT_SECRET, // كلمة مرور عشوائية معقدة لأنه لن يستخدمها
//         image: picture, // اختياري
//       });
//     }

//     // 4. إصدار التوكن الخاص بتطبيقك (JWT)
//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

//     res.status(200).json({
//       success: true,
//       token,
//       user: { id: user._id, name: user.name, email: user.email }
//     });

//   } catch (error) {
//     console.error('Google Login Error:', error);
//     res.status(401).json({ success: false, message: 'فشل التحقق من حساب جوجل' });
//   }
// };




// const generateToken = (userId) => {
//   return jwt.sign(
//     { id: userId },
//     process.env.JWT_SECRET,
//     { expiresIn: '30d' }
//   );
// };

// const registerUser = async (req, res) => {
//   const { name, email, password } = req.body;

//   if (!name || !email || !password) {
//     return res.status(400).json({ message: 'يرجى إدخال جميع الحقول' });
//   }

//   // 1. التحقق السليم: إذا المستخدم موجود، نرفض الطلب
//   const existingUser = await User.findOne({ email });
//   if (existingUser) {
//     return res.status(400).json({ message: 'البريد الإلكتروني مسجل مسبقاً، يرجى تسجيل الدخول.' });
//   }

//   // 2. إنشاء المستخدم 
//   // 💡 ملاحظة مهمة: إذا كان ملف models/user.js يحتوي على دالة لتشفير الباسورد، 
//   // فلا تقم بتشفيره هنا، أرسله كما هو. أما إذا لم يكن يحتويها، فهذا الكود سليم.
//   const hashedPassword = await bcrypt.hash(password, 10);

//   try {
//     const user = await User.create({
//       name,
//       email,
//       password: hashedPassword, // يتم تخزين الباسورد المشفر هنا
//     });

//     res.status(201).json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       token: generateToken(user._id),
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'حدث خطأ أثناء إنشاء الحساب' });
//   }
// };

// const loginUser = async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ message: 'يرجى إدخال البريد وكلمة المرور' });
//   }

//   // جلب المستخدم مع حقل كلمة المرور (لأنك ربما قمت بإخفائه في المودل)
//   const user = await User.findOne({ email }).select('+password');

//   // التحقق من وجود المستخدم، ثم مطابقة كلمة المرور
//   if (!user || !(await bcrypt.compare(password, user.password))) {
//     return res.status(400).json({ message: 'بيانات الدخول غير صحيحة' });
//   }

//   res.json({
//     _id: user._id,
//     name: user.name,
//     email: user.email,
//     token: generateToken(user._id),
//   });
// };

// // ... (باقي الدوال كما هي: verifyUser, getAllUsers, etc.)

// // ✅ دالة جديدة للتحقق من التوكن
// const verifyUser = async (req, res) => {
//     // إذا وصل الطلب إلى هنا، فهذا يعني أن التوكن صالح و protect قد أضاف req.user
//     res.json({
//         _id: req.user._id,
//         name: req.user.name,
//         email: req.user.email,
//         role: req.user.role // إرجاع صلاحيات المستخدم
//     });
// };

// const getAllUsers = (req, res) => {
//   res.json({ message: 'getAllUsers placeholder' });
// };

// const getUserById = (req, res) => {
//   res.json({ message: 'getUserById placeholder' });
// };

// const updateUser = (req, res) => {
//   res.json({ message: 'updateUser placeholder' });
// };

// const deleteUser = (req, res) => {
//   res.json({ message: 'deleteUser placeholder' });
// };

// module.exports = {
//   registerUser,
//   loginUser,
//   getAllUsers,
//   getUserById,
//   updateUser,
//   deleteUser,
//   verifyUser,
// };





const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/user'); // تأكد من أن المسار صحيح (u صغيرة أو U كبيرة حسب اسم ملفك)

// إعداد عميل جوجل (يجب إضافة المعرف في ملف .env)
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// 🛠️ دالة مساعدة لإنشاء التوكن (لسهولة الاستخدام في كل الدوال)
const generateToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    );
};

// 1️⃣ تسجيل الدخول عبر جوجل
exports.googleLogin = async (req, res) => {
    try {
        const { idToken } = req.body;

        // التحقق من صحة التوكن مع جوجل
        const ticket = await client.verifyIdToken({
            idToken: idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        
        const { email, name, picture } = ticket.getPayload();

        // البحث عن المستخدم أو إنشاؤه
        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name: name,
                email: email,
                password: Math.random().toString(36).slice(-8) + process.env.JWT_SECRET,
                image: picture,
            });
        }

        res.status(200).json({
            success: true,
            token: generateToken(user._id),
            user: { id: user._id, name: user.name, email: user.email }
        });

    } catch (error) {
        console.error('Google Login Error:', error);
        res.status(401).json({ success: false, message: 'فشل التحقق من حساب جوجل' });
    }
};

// 2️⃣ تسجيل حساب جديد (Email/Password)
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'يرجى إدخال جميع الحقول' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: 'البريد الإلكتروني مسجل مسبقاً' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: 'حدث خطأ أثناء إنشاء الحساب' });
    }
};

// 3️⃣ تسجيل الدخول (Email/Password)
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'يرجى إدخال البريد وكلمة المرور' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ message: 'بيانات الدخول غير صحيحة' });
    }

    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
    });
};

// 4️⃣ التحقق من حالة المستخدم (Verify Token)
const verifyUser = async (req, res) => {
    res.json({
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role 
    });
};

// بقية الدوال (Placeholders)
const getAllUsers = (req, res) => res.json({ message: 'getAllUsers placeholder' });
const getUserById = (req, res) => res.json({ message: 'getUserById placeholder' });
const updateUser = (req, res) => res.json({ message: 'updateUser placeholder' });
const deleteUser = (req, res) => res.json({ message: 'deleteUser placeholder' });

// تصدير جميع الدوال
module.exports = {
    registerUser,
    loginUser,
    googleLogin: exports.googleLogin, // دمجنا exports مع module.exports
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    verifyUser,
};