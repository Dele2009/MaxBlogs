const mongoose = require('mongoose')
const Schema = mongoose.Schema

const blogschema= new Schema({
    title:{
        type:String,
        required:true
    },
    header:{
        type:String,
        required:true
    },
    blog:{
        type:String,
        required:true
    }
}, {timestamps:true});

const Blog= mongoose.model('Blog',blogschema)

module.exports= Blog