var express = require("express");
var router = express.Router();
const User = require("../models/user");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const webpush = require('web-push');

require("dotenv").config();

webpush.setVapidDetails(
  "mailto:jasonmacdonald@hotmail.com",
  process.env.PUBLIC_SUBSCRIPTION_KEY,
  process.env.PRIVATE_SUBSCRIPTION_KEY
);

// ##### POST PUSH SUBSCRIPTION #####
router.put("/users/account/subscribe", authenticateToken, (req, res) => {

  console.log(req.body);
  if(!req.body.endpoint) {
    res.status(400);
    res.json({
      error: "Bad Data",
    });
  }
  else {
    User.update({
      endpoint: req.body.endpoint,
      expirationTime: req.body.expirationTime,
      p256dh: req.body.keys.p256dh,
      auth: req.body.keys.auth}, 
      {where: {email: req.user.email}})
      .then(() => {
        res.send("Subscription Updated");
      })
      .error((err) => res.send(err));
    }
  }
);

// ##### UNSUBSCRIBE FROM PUSH NOTIFICATIONS #####
router.put("/users/account/unsubscribe", authenticateToken, (req, res) => {
console.log("here");
  User.update({
    endpoint: null,
    expirationTime: null,
    p256dh: null,
    auth: null}, 
    {where: {email: req.user.email}})
    .then(() => {
      res.send("Subscription Deleted");
    })
    .error((err) => res.send(err)); 
  }
);

// ##### TRIGGER PUSH #####
router.post("/users/trigger-push", (req, res) => {
  User.findAll()
  .then(users => {
     console.log(users.length)

     users.forEach(user => {
       if(user.endpoint != null) {
          let data = {
            "notification": {
              "title": "NGC Update",
              "body": "This is a message from NGC going out to all push subscribed"
            } 
          }

          let subscription = {
            "endpoint": user.endpoint,
            "keys": {
              "p256dh": user.p256dh,
              "auth": user.auth
            }
          }

          webpush.sendNotification(subscription, JSON.stringify(data))
          .then(result => {
            console.log(result);
            res.sendStatus(result.statusCode);
            
          })
          .catch(err => {
            console.log ("##### " + err.statusCode + ": " + err);   
          })
        }
      })
    }
  )
});


router.put("/users/account/update", (req, res) => {
  if (!req.body.name) {
    res.status(400);
    res.json ({ error: "Bad Data"});
  } 
  else {
      User.update({ name: req.body.name }, { where: { id: req.body.id } })
      .then(() => {
        res.send("User Updated");
      })
      .error((err) => res.send(err));
  }
});

// ##### POST USER #####
router.post("/users/register", (req, res) => {
  const userData = {
    name: "",
    email: req.body.email,
    password: req.body.password,
    type: "User",
  };

  User.findOne({
    where: { email: req.body.email },
  })
    .then((user) => {
      if (!user) {
        //10? generates salt for hashed password.
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          userData.password = hash;
          User.create(userData)
            .then((user) => {
              res.json({ status: user.email + " registered" });
            })
            .catch((err) => {
              res.send("error: " + err);
            });
        });
      } else {
        res.json({ error: "User already exists" });
      }
    })
    .catch((err) => {
      res.send("error: " + err);
    });
});

router.post("/users/login", (req, res) => {
  User.findOne({
    where: { email: req.body.email },
  })
    .then((user) => {
      if (user) {
        if (bcrypt.compareSync(req.body.password, user.password)) {
          let accessToken = jwt.sign(
            user.dataValues,
            process.env.ACCESS_TOKEN_SECRET
          );
          res.send(accessToken);
        } else {
          res.status(400).json({ error: "Incorrect details." });
        }
      } else {
        res.status(400).json({ error: "User does not exist" });
      }
    })
    .catch((err) => {
      res.status(400).json({ error: err });
    });
});

// ##### GET ALL USERS #####
router.get("/users", (req, res) => {
  User.findAll()
    .then((users) => {
      res.json(users);
    })
    .catch((err) => {
      res.send("Error: " + err);
    });
});

// ##### GET USER #####
router.get("/users/account", authenticateToken, (req, res) => {
  console.log(req.user.email);
  User.findOne({
    where: { email: req.user.email },
  })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      res.send("Error: " + err);
    });
});

// ##### UPDATE USER #####
router.put("/users/account/update", (req, res) => {
  console.log(req.body.name);
  if (!req.body.name) {
    res.status(400);
    res.json({
      error: "Bad Data",
    });
  } else {
    User.update({ name: req.body.name }, { where: { id: req.body.id } })
      .then(() => {
        res.send("User Updated");
      })
      .error((err) => res.send(err));
  }
});

// ##### DELETE USER #####
router.delete("/user/:id", (req, res) => {
  User.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then(() => {
      res.send("User Deleted");
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
