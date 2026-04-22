const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// ✅ دالة تسجيل مستخدم جديد
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'يرجى إدخال جميع الحقول' });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'المستخدم موجود مسبقاً' });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: 'بيانات المستخدم غير صحيحة' });
  }
};

// ✅ دالة تسجيل الدخول
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'يرجى إدخال البريد وكلمة المرور' });
  }

  // ✅ نستخدم select('+password') لجلب كلمة المرور المخزنة
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return res.status(401).json({ message: 'بيانات الدخول غير صحيحة' });
  }
  
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'بيانات الدخول غير صحيحة' });
  }
  
  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  });
};

// ✅ دوال مؤقتة لبقية المسارات
const getAllUsers = (req, res) => {
  res.json({ message: 'getAllUsers placeholder' });
};

const getUserById = (req, res) => {
  res.json({ message: 'getUserById placeholder' });
};

const updateUser = (req, res) => {
  res.json({ message: 'updateUser placeholder' });
};

const deleteUser = (req, res) => {
  res.json({ message: 'deleteUser placeholder' });
};

// ✅ تصدير جميع الدوال
module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};

