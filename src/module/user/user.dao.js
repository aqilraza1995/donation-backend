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

const getTotalUserCount = async () => {
  const [male, female, other, total] = await Promise.all([
    user.countDocuments({ gender: "male" }),
    user.countDocuments({ gender: "female" }),
    user.countDocuments({ gender: "other" }),
    user.countDocuments()
  ])
  return { male, female, other, total }
}

const getTotalPlatformDonation = async () => {
  const result = await user.aggregate([
    {
      $group: { _id: null, totalEarned: { $sum: "$totalDonation" } }
    }
  ])
  return result?.length ? result[0]?.totalEarned : 0
}

const getSingleUserTotalDonation = async (userId) => {
  const result = await user?.findById(userId).select("totalDonation")
  return result ? result?.totalDonation : 0
}

const getUserWithZeroDonation = async () => {
  return await user?.countDocuments({ totalDonation: 0 })
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  updateUser,
  findByResetToken,
  getTotalUserCount,
  getTotalPlatformDonation,
  getSingleUserTotalDonation,
  getUserWithZeroDonation
}
