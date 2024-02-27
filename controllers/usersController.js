const { ObjectId } = require('mongodb')
const {collections} = require("../mongoDBConfig/collections")
const { readDoc, updateDoc } = require("../mongoDBConfig/queries")

const getUsers = async (req, res) => {
  try {
    const users = await readDoc(collections("users"))
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

const getUserRole = async (req, res) => {
  try {
    const user = await collections("users").findOne({ email: req.query?.email })
    const role = user.role || "user"
    res.status(200).json({ role })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Internal Server Error' })
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

module.exports = {
  getUsers,
  updateUser,
  getUserRole,
  getOneUser,
}