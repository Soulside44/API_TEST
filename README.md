# API_TEST : Make a server API for sign up and log in! 
# How to use 

## sign up

### Request

> [POST] /users/signup

Body
<pre>
{
  'id':'yourID',
  'password':'yourPassword',
  'nickname':'yourNickname'
}
</pre>

### Response
#### success
<pre>
{
 'id':'yourID',
 'password':'encrytedPassword',
 'nickname':'yourNickname'
 'salt': 'salt for encryption',
 '_id': 'mongodb ObjectID'
}
</pre>
#### fail
<pre>
{
 'message':'400 Bad Request'
}
</pre>
## log in 

### Request

> [POST] /users/login
Body
<pre>
{
  'id':'yourID'
  'password':'yourPassword'
}
</pre>

### Response
#### success
<pre>
{
  'message': 'Welcome! yourNickname'
}
</pre>
#### fail
<pre>
{
  'message': 'Please, Check your ID or Password'
}
</pre>
