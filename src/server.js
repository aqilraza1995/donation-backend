const app = require("./app")
const connectDB = require("./config/db.config")
const dotenv = require("dotenv")

dotenv.config()
connectDB()


const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
  console.log(`Server is running on PORT = ${PORT}`)
})