const { Sequelize } = require("sequelize");
const { publicUserFields } = require("./util");

const participant = async (req, res, sequelize, Participant) => {
  const { participantToken } = req.query;

  const p = await Participant.findOne({ where: { participantToken } });
  res.json(p);
};

module.exports = { participant };
