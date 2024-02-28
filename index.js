const express = require("express")
const cors = require("cors")
const { connect } = require("./mongoDBConfig/mongoClient");

// routes
const usersRouter = require("./routes/usersRouter");
const authRouter = require("./routes/authRouter");
const moneyRouter = require("./routes/moneyRouter");
const agentsRouter = require("./routes/agentsRouter");
const transactionsRouter = require("./routes/transactionsRouter");
const dashboardRouter = require("./routes/dashboardRouter");

const port = process.env.PORT || 5000;

// middlewares
const app = express();
app.use(cors())
app.use(express.json())

try {
    connect()
        .then(() => {
            // users routes
            app.use("/users", usersRouter);

            // authentication and authorization routes
            app.use("/auth", authRouter);

            // money operation routes
            app.use("/money", moneyRouter);

            // agents operation routes
            app.use("/agents", agentsRouter);

            // transactions routes
            app.use("/transactions", transactionsRouter);

            // dashboard routes
            app.use("/dashboard", dashboardRouter);
        })
        .catch((err) => console.log(err));
} catch (err) {
    console.log(err);
}

app.get("/", (_, res) => {
    res.send("Server is running");
});

app.listen(port, () => console.log("Server is running on port:", port));