const user = require("../../model/user.model")

const createUser = async (userData) => {
  return await user.create(userData)
}

const findUserByEmail = async ({ email }) => {
  return await user.findOne({ email })
}

const findUserById = async ({ id }) => {
  return await user.findById(id)
}

const updateUser = async ({ id, payload }) => {
  return await user.findByIdAndUpdate(id, payload, { new: true })
}

const findByResetToken = async ({ resetPasswordToken }) => {
  return await user.findOne({ resetPasswordToken, resetPasswordExpire: { $gt: Date.now() } })
}
module.exports = { createUser, findUserByEmail, findUserById, updateUser, findByResetToken }
