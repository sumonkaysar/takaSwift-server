const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { collections } = require("../mongoDBConfig/collections")
const { createDoc } = require("../mongoDBConfig/queries")

const signup = async (req, res) => {
    try {
        const { pin, email, mobile, nid, time } = req.body;
        const user = await collections("users").findOne({ $or: [{ email }, { mobile }, { nid }] })
        if (!user?.email) {
            delete req.body.pin
            const hashPin = await bcrypt.hash(pin, 10)
            const pinResult = await collections("pins").insertOne({ email, pin: hashPin })
            if (pinResult) {
                const token = jwt.sign({ user: { email } }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '7d' })
                req.body.balance = req.body.role === "Agent" ? 100000 : 40
                const userResult = await createDoc(req, collections("users"))
                if (userResult) {
                    const bonusInfo = { [req.body.role === "Agent" ? "agent" : "reciever"]: email, amount: req.body.balance, type: "Signup Bonus", time }
                    const transactionResult = await collections("transactions").insertOne(bonusInfo)
                    return res.status(200).json({ status: 200, userResult, user: req.body, token, transactionResult })
                }
                return res.status(500).json({ error: "Account could not be created" })
            }
            res.status(500).json({ error: "Account could not be created" })
        } else {
            const userByEmail = await collections("users").findOne({ email })
            const userByMobile = await collections("users").findOne({ mobile })
            const userByNid = await collections("users").findOne({ nid })
            const errorType = {}
            if (userByEmail?.email) {
                errorType.email = "This email is already registered"
            }
            if (userByMobile?.email) {
                errorType.mobile = "This mobile is already registered"
            }
            if (userByNid?.email) {
                errorType.nid = "This NID is already registered"
            }
            res.status(403).json({ error: "Already registered", errorType })
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

const login = async (req, res) => {
    try {
        const { email, mobile, pin } = req.body
        const user = await collections("users").findOne({ $or: [{ email }, { mobile }] })
        if (user?.email) {
            const dbPin = await collections("pins").findOne({ email: user.email })
            const isMatched = await bcrypt.compare(pin, dbPin.pin);
            if (isMatched) {
                const token = jwt.sign({ user: { email } }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '7d' })
                return res.status(200).json({ status: 200, message: "Logged in successfully", token, user })
            }
            return res.status(403).json({ error: "PIN is incorrect" })
        }
        res.status(403).json({ error: "This email/mobile is not registered" })
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

const isLoggedIn = async (req, res) => {
    try {
        const { email } = req.decoded.user
        const user = await collections("users").findOne({ email })
        if (user?.email) {
            delete user.pin
            return res.status(200).json({ status: 200, message: 'You are logged in successfully', user })
        }
        res.status(403).json({ error: "This email is not registered" })
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

module.exports = {
    signup,
    login,
    isLoggedIn,
}