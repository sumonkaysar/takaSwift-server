const { signup, login, isLoggedIn} = require("../controllers/authController");
const { verifyUser } = require("../middlewares/verifyJWT");

const authRouter = require("express").Router();

authRouter.post("/signup", signup)

authRouter.post("/login", login)

authRouter.get("/isLoggedIn", verifyUser, isLoggedIn)

module.exports = authRouter