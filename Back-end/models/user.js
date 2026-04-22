// في Back-end/models/user.js

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    // ... الخصائص الموجودة مسبقًا
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    // ✅ إضافة حقل السلة (Cart)
    cart: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product', // ربط العنصر بنموذج المنتجات
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                default: 1,
            },
        },
    ],
}, {
    timestamps: true,
});

module.exports = mongoose.model('User', UserSchema);