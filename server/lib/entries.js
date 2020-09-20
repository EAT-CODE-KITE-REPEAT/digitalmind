const { Sequelize } = require("sequelize");
const { publicUserFields } = require("./util");

const entries = async (req, res, sequelize, User, Entry) => {
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

  const allEntries = await Entry.findAll({
    where: { userId: user.id },
  });

  res.json(allEntries);
};

module.exports = { entries };
