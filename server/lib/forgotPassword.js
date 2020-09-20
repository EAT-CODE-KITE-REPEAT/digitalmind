const sgMail = require("@sendgrid/mail");

const forgotPassword = async (req, res, User) => {
  const { email, fid } = req.body;

  const user = await User.findOne({ where: { email, fid } });

  const EMAIL_FROM = "info@mindmirror.co";

  if (user) {
    const forgotPasswordToken = Math.round(Math.random() * 999999999);

    const msg = {
      to: email,
      from: EMAIL_FROM,
      subject: "Reset password mindmirror.co",
      text: `Click the link to reset your password: https://mindmirror.co/recoverPassword/${forgotPasswordToken}`,
    };

    User.update({ forgotPasswordToken }, { where: { id: user.id } });

    //ES6
    sgMail.send(msg).then(() => {
      res.json({ response: "Check your email to reset your password" });
    }, console.error);
  } else {
    res.json({ response: "Email not found" });
  }
};

const forgotPassword2 = async (req, res) => {
  const { token, password } = req.body;

  const updated = await Users.update(
    { password },
    { where: { forgotPasswordToken: token } }
  );

  if (updated === 1) {
    res.json({ success: "Wachtwoord is changed" });
  } else {
    res.json({ error: "Email/token not found" });
  }
};

module.exports = { forgotPassword, forgotPassword2 };
