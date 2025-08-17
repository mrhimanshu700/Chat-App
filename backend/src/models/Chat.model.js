const { Timestamps } = require('mongodb');
const mongoose=require('mongoose');
const chatSchema= new mongoose.Schema(
    {
        chatName:{type:String,trim:true},
        isGroupChat:{type:Boolean, default:false},
        users:[
            {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
            },
        ],
        latestMassege:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Massege"
        },
        groupAdmin:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
    },{timestamps:true}
);
const chatModel = mongoose.model('Chat',chatSchema);
module.exports= chatModel;