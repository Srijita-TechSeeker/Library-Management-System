const mongoose= require('mongoose');

const uri="mongodb://localhost:27017/library"

const connectToMongo=() =>{
    mongoose.connect(uri);
    console.log("Conected successful");
}

module.exports = connectToMongo;