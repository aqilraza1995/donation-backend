const dashboardDao = require("./dashboard.dao")

const getUserCount = async (req, res) => {
  try {
    const { id: userId, role: userRole } = req?.user

    const userCount = await dashboardDao.getUserCount()

    let totalDonationAmount = 0
    let zeroDonationUser = 0
    let donationChartData = undefined

    if (userRole === "admin") {
      totalDonationAmount = await dashboardDao.getTotalPlatformDonation()
      donationChartData = await dashboardDao.getAllDonationChartData(90)

    } else {
      totalDonationAmount = await dashboardDao.getSingleUserTotalDonation(userId)
      donationChartData = await dashboardDao?.getSingleUserDonationChartData(userId, 90)

    }

    const responeData = { userCount, totalDonationAmount, donationChartData }

    if (userRole === "admin") {
      responeData.zeroDonationUser = await dashboardDao.getUserWithZeroDonation()
    }

    return res?.status(200).json(responeData)

  } catch (error) {
    return res.status(500).json({ message: "Internal server error" })
  }
}

const getDonationChartDataByDateRange = async (req, res) => {
  try {
    const { id: userId, role: userRole } = req?.user
    let donationChartData = []
    const days = Number(req.query.days);

    console.log("days =======> ", days)

    if (userRole === "admin") {
      donationChartData = await dashboardDao?.getAllDonationChartData(days)
    }
    else {
      donationChartData = await dashboardDao?.getSingleUserDonationChartData(userId, days)
    }

    return res?.status(200).json({ data: donationChartData })

  } catch (error) {
    return res?.status(500).json({ message: "Internal server error" })
  }
}

module.exports = { getUserCount, getDonationChartDataByDateRange }