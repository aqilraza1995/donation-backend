const userDao = require("./user.dao")
const donationDao = require("../donation/donation.dao")


const getUsersWithDonation = async (req, res) => {
  try {
    console.log("controller is call")
    const result = await userDao?.getUsersWithDonation()
    console.log("result ====> ", result)
    return res?.status(200).json({ data: result })
  } catch (error) {
    res?.status(500).json({ message: "Internal server Error" })
  }
}

// const getUsers = async(req, res)=>{
//   try {
//     const result = await donationDao?.getDonationByUserId()
//     return res?.status(200).json
//   } catch (error) {
//     res?.status(500).json({message:"Internal server Error"})
//   }
// }

module.exports = { getUsersWithDonation }