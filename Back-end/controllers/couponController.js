const Coupon = require('../models/Coupon');

const createCoupon = async (req, res) => {
  try {
    const coupon = new Coupon(req.body);
    const saved = await coupon.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createCoupon,
  getCoupons
};
