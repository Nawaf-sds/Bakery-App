const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');

router.post('/', upload.single('image'), (req, res) => {
  res.json({
    message: 'تم رفع الصورة',
    imageUrl: req.file?.path || req.file?.filename
  });
});

module.exports = router;



























// const express = require('express');
// const router = express.Router();

// router.get('/test', (req, res) => {
//   res.json({ message: 'Upload Route Works ✅' });
// });

// module.exports = router;
