const logRequest = (req, res, next) => {
    console.log('Log request ke:', req.path)
    next();
};

module.exports = logRequest;