const adminAuth = (req, res, next) => {
    const authToken = 'abca';
    const adminAuthenticated = authToken === 'abc';
    if (adminAuthenticated) {
        next();
    }
    else {
        res.status(401).send("Admin not authenticated");
    }
}

const userAuth = (req, res, next) => {
    var authToken = 'xyz';
    const userAuthenticated = authToken === 'xyz';
    userAuthenticated ? next() : res.send(401).send("User not authenticated");
};

module.exports = { adminAuth, userAuth }