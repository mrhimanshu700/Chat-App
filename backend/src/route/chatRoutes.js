const express=require("express");
const { protect } = require("../middleWare/auth.Middleware");
const { accessChat, fetchChats, createGroupChat, renameGroup,addToGroup,removeFromGroup } = require("../controller/chat.controllers");
const router = express.Router();


router.route('/').post(protect, accessChat)
router.route('/').get(protect, fetchChats)
router.route('/group').post(protect,createGroupChat);
router.route('/rename').put(protect,renameGroup);
router.route('/groupremove').put(protect,removeFromGroup);
router.route('/groupadd').put(protect,addToGroup); 



module.exports = router;