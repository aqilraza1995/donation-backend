const express = require("express")
const dashboardController = require("./dashboard.controller")
const { authMiddleWare } = require("../../middleware/auth.middleware")


const router = express.Router()

router.get("/count", authMiddleWare, dashboardController?.getUserCount)
router.get("/donation-by-date-range", authMiddleWare, dashboardController?.getDonationChartDataByDateRange)

module.exports = router
