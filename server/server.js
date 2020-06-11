var express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");

var events = require("./routes/events");
var members = require("./routes/members");
var items = require("./routes/items");
var bids = require("./routes/bids");

var users = require("./routes/users");

var port = 3000;

var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api", events);
app.use("/api", members);
app.use("/api", items);
app.use("/api", users);
app.use("/api", bids);

// ##### TEST #####
app.get("/test", (req, res) => {
  res.send("test");
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
