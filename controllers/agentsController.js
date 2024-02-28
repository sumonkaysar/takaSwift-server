const { collections } = require("../mongoDBConfig/collections");
const { updateDoc } = require("../mongoDBConfig/queries");

const accessAgent = async (req, res) => {
  try {
    const info = await updateDoc(req, collections("users"))
    res.status(200).json({ info, status: 200 })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

const searchAgent = async (req, res) => {
  try {
    const { mobile } = req.query
    const user = await collections("users").findOne({ mobile: { '$regex': mobile, '$options': 'i' }, role: "Agent" })
    if (user?.email) {
      return res.status(200).json({ user, status: 200 })
    }
    res.status(404).json({ error: 'Not Found' });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = {
  accessAgent,
  searchAgent
}