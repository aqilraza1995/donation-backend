const express = require("express")
const userController = require("../user/user.controller")
const { authMiddleWare } = require("../../middleware/auth.middleware")

const router = express?.Router()

router.get("/", authMiddleWare, userController?.getUsersWithDonation)
router.get("/:id", authMiddleWare, userController?.getUserById)

module.exports = router