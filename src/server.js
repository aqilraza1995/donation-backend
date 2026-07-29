const app = require("./app")
const connectDB = require("./config/db.config")
const dotenv = require("dotenv")

dotenv.config()
connectDB()


module.exports = app