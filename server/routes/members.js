var express = require("express");
var router = express.Router();
const Member = require("../models/member");

const jwt = require("jsonwebtoken");

require("dotenv").config();

// ##### POST MEMBER #####
router.post("/member", (req, res) => {
  if (!req.body.name) {
    res.status(400);
    res.json({
      error: "Bad Data",
    });
  } else {
    Member.create(req.body)
      .then(() => {
        res.send("Member Added");
      })
      .catch((err) => {
        res.send("Error: " + err);
      });
  }
});

// ##### GET ALL MEMBERS #####
router.get("/members", (req, res) => {
  Member.findAll()
    .then((members) => {
      res.json(members);
    })
    .catch((err) => {
      res.send("Error: " + err);
    });
});

// ##### GET MEMBER #####
router.get("/member", authenticateToken, (req, res) => {
  console.log(req.user.email);
  Member.findOne({
    where: { email: req.user.email },
  })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      res.send("Error: " + err);
    });
});

// ##### UPDATE MEMBER #####
router.put("/member", authenticateToken, (req, res) => {
  if (!req.body.name) {
    res.status(400);
    res.json({
      error: "Bad Data",
    });
  } else {
    Member.update(
      { description: req.body.description },
      { where: { email: req.user.email } }
    )
      .then(() => {
        res.send("Member Updated");
      })
      .error((err) => res.send(err));
  }
});

// ##### DELETE MEMBER #####
router.delete("/member/:id", (req, res) => {
  Member.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then(() => {
      res.send("Member Deleted");
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
