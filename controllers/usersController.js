const { ObjectId } = require('mongodb')
const { collections } = require("../mongoDBConfig/collections")
const { updateDoc } = require("../mongoDBConfig/queries")

const getUsersByRole = async (req, res) => {
  try {
    const { role } = req.query
    const users = await collections("users").find({ role }).toArray()
    res.status(200).json(users)
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

const updateUser = async (req, res) => {
  try {
    const result = await updateDoc(req, collections("users"))
    res.status(200).json(result)
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

const getOneUser = async (req, res) => {
  try {
    const id = req.params.id;

    const user = await collections("users").findOne({ _id: ObjectId(id) })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

const blockUser = async (req, res) => {
  try {
    const info = await updateDoc(req, collections("users"))
    res.status(200).json({info, status: 200})
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

const searchUser = async (req, res) => {
  try {
    const { mobile } = req.query
    const user = await collections("users").findOne({ mobile: { '$regex': mobile, '$options': 'i' }, role: "User" })
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
  getUsersByRole,
  updateUser,
  getOneUser,
  blockUser,
  searchUser,
}