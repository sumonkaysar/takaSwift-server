const { ObjectId } = require("mongodb")
const { collections } = require("../mongoDBConfig/collections")

const transactions = async (req, res) => {
  try {
    const { userType, id } = req.params
    if (userType === "agent") {
      const user = await collections("users").findOne({ _id: new ObjectId(id), role: "Agent" })
      const transactions = await collections("transactions").find({ $or: [{agent: user.email}, {reciever: user.email}] }).sort({ time: -1 }).toArray()
      res.status(200).json({ transactions, user })
    } else {
      const user = await collections("users").findOne({ _id: new ObjectId(id), role: "User" })
      const transactions = await collections("transactions").find({ $or: [{user: user.email}, {reciever: user.email}] }).sort({ time: -1 }).toArray()
      res.status(200).json({ transactions, user })
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: "Internal Server Error" })
  }
}

module.exports = {
  transactions,
}