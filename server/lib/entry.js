const { Sequelize } = require("sequelize");
const { publicUserFields } = require("./util");

const entry = async (req, res, sequelize, User, Entry) => {
  const { id } = req.query;

  const theEntry = await Entry.findOne({
    where: { id },
  });
  res.json(theEntry);
};

module.exports = { entry };
