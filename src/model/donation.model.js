const mongoose = require("mongoose")

const donationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users", require: true },
  amount: { type: Number, rqeuired: [true, "Amount is required"] },
  transactionId: { type: String, rqeuired: true },
  status: { type: String, enum: ["success", "failed"], default: "success" }
}, { timestamps: true })

module.exports = mongoose.model("donations", donationSchema)