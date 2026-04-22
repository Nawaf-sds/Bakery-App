// const mongoose = require('mongoose');

// const productSchema = new mongoose.Schema({
//     user: {
//         type: mongoose.Schema.Types.ObjectId,
//         required: true,
//         ref: 'User',
//     },
//     name: {
//         type: String,
//         required: true,
//         trim: true,
//     },
//     description: {
//         type: String,
//         required: true,
//     },
//     price: {
//         type: Number,
//         required: true,
//         min: 0,
//     },
//     // 👇 التغيير هنا
//    imageUrls: {
//   type: [String],
//   required: true,
// },
//     // 👆 تم تغيير imageUrl إلى imageUrls

//     ingredients: {
//         type: [String],
//         required: true,
//     },
//     size: {
//         type: String,
//         enum: ['كبير', 'متوسط', 'صغير', 'Medium', 'Large', 'Small'],
//         default: 'Medium',
//         required: true,
//     },
//     category: {
//         type: String,
//         enum: ['Croissant', 'Cake', 'Bread', 'Cookies', 'Muffins'],
//         default: 'Cookies',
//         required: true,
//     },
// }, { timestamps: true });

// module.exports = mongoose.model('Product', productSchema);

/////////////////////////////////////////////////////////////////////////////////////



const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    imageUrls: {
        type: [String],
        required: true,
    },
    ingredients: {
        type: [String],
        required: true,
    },
    size: {
        type: String,
        enum: ['كبير', 'متوسط', 'صغير', 'Medium', 'Large', 'Small'],
        default: 'Medium',
        required: true,
    },
    category: {
        type: String,
        enum: ['Croissant', 'Cake', 'Bread', 'Cookies', 'Muffins'], // يجب الالتزام بهذه الكلمات في Postman
        default: 'Cookies',
        required: true,
    },
    // 👇 الإضافات الجديدة للمخبز
    dailyStock: {
        type: Number,
        required: true,
        default: 0, // طاقة الإنتاج اليومي (مثال: 50 حبة اليوم)
    },
    maxPurchaseLimit: {
        type: Number,
        required: true,
        default: 5, // الحد الأقصى المسموح للعميل بشرائه في الطلب الواحد
    }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);