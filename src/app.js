const express = require("express")
const cors = require("cors")
const routes = require("./routes")
const cookieParser = require("cookie-parser")

const app = express();

app.set("trust proxy", 1);

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://donation-next-web.vercel.app"
  ],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "stripe-signature"]
}))

app.use(cookieParser());
app.use("/api/donation/webhook", express.raw({ type: "application/json" }));
app.use(express.json())

app.use("/api", routes)


module.exports = app