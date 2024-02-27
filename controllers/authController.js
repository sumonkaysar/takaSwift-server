const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { collections } = require("../mongoDBConfig/collections")
const { createDoc } = require("../mongoDBConfig/queries")

const signup = async (req, res) => {
    try {
        const { password, email, mobile, nid } = req.body;
        const user = await collections("users").findOne({ $or: [{ email }, { mobile }, { nid }] })
        if (!user?.email) {
            delete req.body.password
            const hashPassword = await bcrypt.hash(password, 10)
            const passResult = await collections("passwords").insertOne({ email, password: hashPassword })
            if (passResult) {
                const token = jwt.sign({ user: { email } }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '7d' })
                req.body.balance = "40"
                const userResult = await createDoc(req, collections("users"))
                if (userResult) {
                    const transactionResult = await collections("transactions").insertOne({email, amount: "40", type: "Signup Bonus"})
                    return res.status(200).json({ result: userResult, token, transactionResult })
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
        const { email, mobile, password } = req.body
        const user = await collections("users").findOne({ $or: [{ email }, { mobile }] })
        if (user?.email) {
            if (user.isLoggedIn) {
                const dbPassword = await collections("passwords").findOne({ email: user.email })
                const isMatched = await bcrypt.compare(password, dbPassword.password);
                if (isMatched) {
                    const token = jwt.sign({ user: { email } }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '7d' })
                    const result = await collections("passwords").updateOne({ email: user.email }, { $set: { isLoggedIn: true } })
                    return res.status(200).json({ message: "Logged in successfully", token, user })
                }
                return res.status(403).json({ error: "Password is incorrect" })
            }
            return res.status(403).json({ error: "You can't log in 2 devices" })
        }
        res.status(403).json({ error: "This email/mobile is not registered" })
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

const logOut = async (req, res) => {
    try {
        const { email } = req.decoded.user
        const result = await collections("passwords").updateOne({ email }, { $set: { isLoggedIn: false } })
        res.status(200).json({ message: 'You are logged out.', user })
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
            delete user.password
            return res.status(200).json({ message: 'You are logged in successfully', user })
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
    logOut,
}