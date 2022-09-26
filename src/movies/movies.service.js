const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

function listMovies(isShowing) {
    if (isShowing === "true") {
        return knex("movies as m")
            .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
            .distinct("m.*")
            .where({ "mt.is_showing": true });
    }
    return knex("movies")
        .select("*");
}

function listTheaters(movieId) {
    return knex("theaters as t")
        .distinct("t.*", "mt.is_showing", "mt.movie_id")
        .join("movies_theaters as mt", "t.theater_id", "t.theater_id")
        .join("movies as m", "m.movie_id", "mt.movie_id")
        .where({ "m.movie_id": movieId })
        .andWhere({ "mt.is_showing": true })
}

const addCategory = mapProperties({
    critic_id: "critic.critic_id",
    preferred_name: "critic.preferred_name",
    surname: "critic.surname",
    organization_name: "critic.organization_name",
    created_at: "critic.created_at",
    updated_at: "critic.updated_at",
})

function addCriticToReview(reviews) {
    return reviews.map(review => addCategory(review))
}

function listReviews(movieId) {
    return knex("reviews as r")
        .join("critics as c", "c.critic_id", "r.critic_id")
        .select("r.*", "c.*")
        .where({ "r.movie_id": movieId })
        .then(reviews => addCriticToReview(reviews));
}

function read(movieId){
    return knex("movies")
        .select("*")
        .where({ "movie_id":movieId })
        .first();
}

module.exports = {
    listMovies,
    listTheaters,
    listReviews, 
    read,
}