const { Sequelize } = require("sequelize");
const { publicUserFields } = require("./util");

const event = async (
  req,
  res,
  sequelize,
  User,
  Event,
  Participant,
  Question,
  Answer
) => {
  const { id } = req.query;

  const event = await Event.findOne({
    where: { id },
    include: { model: Participant },
  });
  res.json(event);
};

module.exports = { event };
