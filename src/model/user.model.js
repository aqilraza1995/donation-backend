const mongoose = require("mongoose")


const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Name is required"] },
  mobile: { type: String, required: [true, "Mobile number is required"] },
  gender: { type: String, enum: ["male", "female", "other"], required: [true, "Gender is required"] }, 
  email: { type: String, required: [true, "Email is required"] },
  password: { type: String, required: [true, "Password is required"] },
  totalDonation: { type: Number, default: 0 },
  resetPasswordToken: { type: String },
  resetPasswordExpire: { type: Date },
  role: { type: String, enum: ["user", "admin"], default: "user" }
}, { timestamps: true })

module.exports = mongoose.model("users", userSchema)