const jwt = require('jsonwebtoken');
const secret = '12345-67890-09876-54321';
const User = require('./models/User');

exports.withAuth = function(req, res, next) {
  const token = 
      req.body.token ||
      req.query.token ||
      req.headers['x-access-token'] ||
      req.cookies.token;

  if (!token) {
    const error = new Error('Unauthorized: No token provided');
    error.status = 401;
    next(error);
  } else {
    jwt.verify(token, secret, function(err, decoded) {
      if (err) {
        const error = new Error('Unauthorized: Invalid token');
        error.status = 401;
        next(error);
      } else {
        req.email = decoded.email;
        next();
      }
    });
  }
};

exports.isAdmin = (req, res, next) => {
  const email = req.email;
  User.findOne({ email }, (err, user) => {
    if (err) {
      console.error(err);
      res.status(500)
          .json({
            error: 'Internal error please try again'
          });
    } else if (!user) {
      res.status(401)
          .json({
            error: 'Incorrect email or password'
          });
    } else if (user.isAdmin) {
      next();
    } else {
      const err = new Error('You are not an admin!');
      err.status = 500;
      next(err);
    }
  });
};

//module.exports = withAuth;