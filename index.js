const express = require("express")
const cors = require("cors")
const { connect } = require("./mongoDBConfig/mongoClient");

// routes
const usersRouter = require("./routes/usersRouter");
const authRouter = require("./routes/authRouter");

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
        })
        .catch((err) => console.log(err));
} catch (err) {
    console.log(err);
}

app.get("/", (_, res) => {
    res.send("Server is running");
});

app.listen(port, () => console.log("Server is running on port:", port));