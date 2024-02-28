const { accessAgent } = require("../controllers/agentsController");
const { verifyAdmin } = require("../middlewares/verifyJWT");

const agentsRouter = require("express").Router();

agentsRouter.patch("/:id", verifyAdmin, accessAgent)

module.exports = agentsRouter