const { publicUserFields } = require("./util");
const sgMail = require("@sendgrid/mail");

const upsertEntry = async (req, res, sequelize, User, Entry) => {
  const { id, token, type, url, itemId, title, description } = req.body;

  if (!token) {
    res.json({ response: "No token given" });
    return;
  }

  const user = await User.findOne({
    attributes: publicUserFields,
    where: { loginToken: token },
  });

  if (!user) {
    res.json({ response: "User not found" });
    return;
  }
  let already;
  if (id) {
    already = await Entry.findOne({ where: { id, userId: user.id } });
  }
  let entry;
  if (already) {
    //update
    await Event.update(
      { title, type, url, itemId, description },
      { where: { id } }
    );
    entry = await Entry.findOne({ where: { id } });
  } else {
    entry = await Entry.create({
      title,
      description,
      type,
      url,
      itemId,
      userId: user.id,
    });
  }

  res.json({ response: entry });
};

module.exports = {
  upsertEntry,
};
