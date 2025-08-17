const express = require("express");
const { protect } = require("../middleWare/auth.Middleware");
const {sendMessage, allMessages} = require("../controller/message.Controller");
const router = express.Router();

router.route("/:chatId").get(protect, allMessages);
router.route("/").post(protect, sendMessage);

module.exports = router;