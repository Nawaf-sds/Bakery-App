const Delivery = require('../models/Delivery');

const createDelivery = async (req, res) => {
  try {
    const delivery = new Delivery(req.body);
    const saved = await delivery.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find();
    res.json(deliveries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createDelivery,
  getDeliveries
};
