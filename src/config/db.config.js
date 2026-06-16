const mongoose = require("mongoose")
const dotenv = require("dotenv")

dotenv.config()

const connectDB = () => {
  try {
    mongoose.connect(process?.env?.MONGO_URI)
    console.log("DB connect successfull")
  } catch (error) {
    console.log("DB connnection error")
  }
}

module.exports = connectDB