const reviewsService = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const mapProperties = require("../utils/map-properties");

const addCritic = mapProperties({
    preferred_name: "critic.preferred_name",
    surname: "critic.surname",
    organization_name: "critic.organization_name",
});

function appendCritic(critics) {
    const result = critics.map((critic) => addCritic(critic));
    return result;
}

async function reviewExists (req, res, next) {
    const review = await reviewsService.read(req.params.reviewId);

    if (review) {
        res.locals.review = review;
        return next();
    }
    //next({status: 404, message: "Review cannot be found."});
    res.status(404).send({ error: "Review cannot be found." });    
};


async function list(req, res, next) {
    const {movieId} = req.params;
    let listReviews;

    if (movieId) {
        listReviews = await reviewsService.listMovieId(movieId)
    } else {
        listReviews = await reviewsService.list()
    }
    listReviews = appendCritic(listReviews);
    res.json({data: listReviews });
}

async function update(req, res) {
    const updatedReview = { ...res.locals.review, ...req.body.data };
    await reviewsService.update(updatedReview);
    const reviewToReturn = await reviewsService.getReviewWithCritic(
      res.locals.review.review_id
    );
    console.log(reviewToReturn);
    res.json({ data: reviewToReturn });
  }

async function destroy(req, res, next) {
    const { reviewId } = req.params;
    await reviewsService.delete(reviewId);
    res.sendStatus(204);
};



module.exports = {
    list: asyncErrorBoundary(list),
    update: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(update)],
    delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
}