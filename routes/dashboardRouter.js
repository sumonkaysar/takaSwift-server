const { adminData } = require("../controllers/dashboardController");
const { verifyAdmin } = require("../middlewares/verifyJWT");

const dashboardRouter = require("express").Router();

dashboardRouter.get("/admin", verifyAdmin, adminData)

module.exports = dashboardRouter