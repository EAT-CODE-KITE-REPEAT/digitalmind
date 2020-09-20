const { publicUserFields, meUserFields } = require("./util");

const deleteEvent = async (
  req,
  res,
  sequelize,
  User,
  Event,
  Participant,
  Question,
  Answer
) => {
  const { id, token } = req.body;

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

  const event = await Event.findOne({ where: { id, userId: user.id } });
  const destroyed = await event.destroy();

  res.json({ response: destroyed });
};

module.exports = {
  deleteEvent,
};
