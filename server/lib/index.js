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

class Entry extends Model {}

Entry.init(
  {
    title: DataTypes.STRING,
    type: DataTypes.STRING,
    url: DataTypes.STRING,
    itemId: DataTypes.STRING,
    description: DataTypes.STRING,
    userId: DataTypes.INTEGER,
  },
  {
    sequelize,
    modelName: "entry",
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
  require("./updateProfile").updateProfile(req, res, sequelize, User, Entry)
);

server.post("/changePassword", (req, res) =>
  require("./changePassword").changePassword(req, res, User)
);

server.post("/login", (req, res) => require("./login").login(req, res, User));

server.post("/signup", (req, res) =>
  require("./signup").signup(req, res, User)
);

// events
server.post("/upsertEntry", (req, res) =>
  require("./upsertEntry").upsertEntry(req, res, sequelize, User, Entry)
);

server.get("/entry", (req, res) =>
  require("./entry").entry(req, res, sequelize, User, Entry)
);

server.get("/entries", (req, res) =>
  require("./entries").entries(req, res, sequelize, User, Entry)
);

server.post("/deleteEntry", (req, res) =>
  require("./deleteEntry").deleteEntry(req, res, sequelize, User, Entry)
);

// create server

const port = process.env.PORT || 4006;

server.get("/", (req, res) => {
  res.send(listEndpoints(server));
});

http
  .createServer(server)
  .listen(port, () => console.log(`Server listening on localhost ${port}`));
