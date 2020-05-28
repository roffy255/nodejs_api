module.exports = function (req, res, next) {
    console.log('logged in user >>>', req.loggedInUser);
    if (req.loggedInUser.role == 1) {
        return next();
    } else {
        return next({
            message: 'you dont have access',
            status: 404
        });
    }
}