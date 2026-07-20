const user = require("../../model/user.model")

const createUser = async (userData) => {
  return await user.create(userData)
}

const findUserByEmail = async ({ email }) => {
  return await user.findOne({ email })
}

const findUserById = async ( id ) => {
  return await user.findById(id, "name mobile email gender totalDonation role")
}

const updateUser = async ({ id, payload }) => {
  return await user.findByIdAndUpdate(id, payload, { new: true })
}

const findByResetToken = async ({ resetPasswordToken }) => {
  return await user.findOne({ resetPasswordToken, resetPasswordExpire: { $gt: Date.now() } })
}

const getUsersWithDonation = async ()=>{
  return await user.aggregate([
    {
      $match:{
        role:{$ne:"admin"}
      }
    },
    {
      $lookup:{
        from:"donations",
        let:{userId:"$_id"},
        pipeline:[
          {
            $match:{
              $expr:{
                $and:[
                  {$eq:["$userId", "$$userId"]},
                 { $eq:["$status", "success"]}
                ]
                
              }
            }
          },
          {$sort:{createdAt:-1}},
          {$limit:1},
          {
            $project:{
              _id:0,
              amount:1, 
              createdAt:1
            }
          }
        ],
        as: "lastDonation"
      }
    },
    {
      $project:{
        _id:1,
        name:1, 
        totalDonation:1,
        lastDonationAmount:{
          $ifNull:[
            {$arrayElemAt:["$lastDonation.amount", 0]},
            0
          ]
        },
        lastDonationDate :{
          $cond:{
            if:{
              $gt:[
                {$size:"$lastDonation"},
                0
              ]
            },
            then:{
              $dateToString:{
                format:"%d/%m/%Y",
                date:{
                  $arrayElemAt:["$lastDonation.createdAt", 0]
                }
              }
            },
            else:"-"
          }
        }
      }
    },
    {
      $sort:{name:1}
    }
  ])
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  updateUser,
  findByResetToken,
  getUsersWithDonation
}
