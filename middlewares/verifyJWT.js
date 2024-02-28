const jwt = require("jsonwebtoken")

function verifyJWT(req, res, next, role) {
    const { authorization: authHeader } = req.headers
    if (!authHeader) {
        return res.status(401).send({ status: 401, error: 'Unauthorized access' })
    }
    if (authHeader.split(" ")[0] === role) {
        const token = authHeader.split(" ")[1]
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
            if (err) {
                return res.status(401).send({ status: 401, error: err.message })
            }
            req.decoded = decoded
            next()
        })
    } else {
        return res.status(401).send({ status: 401, error: 'Unauthorized access' })
    }
}

function verifyAdmin(req, res, next) {
    verifyJWT(req, res, next, "Admin")
}

function verifyAgent(req, res, next) {
    verifyJWT(req, res, next, "Agent")
}

function verifyUser(req, res, next) {
    verifyJWT(req, res, next, "Bearer")
}

module.exports = {
    verifyAgent,
    verifyAdmin,
    verifyUser,
}