const express = require("express")

const { login, logout, register, forgotPassword, resetPassword } = require("./auth.controller")

const router = express.Router()

router.post("/register", register)
router.post("/login", login)
router.post("/logout", logout)
router.post("/forgot-password", forgotPassword)
router.post("/reset-password/:resetToken", resetPassword)

module.exports = router