const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('./models/User');
const Item = require('./models/Item');
const auth = require('./middleware');
const session = require('express-session');

const app = express();

app.use(session({secret:'token', cookie:{token:'', isAdmin:false}}));

const secret = '12345-67890-09876-54321';

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

const mongo_url = 'mongodb://localhost:27017/Auth';
mongoose.connect(mongo_url, { useNewUrlParser: true }, function(err) {
  if (err) {
    throw err;
  } else {
    console.log(`Successfully connected to ${mongo_url}`);
    //console.log(process.env.PORT);
  }
});

app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/home', function(req, res) {
  Item.find({})
      .then((items) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(items);
      }, (err) => next(err))
      .catch((err) => next(err));
});

app.post('/home', function (req, res) {
  Item.create(req.body)
      .then((items) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(items);
      }, (err) => next(err))
      .catch((err) => {
        console.log(err);
        res.status(500).send("Error adding new item please try again.");
      });
});

app.get('/secret', auth.withAuth, function(req, res) {
  res.send(`The token is ` + req.cookies.token + ', isAdmin: ' + req.cookies.isAdmin);
});

app.post('/register', auth.withAuth, auth.isAdmin, function(req, res) {
  const { email, password } = req.body;
  const user = new User({ email, password });
  user.save(function(err) {
    if (err) {
      console.log(err);
      res.status(500).send("Error registering new user please try again.");
    } else {
      res.status(200).send("Welcome to the club, buddy!");
    }
  });
});

app.post('/authenticate', function(req, res) {
  const { email, password } = req.body;
  User.findOne({ email }, function(err, user) {
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
    } else {
      user.isCorrectPassword(password, function(err, same) {
        if (err) {
          res.status(500)
            .json({
            error: 'Internal error please try again'
          });
        } else if (!same) {
          res.status(401)
            .json({
            error: 'Incorrect email or password'
          });
        } else {
          var isAdmin = user.isAdmin;
          const payload = { email };
          const token = jwt.sign(payload, secret, {
            expiresIn: '1h'
          });
          res.cookie('token', token);
          res.cookie('isAdmin', isAdmin).sendStatus(200);
        }
      });
    }
  });
});

app.get('/checkToken', auth.withAuth, function(req, res) {
  res.sendStatus(200);
});

app.get('/users', auth.withAuth, auth.isAdmin, function (req, res) {
  User.find({})
      .then((users) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(users);
      }, (err) => next(err))
      .catch((err) => next(err));
});

app.get('/logout', function (req, res, next) {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('token').clearCookie('isAdmin');
    res.redirect('/');
  } else {
    const err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});

app.delete('/users', auth.withAuth, auth.isAdmin, function (req, res, next) {
  User.findByIdAndDelete(req.body.id)
      .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
      }, (err) => next(err))
      .catch((err) => next(err));
});

app.get('/checkAdmin', auth.withAuth, auth.isAdmin, function(req, res) {
  res.sendStatus(200);
});

app.listen(process.env.PORT || 8080);
