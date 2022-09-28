function errorHandler(err, req, res, next) {
    const {status = 500, message = "Whoops! Something's wrong."} = err;
    res.status(status).json({err: message});
};

module.exports = errorHandler;