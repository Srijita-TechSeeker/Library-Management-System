// db.js
const mongoose = require('mongoose');
require('dotenv').config();

const connectToMongo = () => {
    const useAtlas = process.env.USE_ATLAS === 'true';
    const uri = useAtlas ? process.env.MONGO_URI_ATLAS : process.env.MONGO_URI_LOCAL;

    mongoose.connect(uri)
        .then(() => console.log(`✅ Connected to ${useAtlas ? 'MongoDB Atlas' : 'Local MongoDB'}`))
        .catch(err => console.error("❌ MongoDB connection error:", err));
};

module.exports = connectToMongo;
