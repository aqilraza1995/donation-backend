const donation = require('../../model/donation.model');

const createDonation = async (donationData) => {
  return await donation.create(donationData);
}

const getDonationByUserId = async (userId) => {
  return await donation.find({ userId: userId }, "amount createdAt").sort({ createdAt: -1 });
}

const getDonations = (userId) => {
  return donation.find({ userId }, "amount createdAt").sort({ createdAt: -1 })
}

module.exports = {
  createDonation,
  getDonationByUserId,
  getDonations,
}
