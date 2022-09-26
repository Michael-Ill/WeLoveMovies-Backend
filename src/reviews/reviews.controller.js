const service = require("./reviews.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const mapProperties = require("../utils/map-properties");


async function reviewExists(req, res, next) {
    const { reviewId } = req.params;
    const reviewFound = await service.read(reviewId);
    if (reviewFound) {
        res.locals.review = reviewFound;
        return next();
    }
   next({ status: 404, message: `Review cannot be found.` });
}

const addCategory = mapProperties({
    preferred_name: "critic.preferred_name",
    surname: "critic.surname",
    organization_name: "critic.organization",
})

async function destroy(req, res, next) {
    const reviewId = req.params.reviewId;
    await service.delete(reviewId);
    res.sendStatus(204);
}

async function update(req, res) {
    const review = res.locals.review;
    const updatedReview = {
        ...req.body.data,
        review_id: review.review_id,
    }
    await service.update(updatedReview);
    const reviewWithCritic = await service.reviewWithCritic(review.review_id);
    const newReview = addCategory(reviewWithCritic);
    res.json({ data: newReview})
}

module.exports = {
update: [
    asyncErrorBoundary(reviewExists),
    asyncErrorBoundary(update)
],
delete: [
    asyncErrorBoundary(reviewExists),
    asyncErrorBoundary(destroy),
]
};