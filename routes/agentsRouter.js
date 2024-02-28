const { accessAgent, searchAgent } = require("../controllers/agentsController");
const { verifyAdmin } = require("../middlewares/verifyJWT");

const agentsRouter = require("express").Router();

agentsRouter.patch("/:id", verifyAdmin, accessAgent)

agentsRouter.get("/search", verifyAdmin, searchAgent)

module.exports = agentsRouter