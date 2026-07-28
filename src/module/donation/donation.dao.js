const mongoose = require("mongoose")
const donation = require('../../model/donation.model');

const createDonation = async (donationData) => {
  return await donation.create(donationData);
}

const getDonationByUserId = async (userId, { rowPerPage, skip, order, orderBy, page, search }) => {
  const sortOption = { [orderBy]: order === "asc" ? 1 : -1 }
  const matchCriteria = { userId: new mongoose.Types.ObjectId(userId) }
  const pipeline = [{ $match: matchCriteria }]

  if (search) {
    pipeline.push(
      {
        $addFields: {
          amountStr: { $toString: "$amount" },
          createdAtStr: {
            $dateToString: { format: "%d/%m/%Y", date: "$createdAt" }
          }
        }
      },
      {
        $match: {
          $or: [
            { amountStr: { $regex: search, $options: "i" } },
            { createdAtStr: { $regex: search, $options: "i" } }
          ]
        }
      }
    )
  }

  const [itemsResult, totalResult] = await Promise.all([
    donation?.aggregate([
      ...pipeline,
      { $sort: sortOption },
      { $skip: +skip },
      { $limit: +rowPerPage },
      { $project: { amount: 1, createdAt: 1 } }
    ]),
    donation.aggregate([...pipeline, { $count: "count" }])
  ])

  const items = itemsResult || []
  const total = totalResult[0]?.count || 0

  return { items, total, rowPerPage: +rowPerPage, page: +page }
}

const getDonations = (userId) => {
  return donation.find({ userId }, "amount createdAt").sort({ createdAt: -1 })
}

module.exports = {
  createDonation,
  getDonationByUserId,
  getDonations,
}
