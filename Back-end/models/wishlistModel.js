// Back-end/models/wishlistModel.js

const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User', // يشير إلى نموذج المستخدم
        unique: true // كل مستخدم لديه قائمة أمنيات واحدة فقط
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Product' // يشير إلى نموذج المنتج
        }
    }]
}, {
    timestamps: true // يضيف حقلي createdAt و updatedAt تلقائيًا
});

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

module.exports = Wishlist;