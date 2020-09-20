const { publicUserFields, meUserFields } = require("./util");

const updateProfile = async (req, res, sequelize, User, Entry) => {
  const {
    id,
    token,
    email,
    name,
    username,
    image,
    thumbnail,
    bio,
    password,
    pushtoken,
  } = req.body;

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

  const fields = {};

  if (email) {
    fields.email = email;
  }
  if (name) {
    fields.name = name;
  }
  if (username) {
    fields.username = username;
  }
  if (image) {
    fields.image = image;
  }
  if (thumbnail) {
    fields.thumbnail = thumbnail;
  }
  if (bio) {
    fields.bio = bio;
  }
  if (password) {
    fields.password = password;
  }
  if (pushtoken) {
    fields.pushtoken = pushtoken;
  }
  //update

  await User.update(fields, { where: { id: user.id } });
  const newUser = await User.findOne({
    attributes: meUserFields,
    where: { id: user.id },
  });

  res.json({ user: newUser });
};

module.exports = {
  updateProfile,
};
