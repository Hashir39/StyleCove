const mongoose = require('mongoose');

// Schema for creating products
const productSchema = new mongoose.Schema({
    id: {
        type: Number, // Acts like a foreign key
        required: true
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    new_price: {
        type: Number,
        required: true
    },
    old_price: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    available: {
        type: Boolean,
        default: true
    }
});

// Now create the model
const Product = mongoose.model('Product', productSchema);

// Export the model
module.exports = Product;