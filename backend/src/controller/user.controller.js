const asyncHandler= require("express-async-handler");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse} = require ("../utils/ApiRespons");
const User= require("../models/User.model");
const generateToken = require("../config/generateToken");
const registerUser= asyncHandler(async(req,res)=>{
    const {username ,email,password,image}= req.body;
    if(!username||!email||!password){
        console.log("fill all the fileds");
        return res
          .status(400)
          .json({ success: false, message: "Please provide all the fields" });
    }
    const existUser= await User.findOne({email});
    if(existUser){
        throw new ApiError(400,"user exist already")
    }
    const user=await User.create({
        username,
        email,
        password,
        image
    });
    if(!user){
        throw new ApiError(500," user not created");
    }else{
     res.status(201).json(
        {
            _id:user._id,
            username:user.username,
            email:user.email,
            image:user.image,
            token:generateToken(user._id),
        }
    )  
} 
});

const authUser= asyncHandler(async(req,res)=>{
const {email,password}= req.body;

const user = await User.findOne({email})
if(user&& (await user.matchPassword(password))){
    res.status(201).json(
        {
            _id:user._id,
            username:user.username,
            email:user.email,
            image:user.image,
            token:generateToken(user._id),
        }
    )
}
else{
     throw new ApiError(500," user not exist in this application");
}
});

const allUsers= asyncHandler(async(req,res)=>{
   const keyword=req.query.search?{
    $or:[
        {username:{$regex:req.query.search, $options:"i"}},
        {email:{$regex:req.query.search, $options:"i"}},
    ],
   }:{};

   const users = await User.find(keyword).find({_id:{ $ne: req.user._id}});
   res.send(users);
   
})



module.exports = {registerUser, authUser,allUsers}