const movieService = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function movieExists(req, res, next) {
    const { movieId } = req.params;
    const movie = await movieService.read(movieId);

    if (movie) {
        res.locals.movie = movie;
        return next();
    }
    // next({status: 404, message: "Movie cannot be found."});
    res.status(404).send({ error: "Movie cannot be found." })

};

async function list(req, res, next) {
    const { is_showing } = req.query;
    let movieList;

    if (is_showing) {
        movieList = await movieService.listShowings();
    } else {
        movieList = await movieService.list();
    }
    res.json({data: movieList});
}

async function read(req, res, next) {
    res.json({ data: res.locals.movie });
}


module.exports = {
    list: asyncErrorBoundary(list),
    read: [asyncErrorBoundary(movieExists), asyncErrorBoundary(read)],
    movieExists,
} 