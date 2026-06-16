const userDao = require("./user.dao")

const getTotalUserCount = async (req, res) => {
  try {
    const totalUser = await userDao?.getTotalUserCount()
    return res?.status(200).json({ totalUser })

  } catch (error) {
    return res?.status(500).json({ message: "Internal server error" })
  }
}


module.exports = { getTotalUserCount }