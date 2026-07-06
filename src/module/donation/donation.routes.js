const express = require("express");
const donationController = require("./donation.controller");
const { authMiddleWare } = require("../../middleware/auth.middleware");

const router = express?.Router();

router.post("/create-checkout-session", authMiddleWare, donationController?.createCheckoutSession);
router.get("/my-donations", authMiddleWare, donationController?.getUserDonations);
router.post("/webhook", donationController?.handleWebhook);

module.exports = router;