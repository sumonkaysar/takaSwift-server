const { collections } = require("../mongoDBConfig/collections")

const adminData = async (req, res) => {
  try {
    const money = await collections("totalMoney").find({}).toArray()
    const users = await collections("users").find({ role: "User" }).toArray()
    const agents = await collections("users").find({ role: "Agent" }).toArray()
    const admin = await collections("users").findOne({ role: "Admin" })
    const transactions = await collections("transactions").find({}).toArray()
    res.status(200).json({ totalMoney: money[0].grandTotal, totalUsers: users.length, totalAgents: agents.length, totalTransactions: transactions.length, adminBalance: admin?.balance || 0 })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: "Internal Server Error" })
  }
}

module.exports = {
  adminData
}