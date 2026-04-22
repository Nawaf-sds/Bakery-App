// helpers/generateRandomCode.js
const generateRandomCode = (length = 6) => {
  return Math.random().toString().slice(2, 2 + length);
};

module.exports = generateRandomCode;
