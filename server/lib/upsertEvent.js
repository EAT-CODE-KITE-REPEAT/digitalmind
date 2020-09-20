const { publicUserFields } = require("./util");
const sgMail = require("@sendgrid/mail");

const upsertEvent = async (req, res, sequelize, User, Event, Participant) => {
  const {
    id,
    token,
    title,
    date,
    endDate,
    description,
    maxParticipants,
  } = req.body;

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
    already = await Event.findOne({ where: { id, userId: user.id } });
  }
  let event;
  if (already) {
    //update
    await Event.update(
      { title, date, endDate, description, maxParticipants },
      { where: { id } }
    );
    event = await Event.findOne({ where: { id } });

    //mail participants
    const participants = await Participant.findAll({ where: { eventId: id } });

    if (participants) {
      participants.forEach((participant) => {
        const msg = {
          to: participant.email,
          from: "bijlink@karsens.com",
          subject: "Bij.link - evenement aangepast",
          html: `Een evenement waar jij voor stond ingeschreven is gewijzigd:
      
${title}

Van: ${date}
Tot: ${endDate}

${description}

Klik <a href="https://bij.link/?id=${id}&token=${participant.participantToken}">hier</a> om je aanwezigheid aan te passen:

Mvg,

Bij.link`,
        };

        sgMail.send(msg).catch((e) => console.log(e.response.body));
      });
    }
  } else {
    event = await Event.create({
      title,
      date,
      endDate,
      description,
      maxParticipants,
      userId: user.id,
    });
  }

  res.json({ response: event });
};

module.exports = {
  upsertEvent,
};
