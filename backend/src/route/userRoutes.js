const express=require("express");
const {registerUser, authUser, allUsers}= require("../controller/user.controller");
const { protect } = require("../middleWare/auth.Middleware");
const router=express.Router()
router.route('/').post(registerUser).get(protect ,allUsers);
router.post('/login',authUser)
module.exports= router;