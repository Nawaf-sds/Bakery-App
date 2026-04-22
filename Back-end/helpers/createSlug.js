// helpers/createSlug.js
const createSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\u0600-\u06FF\-]+/g, '') // Keep Arabic letters
    .replace(/\-\-+/g, '-');        // Replace multiple - with single -
};

module.exports = createSlug;
