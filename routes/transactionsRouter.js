const { transactions } = require("../controllers/transactionsController");
const { verifyAdmin } = require("../middlewares/verifyJWT");

const transactionsRouter = require("express").Router();

transactionsRouter.get("/:userType/:id", verifyAdmin, transactions)

module.exports = transactionsRouter