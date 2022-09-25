const moviesService = require("./movies.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary")

async function listMovies(req, res, next) {
    const isShowing = req.query.is_showing;
    const movies = await moviesService.listMovies(isShowing)
    res.json({ data : movies });
}

async function listReviews(req, res, next) {
    const movieId = req.params.movieId
    const reviews = await moviesService.listReviews(movieId)
    res.json ({ data : reviews })
}

async function listTheaters(req, res, next) {
    const movieId = req.params.movieId
    const theaters = await moviesService.listTheaters(movieId)
    res.json ({ data : theaters })
}

async function movieExists(req, res, next) {
    const movie = await moviesService.read(req.params.movieId)
    
    if (movie) {
        res.locals.movie = movie;
        return next();
    }

    next({
        status: 404, message: `Movie cannot be found.`
    });
}

function read (req, res, next) {
    const movie = res.locals.movie;
    res.json({ data: movie })
}

module.exports = {
    listMovies: asyncErrorBoundary(listMovies),
    listTheaters: [
        asyncErrorBoundary(movieExists),
        asyncErrorBoundary(listTheaters),
    ],
    listReviews: [
        asyncErrorBoundary(movieExists),
        asyncErrorBoundary(listReviews),
    ],
    read: [asyncErrorBoundary(movieExists), asyncErrorBoundary(read)],
};
