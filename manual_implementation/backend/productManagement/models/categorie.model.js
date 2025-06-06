const mongoose = require('mongoose');
const Schema = mongoose.Schema
const categorieSchema = new Schema({
    name : { type : String , require : true },
    icon : { type : String ,  }
}, { timestamps: true })

module.exports = mongoose.model("categorie", categorieSchema);