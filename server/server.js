const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const compression = require("compression");
const path = require("path");
const rootDirectory = path.join(__dirname, "./");

const config = {
  angularStaticDirectory: path.join(rootDirectory, "./dist"),
  PORT: 8080
};

const app = express();

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: "false" }));
app.use(express.static(config.angularStaticDirectory));

app.all("*", function(req, res, next) {
  // Just send the index.html for other files to support HTML5Mode
  console.log(config.angularStaticDirectory);
  res.sendFile("index.html", { root: config.angularStaticDirectory });
});

app.set("port", config.PORT);

const server = http.createServer(app);

server.listen(config.PORT);
server.on("listening", onListening);

function onListening() {
  console.debug("Listening on " + config.PORT);
}
