const knex = require("../db/connection");

function list() {
  return knex("theaters as t")
    .join("movies_theaters as mt", "mt.theater_id", "t.theater_id")
    .join("movies as m", "m.movie_id", "mt.movie_id")
    .select("t.*", "m.*");
};

function listMovieId(movieId) {
    return knex("theaters as t")
    .join("movies_theaters as mt", "t.theater_id", "mt.theater_id")
    .join("movies as m", "m.movie_id", "mt.movie_id")
    .select("t.*", "mt.is_showing", "mt.movie_id", "mt.created_at", "mt.updated_at")
    .where({ "mt.movie_id": movieId});
}

module.exports = {
  list,
  listMovieId,
};
