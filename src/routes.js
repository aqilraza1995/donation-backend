const express = require("express")

const authRoutes = require("./module/auth/auth.routes")
const userRoutes = require("./module/user/user.routes")
const donationRoutes = require("./module/donation/donation.routes")

const router = express.Router()

router.use("/auth", authRoutes)
router.use("/user", userRoutes)
router.use("/donation", donationRoutes)


module.exports = router