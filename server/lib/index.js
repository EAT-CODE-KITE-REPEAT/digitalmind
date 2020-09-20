const express = require("express");
const server = express();
const body_parser = require("body-parser");
const sgMail = require("@sendgrid/mail");
var http = require("http");
const listEndpoints = require("express-list-endpoints");

const { Sequelize, Model, DataTypes, Op } = require("sequelize");

require("dotenv").config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

var cors = require("cors");

const sequelize = new Sequelize({
  dialect: "mysql",
  database: process.env.DB_DB,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  dialectOptions: {
    host: process.env.DB_HOST,
    port: "3306",
  },
  logging: null,
});

class User extends Model {}

User.init(
  {
    loginToken: DataTypes.STRING,
    activated: DataTypes.BOOLEAN,
    level: DataTypes.INTEGER,
    email: DataTypes.STRING,
    name: DataTypes.STRING,
    username: DataTypes.STRING,
    image: DataTypes.STRING,
    thumbnail: DataTypes.STRING,
    bio: DataTypes.STRING,
    password: DataTypes.STRING,
    onlineAt: DataTypes.BIGINT,
    pushtoken: DataTypes.STRING,
  },
  { sequelize, modelName: "user" }
);

class Event extends Model {}

Event.init(
  {
    title: DataTypes.STRING,
    date: DataTypes.STRING,
    endDate: DataTypes.STRING,
    description: DataTypes.STRING,
    maxParticipants: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
  },
  {
    sequelize,
    modelName: "event",
  }
);

class Participant extends Model {}

Participant.init(
  {
    eventId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    attendance: DataTypes.TINYINT,
    participantToken: DataTypes.BIGINT,
  },
  {
    sequelize,
    modelName: "participant",
  }
);

Participant.belongsTo(Event, {
  foreignKey: "eventId",
});
Event.hasMany(Participant, {
  foreignKey: "eventId",
});

class Question extends Model {}

Question.init(
  {
    eventId: DataTypes.INTEGER,
    question: DataTypes.STRING,
    type: DataTypes.TINYINT,
    answers: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: "question",
  }
);

class Answer extends Model {}

Answer.init(
  {
    eventId: DataTypes.INTEGER,
    questionId: DataTypes.INTEGER,
    participantId: DataTypes.INTEGER,
    answer: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: "answer",
  }
);

try {
  sequelize
    .sync({ alter: true })
    .then(() => {
      console.log("synced");
    })
    .catch((e) => console.log(e));
} catch (e) {
  console.log("e", e);
}
server.use(body_parser.json({ limit: "10mb", extended: true }));
server.use(body_parser.urlencoded({ limit: "10mb", extended: true }));

server.use(
  cors({
    origin: "*",
    "Access-Control-Allow-Origin": "*",
    optionsSuccessStatus: 200,
  })
);

server.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

server.use("/images", express.static("images"));
server.use("/uploads", express.static("uploads"));

/** ENDPOINTS  */

server.get("/me", (req, res) => require("./me").me(req, res, User));

server.post("/forgotPassword", (req, res) =>
  require("./forgotPassword").forgotPassword(req, res, User)
);

server.post("/forgotPassword2", (req, res) =>
  require("./forgotPassword").forgotPassword2(req, res, User)
);

server.post("/updateProfile", (req, res) =>
  require("./updateProfile").updateProfile(req, res, sequelize, User, Event)
);

server.post("/changePassword", (req, res) =>
  require("./changePassword").changePassword(req, res, User)
);

server.post("/login", (req, res) => require("./login").login(req, res, User));

server.post("/signup", (req, res) =>
  require("./signup").signup(req, res, User)
);

// events
server.post("/upsertEvent", (req, res) =>
  require("./upsertEvent").upsertEvent(
    req,
    res,
    sequelize,
    User,
    Event,
    Participant
  )
);

server.get("/autocomplete", (req, res) =>
  require("./autocomplete").autocomplete(req, res, sequelize)
);

server.post("/participate", (req, res) =>
  require("./participate").participate(
    req,
    res,
    sequelize,
    User,
    Event,
    Participant,
    Question,
    Answer
  )
);

server.get("/event", (req, res) =>
  require("./event").event(
    req,
    res,
    sequelize,
    User,
    Event,
    Participant,
    Question,
    Answer
  )
);

server.get("/participant", (req, res) =>
  require("./participant").participant(req, res, sequelize, Participant)
);

server.get("/events", (req, res) =>
  require("./events").events(
    req,
    res,
    sequelize,
    User,
    Event,
    Participant,
    Question,
    Answer
  )
);

server.post("/deleteEvent", (req, res) =>
  require("./deleteEvent").deleteEvent(
    req,
    res,
    sequelize,
    User,
    Event,
    Participant,
    Question,
    Answer
  )
);

// create server

const port = process.env.PORT || 4005;

server.get("/", (req, res) => {
  res.send(listEndpoints(server));
});

http
  .createServer(server)
  .listen(port, () => console.log(`Server listening on localhost ${port}`));
