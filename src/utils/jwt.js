const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
const crypto = require("crypto")

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

const generateToken = ({ id, role }) => {
  return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: "7d" })
}

const generateResetToken = () => {
  return crypto.randomBytes(32).toString("hex")
}

const verifyToken = ( token ) => {
  return jwt.verify(token, JWT_SECRET)
}

module.exports = { generateToken, verifyToken, generateResetToken }