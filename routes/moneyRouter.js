const { sendMoney, cashIn, cashOut } = require("../controllers/moneyController")
const { verifyUser, verifyAgent } = require("../middlewares/verifyJWT")

const moneyRouter = require("express").Router()

moneyRouter.post("/send", verifyUser, sendMoney)

moneyRouter.post("/cashIn", verifyAgent, cashIn)

moneyRouter.post("/cashOut", verifyUser, cashOut)

module.exports = moneyRouter