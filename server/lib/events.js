const { Sequelize } = require("sequelize");
const { publicUserFields } = require("./util");

const events = async (
  req,
  res,
  sequelize,
  User,
  Event,
  Participant,
  Question,
  Answer
) => {
  const { token } = req.query;

  if (!token) {
    res.json({ response: "No token given" });
    return;
  }

  const user = await User.findOne({
    where: { loginToken: token },
  });

  if (!user) {
    res.json({ response: "User not found" });
    return;
  }

  const events = await Event.findAll({
    where: { userId: user.id },
    include: { model: Participant },
  });

  res.json(events);
};

module.exports = { events };
