const { collections } = require("../mongoDBConfig/collections");
const { updateDoc } = require("../mongoDBConfig/queries");

const accessAgent = async (req, res) => {
  try {
    const info = await updateDoc(req, collections("users"))
    res.status(200).json({info, status: 200})
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = {
  accessAgent
}