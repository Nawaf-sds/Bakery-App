// Back-end/models/promotionModel.js

const mongoose = require('mongoose');

// This schema defines the structure of a promotion in the database
const promotionSchema = new mongoose.Schema({
    // The URL of the promotional image
    image: {
        type: String,
        required: true,
    },
    // An optional link (e.g., to a product or category) when the user taps the banner
    link: {
        type: String,
    }
}, {
    // Automatically adds 'createdAt' and 'updatedAt' fields
    timestamps: true
});

const Promotion = mongoose.model('Promotion', promotionSchema);

module.exports = Promotion;