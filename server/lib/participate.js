const { publicUserFields, isEmail } = require("./util");
const fetch = require("node-fetch");
const sgMail = require("@sendgrid/mail");

const participate = async (
  req,
  res,
  sequelize,
  User,
  Event,
  Participant,
  Question,
  Answer
) => {
  const {
    eventId,
    name,
    email,
    attendance,
    reason,
    participantToken,
  } = req.body;

  if (eventId && name && email && isEmail(email) && attendance !== undefined) {
    if (participantToken) {
      const [updated] = await Participant.update(
        {
          name,
          email,
          attendance,
          eventId,
          reason,
        },
        { where: { participantToken } }
      );

      if (updated) {
        const participant = await Participant.findOne({
          where: { participantToken },
        });
        res.json({ response: participant });
      }
    } else {
      const event = await Event.findOne({ where: { id: eventId } });
      if (!event) {
        res.json({ response: "Event niet gevonden" });
        return;
      }

      const newParticipantToken = Math.round(
        Math.random() * Number.MAX_SAFE_INTEGER
      );
      const user = await User.findOne({ where: { id: event.userId } });
      const participant = await Participant.create({
        name,
        email,
        attendance,
        eventId,
        reason,
        participantToken: newParticipantToken,
      });

      const participateText =
        attendance === 2
          ? "te komen"
          : attendance === 1
          ? "misschien te komen "
          : "niet te komen";

      if (user.pushtoken) {
        console.log("Send push to ", user.pushtoken);

        fetch("https://exp.host/--/api/v2/push/send", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: user.pushtoken,
            title: `${name} heeft zijn beschikbaarheid opgegeven`,
            body: `${name} heeft aangegeven ${participateText}. ${reason}`,
          }),
        })
          .then((result) => console.log("result", result.status))
          .catch((e) => console.log("err", e));
      }

      //mail
      const msg = {
        to: email,
        from: "bijlink@karsens.com",
        subject: "Bij.link",
        html: `Je hebt aangegeven ${participateText} op ${event.title}. Om dit te wijzigen, klik <a href="https://bij.link/?id=${event.id}&token=${newParticipantToken}">hier</a>`,
      };
      sgMail.send(msg);

      res.json({ response: participant });
      return;
    }
  }

  res.json({ response: null });
};

module.exports = {
  participate,
};
