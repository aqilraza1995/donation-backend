const userDao = require("./user.dao")

const getTotalUserCount = async (req, res) => {
  try {
    const { id: userId, role: userRole } = req?.user

    const totalUser = await userDao?.getTotalUserCount()

    let totalDonationAmount = 0
    let zeroDonationUserCount = undefined

    if (userRole === "admin") {
      totalDonationAmount = await userDao?.getTotalPlatformDonation()

      zeroDonationUserCount = await userDao?.getUserWithZeroDonation()

    } else {
      totalDonationAmount = await userDao?.getSingleUserTotalDonation(userId)
    }
    const responseData = { totalUser, totalDonationAmount }
    
    if (userRole === "admin") {
      responseData.zeroDonationUsers = zeroDonationUserCount
    }
    return res?.status(200).json({ responseData })

  } catch (error) {
    return res?.status(500).json({ message: "Internal server error" })
  }
}


module.exports = { getTotalUserCount }