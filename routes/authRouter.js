const { signup, login, isLoggedIn} = require("../controllers/authController")

const authRouter = require("express").Router();

authRouter.post("/signup", signup)

authRouter.post("/login", login)

authRouter.get("/isLoggedIn", isLoggedIn)

module.exports = authRouter