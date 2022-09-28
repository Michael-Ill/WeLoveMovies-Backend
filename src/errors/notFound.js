function notFound(req, res, next) {
    //next({ status: 404, message: `Path not found: ${req.originalUrl}`});
    res.status(404).send({ error: `Path not found: ${req.originalUrl}` });
};

module.exports = notFound;