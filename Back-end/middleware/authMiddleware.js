const jwt = require('jsonwebtoken');
const User = require('../models/user');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');

      // --- ✨ هذا هو السطر الأهم الذي يمنع الانهيار ---
      if (!req.user) {
        return res.status(401).json({ message: 'المستخدم المرتبط بهذا التوكن لم يعد موجودًا' });
      }

      next();
    } catch (err) {
      console.error(err); return res.status(401).json({ message: 'فشل التوثيق، التوكن غير صالح' });
    }
  } else { return res.status(401).json({ message: 'غير مصرح لك، التوكن مفقود' }); }

};

// ✅ ميدلوير التحقق من صلاحية الأدمن
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'غير مصرح لك - فقط المشرف يستطيع الوصول' });
  }
};

module.exports = { protect, isAdmin };