const { publicUserFields, meUserFields } = require("./util");

const deleteEntry = async (req, res, sequelize, User, Entry) => {
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

  const entry = await Entry.findOne({ where: { id, userId: user.id } });
  const destroyed = await entry.destroy();

  res.json({ response: destroyed });
};

module.exports = {
  deleteEntry,
};
