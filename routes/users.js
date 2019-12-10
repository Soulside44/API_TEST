var express = require('express');
var router = express.Router();
var crypto = require('crypto');

//회원가입
router.post('/signup', function(req, res, next){
  var userInfo = req.body;
  var id = userInfo.id;
  var password = userInfo.password;
  var nickname = userInfo.nickname;
  var database = req.app.get("database");
  
  if(database == undefined)
  {
    res.json({message:'400 Bad Request'});
    return;
  }

  var validateUserinfo = userValidation(id, password, nickname);

  if(validateUserinfo == false)
  {
    res.json({message:'400 Bad Request'});
    return;
  }
  var users = database.collection("users");
  //유저 아이디 중복 불가능하게 하는 코드
  users.count({ 'id': id }, function (err, result) {
    if (err) throw err;
    if (result > 0) {
      res.json({ message: '400 Bad Request' });
      return;
    }
    else {
      crypto.randomBytes(64, function (err, buf) {
        const saltStr = buf.toString('base64');
        crypto.pbkdf2(password, saltStr, 100, 64, 'sha512', function (err, key) {
          const cryptoPassword = key.toString('base64');
          users.insertOne({ "id": id, "password": cryptoPassword, "nickname": nickname, "salt": saltStr }, function (err, result) {
            if (err) throw err;
            if (result.ops.length > 0)
              res.json(result.ops[0]);
            else
              res.json({ message: "400 Bad Request" });
            });
          });
        });
      }
    });
  });
//로그인 기능
router.post('/login', function(req, res, next){

 var userInfo = req.body;
 var id = userInfo.id;
 var password = userInfo.password;
 var database = req.app.get("database");
 var users = database.collection("users");

 
 users.findOne({"id": id}, function(err, user){
   if(err||user==null) {
    res.send({message: "Please, Check your ID or Password"});
    return;
   }
    const saltStr = user.salt;
    crypto.pbkdf2(password, saltStr, 100, 64, 'sha512', function (err, key) {
    const cryptoPassword = key.toString('base64')
    if(err) res.status(500).json({error:err});
    else if(user.password == cryptoPassword) res.send({message:"Welcome! "+ user.nickname +"!"});
    else res.send({message: "Please, Check your ID or Password"});
  });
 });
});

var userValidation = function (id, password, nickname) {
  if (id == "" || password == "") {
    return false;
  }
  if (id.length < 6 || id.length > 12) {
    return false;
  }
  if (password.length < 8 || password.length > 20) {
    return false;
  }
  if (nickname.length < 4 || nickname.length > 20) {
    return false;
  }
  return true;
}
module.exports = router;
