var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../app/config');
var User = require('../app/models/user');
var Link = require('../app/models/link');
var Users = require('../app/collections/users');
var Links = require('../app/collections/links');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

exports.addUser = function(req,res) {
  var jira = new User ({username:"Jira", password:'hellogoodbye'})
  jira.save();
  console.log(jira.username);
  res.send(200);
};

exports.fetchLinks = function(req, res) {
  Link.find(function(err, links) {
    console.log('hello', links)
    res.send(200, links);
  });
};

exports.saveLink = function(req, res) {

  //todo:sha1.slice(0,5)
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  Link.findOne({ url:uri}, function (err, link){
    if (link) {
      res.send(200, link);
    }
    if (!link){
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.send(404);
        }
        var newLink = new Link({
          url: uri,
          title: title,
          base_url: req.headers.origin,
          visits:0
        });
        newLink.save()
        res.send(200, newLink);
      });
    }
  })
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;


  User.findOne({ username: username }, function(err, user) {
    console.log(user);
    if (!user) {
        console.log('no such user')
        res.redirect('/login');
      } else if (user.username === password){
        console.log('logged in')
        util.createSession(req, res, user);
      } else {
        console.log('incorrect password');
        res.redirect('/login');
      }
  });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  
  User.find({ username: username }, function(err, user) {
    console.log('result of search',err, user)
    if(err) {
      console.error(err);
    }
    if(!user.length) {
      var newUser = new User({
          username: username,
          password: password
        });
        newUser.save();
        util.createSession(req, res, newUser);
    } else {
      console.log('Account already exists');
      res.redirect('/signup');
    }
  })
};

exports.navToLink = function(req, res) {

  //todo: fix
  new Link({ code: req.params[0] }).find(function (err, link){
    if (!link) {
      res.redirect('/');
    } else {
      link.set({ visits: link.get('visits') + 1 })
        .save()
        .then(function() {
          return res.redirect(link.get('url'));
        });
    }
  });
};