const mongoose = require("mongoose")
const dotenv = require("dotenv")

dotenv.config()

const connectDB = async () => {
  try {
    await mongoose.connect(process?.env?.MONGO_URI)
    console.log("DB connect successfull")
  } catch (error) {
    console.log("DB connnection error", error?.message)
    process.exit(1)
  }
}

module.exports = connectDB