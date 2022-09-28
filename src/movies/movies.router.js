const router = require("express").Router();
const controller = require("./movies.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");
const reviewRouter = require("../reviews/reviews.router");
const theatherRouter = require("../theaters/theaters.router");


router.use("/:movieId/reviews", controller.movieExists, reviewRouter);
router.use("/:movieId/theaters", controller.movieExists, theatherRouter);

router.route("/:movieId([0-9]+)").get(controller.read).all(methodNotAllowed);
router.route("/").get(controller.list).all(methodNotAllowed);

module.exports = router;
