const express = require("express")
const userController = require("../user/user.controller")
const {authMiddleWare} = require("../../middleware/auth.middleware")

const router = express?.Router()

router.get("/count", authMiddleWare, userController?.getTotalUserCount)

module.exports = router