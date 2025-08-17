const mongoose=require('mongoose');
const massegeSchema= new mongoose.Schema({
   sender:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
   content:{type:String,trim:true},
   chat:{
    type:mongoose.Schema.Types.ObjectId,ref:"Chat"
   },
},{timestamps:true});

const massegeModel=mongoose.model('Massege',massegeSchema);
module.exports = massegeModel;