const express = require("express")
const userController = require("../user/user.controller")

const router = express?.Router()

router.get("/count", userController?.getTotalUserCount)

module.exports = router