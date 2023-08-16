require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fileUpload = require("express-fileupload");

// create express app
const app = express();

// Allow File Size
app.use(fileUpload());
app.use(express.json({ limit: "50mb", type: "application/json" }));
app.use(
  express.urlencoded({
    limit: "50mb",
    extended: true,
  })
);
app.use(
  cors(
    {
    origin: "*",
  }
  )
);
app.use("/media", express.static(path.join(__dirname, "./uploads")));

require("./bootstrapApplication").bootstrap(app);
app.get("/", function (req, res, next) {
  res.send("HELLO WORD");
});

// listen for requests
var port = process.env.PORT || 3012;
app.listen(port, () => {
  console.log(`Hi!!! Server is listening on port ${port}`);
});
