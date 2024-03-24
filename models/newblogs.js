const mongoose = require('mongoose')
const Schema = mongoose.Schema

const blogschema= new Schema({
    author:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
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

const Newblogs= mongoose.model('newblog',blogschema)

module.exports= Newblogs