const donation = require('../../model/donation.model');

const createDonation = async (donationData) => {
	return await donation.create(donationData);
}

const getDonationByUserId = async (userId) => {
	return await donation.find({ userId: userId }).sort({ createdAt: -1 });
}

// const getAllDonations = async () => {
// 	return await donation.find({}).populate('userId', 'name email totalDonation').sort({ createdAt: -1 });
// }

const getAllDonations = async () => {
  return await donation.aggregate([
    {
      // Step 1: Sabse pehle date ke hisab se descending sort karenge
      // Isse har user ka sabse LATEST donation record top par aa jayega
      $sort: { createdAt: -1 }
    },
    {
      // Step 2: Unique userId ke hisab se group karenge
      $group: {
        _id: "$userId", // Distinct by userId
        totalContributed: { $sum: "$amount" }, // Kul kitna donate kiya
        donationCount: { $sum: 1 }, // Kitni baar kiya
        
        // Kyunki humne upar sort kiya hai, toh $first lagane se 
        // sabse LATEST record ka amount aur date milega
        lastDonationAmount: { $first: "$amount" }, 
        lastDonationDate: { $first: "$createdAt" }
      }
    },
    {
      // Step 3: Users table se name aur email laana
      $lookup: {
        from: "users", 
        localField: "_id",
        foreignField: "_id",
        as: "userDetails"
      }
    },
    {
      $unwind: "$userDetails"
    },
    {
      // Step 4: Final output fields selection
      $project: {
        _id: 1,
        totalContributed: 1,
        donationCount: 1,
        lastDonationAmount: 1,
        lastDonationDate: 1,
        "userDetails.name": 1,
        "userDetails.email": 1
      }
    },
    {
      // Step 5: Highest total contribution wale ko pehle dikhana
      $sort: { totalContributed: -1 }
    }
  ]);
}

module.exports = {
	createDonation,
	getDonationByUserId,
	getAllDonations
}
