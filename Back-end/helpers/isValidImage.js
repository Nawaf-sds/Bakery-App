// helpers/isValidImage.js
const path = require('path');

const isValidImage = (filename) => {
  const ext = path.extname(filename).toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
};

module.exports = isValidImage;
