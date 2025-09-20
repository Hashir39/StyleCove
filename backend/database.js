const mongoose = require('mongoose');

const connectToMongo = async () => {
    try {
        await mongoose.connect('mongodb+srv://hashirshakeel044:IT0Hu95GaxF3cBB3@cluster0.jy3t1.mongodb.net/ecommerce', {
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); // Exit the process with failure
    }
};

module.exports = connectToMongo;


