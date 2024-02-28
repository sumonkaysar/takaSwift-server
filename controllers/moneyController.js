const { collections } = require("../mongoDBConfig/collections")
const bcrypt = require('bcrypt');

const sendMoney = async (req, res) => {
  try {
    const { email, mobile, pin, amount, time, transactionId } = req.body
    const dbPin = await collections("pins").findOne({ email })
    const isMatched = await bcrypt.compare(pin, dbPin.pin);
    if (isMatched) {
      const user = await collections("users").findOne({ mobile, role: "User" })
      if (user?.mobile) {
        let updatedAmount = -amount
        if (amount > 100) {
          updatedAmount = -(amount + 5)
        }
        const senderBalance = await collections("users").updateOne({ email }, { $inc: { balance: updatedAmount } })
        const reciverBalance = await collections("users").updateOne({ mobile }, { $inc: { balance: amount } })
        const adminBalance = await collections("users").updateOne({ role: "Admin" }, { $inc: { balance: 5 } })
        const transaction = await collections("transactions").insertOne({ user: email, amount: updatedAmount, reciever: user.email, recievedAmount: amount, type: "Send Money", time, transactionId })
        const transaction2 = await collections("transactions").insertOne({ senderEmail: email, amount: 5, recieverEmail: user.email, recievedAmount: amount, type: "Admin Bonus", bonusFrom: "Send Money", time, transactionId })
        return res.status(200).json({ status: 200, message: "Money send successfully" })
      }
      return res.status(403).json({ error: "Could not find the user" })
    }
    return res.status(403).json({ error: "PIN is incorrect" })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: "Internal Server Error" })
  }
}

const cashIn = async (req, res) => {
  try {
    const { email, mobile, pin, amount, time, transactionId } = req.body
    const dbPin = await collections("pins").findOne({ email })
    const isMatched = await bcrypt.compare(pin, dbPin.pin);
    if (isMatched) {
      const user = await collections("users").findOne({ mobile, role: "User" })
      if (user?.mobile) {
        const agentBalance = await collections("users").updateOne({ email }, { $inc: { balance: -amount } })
        const reciverBalance = await collections("users").updateOne({ mobile }, { $inc: { balance: amount } })
        const transaction = await collections("transactions").insertOne({ agent: email, amount: -amount, reciever: user.email, recievedAmount: amount, type: "Cash In", time, transactionId })
        return res.status(200).json({ status: 200, message: "Cash in successful" })
      }
      return res.status(403).json({ error: "Could not find the user" })
    }
    return res.status(403).json({ error: "PIN is incorrect" })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: "Internal Server Error" })
  }
}

const cashOut = async (req, res) => {
  try {
    const { email, mobile, pin, amount, time, transactionId } = req.body
    const dbPin = await collections("pins").findOne({ email })
    const isMatched = await bcrypt.compare(pin, dbPin.pin);
    if (isMatched) {
      const agent = await collections("users").findOne({ mobile, role: "Agent" })
      if (agent?.mobile) {
        const userBalance = await collections("users").updateOne({ email }, { $inc: { balance: -(amount + amount * 0.015) } })
        const agentBalance = await collections("users").updateOne({ mobile }, { $inc: { balance: amount, income: amount * 0.01 } })
        const adminBalance = await collections("users").updateOne({ role: "Admin" }, { $inc: { balance: amount * 0.005 } })

        const transaction = await collections("transactions").insertOne({ user: email, amount: -(amount + amount * 0.015), reciever: agent.email, recievedAmount: amount, type: "Cash Out", time, transactionId })
        const transaction2 = await collections("transactions").insertOne({ senderEmail: email, amount: amount * 0.005, recievedAmount: amount, type: "Admin Bonus", bonusFrom: "Cash Out", time, transactionId })
        const transaction3 = await collections("transactions").insertOne({ agent: agent.email, amount: amount * 0.01, senderEmail: email, recievedAmount: amount, type: "Cash Out Income", time, transactionId })
        return res.status(200).json({ status: 200, message: "Cash Out successful" })
      }
      return res.status(403).json({ error: "Wrong Agent Number" })
    }
    return res.status(403).json({ error: "PIN is incorrect" })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: "Internal Server Error" })
  }
}

module.exports = {
  sendMoney,
  cashIn,
  cashOut,
}