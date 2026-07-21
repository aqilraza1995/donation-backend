const express = require("express");
const donationController = require("./donation.controller");
const { authMiddleWare } = require("../../middleware/auth.middleware");

const router = express?.Router();

router.post("/create-checkout-session", authMiddleWare, donationController?.createCheckoutSession);
router.post("/webhook", donationController?.handleWebhook);
router.get("/", authMiddleWare, donationController?.getDonations)

module.exports = router;