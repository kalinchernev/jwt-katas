const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const expressjwt = require("express-jwt");
const jwt = require("jsonwebtoken");

const app = express();
const port = process.env.port || 3000;

const secret = "mysupersecret";
const users = [{ id: 1, username: "admin", password: "admin" }];

app.use(bodyParser.json());

const jwtCheck = expressjwt({ secret });

app.use(cors());

app.get("/", (req, res) => {
  res.status(200).send("main");
});

app.get("/resource", (req, res) => {
  res.status(200).send("Public resource");
});

app.get("/resource/secret", jwtCheck, (req, res) => {
  res.status(200).send("Secret rsource, you should be logged in to see this.");
});

app.post("/login", (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res
      .status(400)
      .send("You need to pass both username and password fields.");
  }
  const user = users.find(u => {
    return u.username === req.body.username && u.password === req.body.password;
  });

  if (!user) {
    return res.status(401).send(`User ${req.body.username} is not found.`);
  }

  const token = jwt.sign(
    {
      sub: user.id,
      username: user.username
    },
    secret,
    { expiresIn: "3 hours" }
  );

  res.status(200).send({ access_token: token });
});

app.get("*", (req, res) => {
  res.status(404).send("Sorry, can't find that!");
});

app.listen(port, () => console.log(`Server at ${port}`));
