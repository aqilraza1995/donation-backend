const user = require("../../model/user.model")
const donation = require("../../model/donation.model")

const getUserCount = async () => {
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
    { $group: { _id: null, totalDonation: { $sum: "$totalDonation" } } }
  ])
  return result?.length ? result[0]?.totalDonation : 0
}

const getSingleUserTotalDonation = async (userId) => {
  const result = await user?.findById(userId).select("totalDonation")
  return result ? result?.totalDonation : 0
}

const getUserWithZeroDonation = async () => {
  return user.countDocuments({ totalDonation: 0 })
}

const getSingleUserDonationChartData = async (userId, days) => {
  const filter = { userId }

  if (days) {
    const fromDate = new Date()
    fromDate.setDate(fromDate.getDate() - days)
    filter.createdAt = { $gte: fromDate }
  }

  const donations = await donation.find(filter).sort({ createdAt: 1 })
  return donations?.map(item => ({ amount: item?.amount, date: item?.createdAt.toLocaleDateString("en-GB") }))
}

const getAllDonationChartData = async (days) => {
  const filter = {}
  if (days) {
    const fromDate = new Date()
    fromDate.setDate(fromDate.getDate() - days)
    filter.createdAt = { $gte: fromDate }
  }

  return await donation.aggregate([
    { $match: filter },
    {
      $group: {
        _id: { $dateToString: { format: "%d/%m/%Y", date: "$createdAt" } },
        amount: { $sum: "$amount" }
      }
    },
    { $project: { _id: 0, date: "$_id", amount: 1 } },
    { $sort: { date: 1 } }
  ])
}




module.exports = {
  getUserCount,
  getTotalPlatformDonation,
  getSingleUserTotalDonation,
  getUserWithZeroDonation,
  getSingleUserDonationChartData,
  getAllDonationChartData
}