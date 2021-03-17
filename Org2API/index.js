const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const fabric = require("./fabric/controller.js");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => res.send("My first REST API!"));
app.post("/enroll-admin", fabric.enrollAdmin);
app.post("/register-user", fabric.registerEnrollUser);
app.put("/vaccine", fabric.changestatus);
app.get("/get", fabric.getByID);


const port = 8000;
app.listen(port, () => {
  console.log("Listening on port " + port);
});
