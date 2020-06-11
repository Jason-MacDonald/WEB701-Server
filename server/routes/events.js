var express = require("express");
var router = express.Router();
const Event = require("../models/event");

const jwt = require("jsonwebtoken");

require("dotenv").config();

// ##### POST EVENT #####
router.post("/event", authenticateToken, (req, res) => {
  console.log(req.body);
  if (!req.body.name) {
    res.status(400);
    res.json({
      error: "Bad Data",
    });
  } else {
    req.body.email = req.user.email;

    Event.create(req.body)
      .then(() => {
        res.send("Event Added");
      })
      .catch((err) => {
        res.send("Error: " + err);
      });
  }
});

// ##### GET ALL EVENTS. #####
router.get("/events", (req, res) => {
  Event.findAll({ order: [["id", "DESC"]] })
    .then((events) => {
      res.json(events);
    })
    .catch((err) => {
      res.send("error: " + err);
    });
});

// ##### UPDATE EVENT #####
router.put("/event/:id", (req, res) => {
  if (!req.body.name) {
    res.status(400);
    res.json({
      error: "Bad Data",
    });
  } else {
    Event.update(
      { name: req.body.name, description: req.body.description },
      { where: { id: req.params.id } }
    )
      .then(() => {
        res.send("Event Updated");
      })
      .error((err) => res.send(err));
  }
});

// ##### DELETE EVENT #####
router.delete("/event/:id", (req, res) => {
  Event.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then(() => {
      res.send("Event Deleted");
    })
    .catch((err) => {
      res.send("Error: " + err);
    });
});

// ##### MIDDLEWARE #####
function authenticateToken(req, res, next) {
  console.log("Header: " + req.headers["authorization"]);
  const token = req.headers["authorization"];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

module.exports = router;
