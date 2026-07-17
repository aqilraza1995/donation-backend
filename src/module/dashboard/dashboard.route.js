const express = require("express")
const dashboardController = require("./dashboard.controller")
const { authMiddleWare } = require("../../middleware/auth.middleware")


const router = express.Router()

router.get("/count", authMiddleWare, dashboardController?.getUserCount)

module.exports = router
