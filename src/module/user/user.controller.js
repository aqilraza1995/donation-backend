const userDao = require("./user.dao")
const donationDao = require("../donation/donation.dao")


const getUsersWithDonation = async (req, res) => {
  try {
    
    const { page = 1, rowPerPage = 10, search = "", order = "asc", orderBy = "name" } = req?.query
    const result = await userDao?.getUsersWithDonation({
      page: +page,
      rowPerPage: +rowPerPage,
      search,
      order,
      orderBy
    })
    return res?.status(200).json( result )

  } catch (error) {
    res?.status(500).json({ message: "Internal server Error" })
  }
}

const getUserById = async (req, res) => {
  try {

    const { id } = req?.params
    const userDetails = await userDao?.findUserById(id)

    const donations = await donationDao?.getDonationByUserId(id)

    const result = { userDetails, donations }

    return res?.status(200).json(result)

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

module.exports = { getUsersWithDonation, getUserById }