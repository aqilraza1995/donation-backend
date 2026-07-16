const userDao = require("./user.dao")
const donationDao = require("../donation/donation.dao")

const getTotalUserCount = async (req, res) => {
  try {
    const { id: userId, role: userRole } = req?.user

    const totalUser = await userDao?.getTotalUserCount()

    let totalDonationAmount = 0
    let zeroDonationUserCount = undefined
    let donationChartData = undefined

    if (userRole === "admin") {
      totalDonationAmount = await userDao?.getTotalPlatformDonation()

      zeroDonationUserCount = await userDao?.getUserWithZeroDonation()

      donationChartData = await donationDao?.getAllDonationsChartData(90)
      
    } else {
      totalDonationAmount = await userDao?.getSingleUserTotalDonation(userId)

      donationChartData = await donationDao?.getUserDonationChartData(userId, 90)
    }
    const responseData = { totalUser, totalDonationAmount, donationChartData }
    
    if (userRole === "admin") {
      responseData.zeroDonationUsers = zeroDonationUserCount
    }
    return res?.status(200).json({ responseData })

  } catch (error) {
    return res?.status(500).json({ message: "Internal server error" })
  }
}


module.exports = { getTotalUserCount }