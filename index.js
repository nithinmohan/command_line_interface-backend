var http = require('http');
var express =require('express');
var app=express();
var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');
var bodyParser= require('body-parser');
var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost/test');
var Schema       = mongoose.Schema;
mongoose.set('debug', true);
var UserSchema   = new Schema({
    username: String,
    password: String,
});
var User=mongoose.model('User', UserSchema);
var secret="qwertyuiop";

// We are going to protect /api routes with JWT
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,authorization');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
app.use('/api', expressJwt({secret: secret}));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.post('/authenticate', function (req, res) {
  //TODO validate req.body.username and req.body.password
  //if is invalid, return 401
  // var user = new User();      // create a new instance of the Bear model
  //       user.username = "a";  // set the bears name (comes from the request)
  //       user.password = "a";  // set the bears name (comes from the request)

  //       // save the bear and check for errors
  //       user.save(function(err) {
  //               res.send(err);
  //       })

   User.findOne({'username':req.body.username},function(err, user){
    if(err)
        return;
    if(!user)
        return;
    console.log(user);
    if(user.password!=req.body.password)
        res.send(401, 'Wrong user or password');
    else{
        var token = jwt.sign(user, secret, { expiresInMinutes: 60*5 });
        res.json({ token: token });
    }
  }) 
});
app.post('/api/restricted', function (req, res) {
  console.log('user ' + req.user.email + ' is calling /api/restricted');
  res.json({
    name: 'foo'
  });
});
app.listen(8888);