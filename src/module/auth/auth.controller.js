const bcrypt = require("bcrypt")
const { generateToken } = require("../../utils/jwt")
const { createUser, findUserByEmail, updateUser, findByResetTokenm } = require("../user/user.dao")
const sendEmail = require("../../middleware/mail.middleware")


const register = async (req, res) => {
  try {
    const exitingUser = await findUserByEmail({ email: req?.body?.email })
    if (exitingUser) {
      return res?.status(400).json({ messsage: "User is already exist." })
    }

    const hashPassword = await bcrypt.hash(req?.body?.password, 10)

    const userData = { ...req?.body, password: hashPassword }

    await createUser(userData)
    return res?.status(201).json({ message: "User register successfully" })

  } catch (error) {
    return res?.status(500).json({ message: "Internal server error" })
  }
}

const login = async (req, res) => {
  try {
    const user = await findUserByEmail({ email: req?.body?.email })
    if (!user) {
      return res?.status(400).json({ message: "Invalid credential" })
    }
    const validPassword = await bcrypt.compare(req?.body?.password, user?.password)
    if (!validPassword) {
      return res?.status(400).json({ message: "Invalid credential" })
    }

    const token = generateToken({ id: user._id, role: user.role })
    res?.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 7 * 24 * 60 * 60 * 1000 })
    const userObj = user.toObject()

    const { password, ...userWithoutPassword } = userObj

    const data = { user: userWithoutPassword }
    return res?.status(200).json({ message: "User login successfully", data: data.user })

  } catch (error) {
    return res?.status(500).json({ message: "Internal server error" })
  }
}

const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    })
    return res.status(200).json({ message: "Logout successfully" })
  } catch (error) {
    return res?.status(500).json({ message: "Internal server error" })
  }
}

const forgotPassword = async (req, res) => {
  try {
    const user = await findUserByEmail({ email: req?.body?.email })
    if (!user) {
      return res?.status(400).json({ message: "User is not exist." })
    }

    const resetToken = generateResetToken()

    await updateUser({ id: user?._id, payload: { resetPasswordToken: resetToken, resetPasswordExpire: Date.now() + 10 * 60 * 1000 } })
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`

    await sendEmail(
      user.email,
      "Reset Password",
      `
        <h2>Password Reset</h2>
        <p>Click below link to reset password</p>
        <a href="${resetUrl}">${resetUrl}</a>
      `
    )
    return res.status(200).json({ message: "Reset link sent to email" });

  } catch (error) {
    return res?.status(500).json({ message: "Internal server error" })
  }
}

const resetPassword = async (req, res) => {
  try {
    const user = await findByResetToken({ resetPasswordToken: req?.params?.resetToken })
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    const hashPassword = await bcrypt.hash(req.body.password, 10)
    await updateUser({ id: user._id, payload: { password: hashPassword, resetPasswordToken: null, resetPasswordExpire: null } })
    return res.status(200).json({ message: "Password reset successfully" });

  } catch (error) {
    return res?.status(500).json({ message: "Internal server error" })
  }
}


module.exports = {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword
}