var express = require("express");
var router = express.Router();
const Bid = require("../models/bid");

const jwt = require("jsonwebtoken");

require("dotenv").config();

// ##### POST BID #####
router.post("/bid", authenticateToken, (req, res) => {
  console.log(req.body);
  if (!req.body.itemID) {
    res.status(400);
    res.json({
      error: "Bad Data",
    });
  } else {
    req.body.email = req.user.email;
    req.body.userID = req.user.id;

    console.log(req.body);
    Bid.create(req.body)
      .then(() => {
        res.send("Bid Added");
      })
      .catch((err) => {
        res.send("Error: " + err);
      });
  }
});

// ##### GET ALL BIDS. #####
router.get("/bids/:id", (req, res) => {
  console.log(req.params.id);
  Bid.findAll({ where: { itemID: req.params.id }, order: [["bid", "DESC"]] })
    .then((bids) => {
      res.json(bids);
    })
    .catch((err) => {
      res.send("error: " + err);
    });
});

// // ##### UPDATE EVENT #####
// router.put("/event/:id", (req, res) => {
//   if (!req.body.name) {
//     res.status(400);
//     res.json({
//       error: "Bad Data",
//     });
//   } else {
//     Event.update(
//       { name: req.body.name, description: req.body.description },
//       { where: { id: req.params.id } }
//     )
//       .then(() => {
//         res.send("Event Updated");
//       })
//       .error((err) => res.send(err));
//   }
// });

// // ##### DELETE EVENT #####
// router.delete("/event/:id", (req, res) => {
//   Event.destroy({
//     where: {
//       id: req.params.id,
//     },
//   })
//     .then(() => {
//       res.send("Event Deleted");
//     })
//     .catch((err) => {
//       res.send("Error: " + err);
//     });
// });

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
