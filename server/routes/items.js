var express = require("express");
var router = express.Router();
const Item = require("../models/item");

const jwt = require("jsonwebtoken");

require("dotenv").config();

// ##### POST ITEM #####
router.post("/item", authenticateToken, (req, res) => {
  if (!req.body.name) {
    res.status(400);
    res.json({
      error: "Bad Data",
    });
  } else {
    req.body.email = req.user.email;

    Item.create(req.body)
      .then(() => {
        res.send("Item Added");
      })
      .catch((err) => {
        res.send("Error: " + err);
      });
  }
});

// ##### GET ALL ITEMS #####
router.get("/items", (req, res) => {
  Item.findAll({ where: { active: true }, order: [["id", "DESC"]] })
    .then((items) => {
      res.json(items);
    })
    .catch((err) => {
      res.send("error: " + err);
    });
});

// ##### UPDATE ITEM #####
router.put("/item", (req, res) => {
  if (!req.body) {
    res.status(400);
    res.json({
      error: "Bad Data",
    });
  } else {
    Item.update(
      {
        active: req.body.active,
      },
      { where: { id: req.body.id } }
    )
      .then(() => {
        res.send("Item Updated");
      })
      .error((err) => res.send(err));
  }
});

// ##### DELETE ITEM #####
router.delete("/item/:id", (req, res) => {
  Item.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then(() => {
      res.send("Item Deleted");
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
