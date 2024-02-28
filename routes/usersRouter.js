const { getOneUser, updateUser, getUsersByRole, blockUser } = require("../controllers/usersController")
const { verifyAdmin } = require("../middlewares/verifyJWT")

const usersRouter = require("express").Router()

usersRouter.get("/", verifyAdmin, getUsersByRole)

usersRouter.get("/:id", getOneUser)

usersRouter.patch("/block/:id", blockUser)

usersRouter.patch("/:id", updateUser)

module.exports = usersRouter