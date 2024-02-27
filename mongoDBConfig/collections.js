const { client } = require("./mongoClient")

const DB = 'takaSwift';

const collections = (name) => client().db(DB).collection(name)

module.exports = {collections}