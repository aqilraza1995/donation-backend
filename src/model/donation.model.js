const mongoose = require("mongoose")

const donationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  amount: { type: Number, required: [true, "Amount is required"] },
  transactionId: { type: String, required: true },
  status: { type: String, enum: ["success", "failed"], default: "success" }
}, { timestamps: true })

module.exports = mongoose.model("donations", donationSchema)