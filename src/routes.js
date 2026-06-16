const express = require("express")

const authRoutes = require("./module/auth/auth.routes")
const userRoutes = require("./module/user/user.routes")

const router = express.Router()

router.use("/auth", authRoutes)
router.use("/user", userRoutes)


module.exports = router