const { meUserFields } = require("./util");

const me = (req, res, User) => {
  const { token } = req.query;

  if (!token) {
    res.json({ response: "No token given" });
    return;
  }
  User.findOne({
    attributes: meUserFields,
    where: { loginToken: token },
  })
    .then(async (user) => {
      if (user) {
        await User.update(
          { onlineAt: Date.now() },
          { where: { loginToken: token } }
        );

        res.json(user);
      } else {
        const newUser = await User.create({ loginToken: token });

        const publicNewUser = await User.findOne({
          attributes: meUserFields,
          where: { loginToken: newUser.loginToken },
        });
        res.json(publicNewUser);
      }
    })
    .catch((e) => console.log(e));
};

module.exports = { me };
