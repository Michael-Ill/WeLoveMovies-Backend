const knex = require("../db/connection");

function read(reviewId){
    return knex("reviews")
        .select("*")
        .where({ review_id: reviewId })
        .first()
}

function destroy(reviewId){
    return knex("reviews")
        .where({ review_id: reviewId })
        .del()
}

function update(updatedReview){
    return knex("reviews")
        .select("*")
        .where({ review_id: updatedReview.review_id })
        .update(updatedReview, "*")
}

function reviewWithCritic (reviewId){
    return knex("reviews as r")    
        .select("r.*", "c.*")
        .join("critics as c", "r.critic_id", "c.critic_id")
        .where({ "r.review_id": reviewId })
        .first();
}

module.exports = {
    read, 
    delete: destroy,
    update,
    reviewWithCritic,
}

