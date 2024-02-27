const { getUsers, getUserRole, getOneUser, updateUser } = require("../controllers/usersController")

const usersRouter = require("express").Router()

usersRouter.get("/", getUsers)

usersRouter.get("/role", getUserRole)

usersRouter.get("/:id", getOneUser)

usersRouter.patch("/:id", updateUser)

// usersRouter.delete("/:id", deleteUser)

module.exports = usersRouter