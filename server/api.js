const Router = require("express").Router;
const router = Router();


router.get("/", (req, res, next) => {
  res.send("API ROUTE ENABLED");
});

module.exports = router;