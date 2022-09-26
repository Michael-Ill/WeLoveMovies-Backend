const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const knex = require("../db/connection");
const reduceProperties = require("../utils/reduce-properties")

const reducedMovies = reduceProperties("theater_id" , {
    movie_id: ["movies", null, "movie_id"],
    title: ["movies", null, "title"],
    runtime_in_minutes: ["movies", null, "runtime_in_minutes"],
    rating: ["movies", null, "rating"],
    description: ["movies", null, "description"],
    image_url: ["movies", null, "image_url"],
    created_at: ["movies", null, "created_at"],
    updated_at: ["movies", null, "updated_at"],
    is_showing: ["movies", null, "is_showing"],
    theater_id: ["movies", null, "theater_id"]
});

function theatersAndMovies() {
    return knex("theaters as t")
        .select("t.*", "mt.is_showing", "mt.theater_id", "m.*")
        .join("movies_theaters as mt", "t.theater_id", "mt.theater_id")
        .join("movies as m", "m.movie_id", "mt.movie_id")
}

async function list(req, res) {
    const theatersFinal = await theatersAndMovies();
    const newTheatersFinal = reducedMovies((theatersFinal), null, 9);
    res.send({ data: newTheatersFinal })
};

module.exports = {
    list: [asyncErrorBoundary(list)],
};