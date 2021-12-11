const express = require('express');
const SignupData = require('./src/model/SignupData');
const ChatroomData = require('./src/model/ChatroomData');
const PrivatechatData = require('./src/model/PrivatechatData');
const Blockchatdata = require('./src/model/Blockchatdata');
const cors = require('cors');
const jwt = require('jsonwebtoken');
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require("express-session");
const bcrypt = require('bcrypt');
var app = new express();
var debug = require('debug')('angular2-nodejs:server');
const http = require('http');
var port =normalizePort(process.env.PORT || '5200');
app.set('port',port);
var server = http.createServer(app);
var io = require('socket.io')(server);
const socket = require("socket.io");
const { getDefaultSettings } = require('http2');


app.use(cors());
app.use(express.json({limit: '50mb'}));


// initialize body-parser to parse incoming parameters requests to req.body
app.use(bodyParser.urlencoded({ extended: true }));
var username;
var useremail;
var senderID;
var room;
// initialize cookie-parser to allow us access the cookies stored in the browser.

function verifyToken(req, res, next) {
  if(!req.headers.authorization) {
    return res.status(401).send('Unauthorized request')
  }
  let token = req.headers.authorization.split(' ')[1]
  if(token === 'null') {
    return res.status(401).send('Unauthorized request')    
  }
  let payload = jwt.verify(token, 'secretKey')
  if(!payload) {
    return res.status(401).send('Unauthorized request')    
  }
  req.userId = payload.subject
  next()
}
app.post('/login',function(req,res){
    email=req.body.email;
    password=req.body.password;
    var user= SignupData.findOne({email:email}, function (err, user) {
        if(!user){
            res.status(401).send('Email does not exist') 
        }
        else{
          user.comparePassword(password, (error, match) =>  {
          if(!match) {
            res.status(401).send('Email and Password dont match') 
          }
else{
  SignupData.findOneAndUpdate({email:email},
                                {$set:{online:"yes",
                               }})
                               .then(function(data){
                                let payload={subject:email+password};
                                let token=jwt.sign(payload,'secretKey');
                              let online=data.online;
                               res.status(200).send({token,online});
                              })
     
      }
    });
    } 
    });
})
app.post('/signupnew', function(req,res){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
    console.log(req.body);
    var signup=
        {
            lname:req.body.signup.lname,
           email:req.body.signup.email,
           password:req.body.signup.password,
           online:'no'
        }
        email=req.body.signup.email;
        SignupData.findOne({email:email}, function (err, user) {
            if (user) {
                res.status(401).send('Email already exists')   
            }
            else{
               newsignup = new SignupData(signup);
              newsignup.save();
              console.log(req.body);
              res.status(200).send();
            }
        });
  });
  app.get('/profile/:ids',function(req,res){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
    const ids = req.params.ids;
   SignupData.find({email:ids})
    .then(function(user){
        res.send(user);
    });
});
  app.get('/user',function(req,res){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
   SignupData.find()
    .then(function(users){
        res.send(users);
    });
});
app.get('/history',function(req,res){
  res.header("Access-Control-Allow-Origin","*");
  res.header("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
 ChatroomData.find({room:'Chat Room1'})
  .then(function(history){
      res.send(history);
  });
});
app.get('/historys',function(req,res){
  res.header("Access-Control-Allow-Origin","*");
  res.header("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
 ChatroomData.find({room:'Chat Room2'})
  .then(function(historys){
      res.send(historys);
  });
});
app.get('/historyrs',function(req,res){
  res.header("Access-Control-Allow-Origin","*");
  res.header("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
 ChatroomData.find({room:'Chat Room3'})
  .then(function(historyrs){
      res.send(historyrs);
  });
});
app.get('/historyprivate/:rec',function(req,res){
  res.header("Access-Control-Allow-Origin","*");
  res.header("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
  const total = req.params.rec;
  let priv = total.split(':')
  const emails = priv[1];
  const receiv = priv[0];
 PrivatechatData.find({email:emails, receiver:receiv})
  .then(function(historypr){
      res.send(historypr);
  });
});
app.get('/numberusers',function(req,res){
  res.header("Access-Control-Allow-Origin","*");
  res.header("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
 SignupData.countDocuments()
 .then(function(numberofusers){
     res.status(200).send({numberofusers});
 });
});
//------------------------get indv user details for personal chat --------------------
 
app.get('/indvuser/:id',(req, res) => {
  const id = req.params.id;
  console.log(id)
    SignupData.findOne({"_id":id})
    .then((userdetail)=>{
        res.send(userdetail);
        console.log(userdetail)
    });
})

app.post('/logouts', function(req,res){
  res.header("Access-Control-Allow-Origin","*");
  res.header("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
  email=req.body.item.email
  console.log(email)
  SignupData.findOneAndUpdate({email:email},
    {$set:{online:"no",
   }})
   .then()
  });
  // --------------------------------Block user---------------------------
app.post('/blockcontact',function(req, res){
  res.header("Access-Control-Allow-Origin","*")
  res.header("Access-Control-Allow-Methods:GET,POST,PATCH,PUT,DELETE,OPTIONS")
 // const id = req.body._id;
 console.log(req.body)
const from=req.body.fromemail
const to=req.body.toemail;
const from1=req.body.toemail
const to1=req.body.fromemail
 console.log(from)
 console.log(to)


 var blockchat={
 from:req.body.fromemail,
  to:req.body.toemail,
  from1:req.body.toemail,
  to1:req.body.fromemail
}

var blockchat=new Blockchatdata(blockchat);
blockchat.save();

return res.status(200).send();
})
  //------------------------get blocked user details to dashboard--------------------
 
app.get('/contactsblocked/:item',(req, res) => {
  
  const email = req.params.item;
  console.log(email)
    Blockchatdata.findOne({"from":email})
    .then((userdetail)=>{
        res.send(userdetail);
       console.log(userdetail)
    });
})
//------------------------get private chat history --------------------
 
app.get('/chatHistory/:item', (req, res) => {
  const room = req.params.item;
   console.log(room)
  PrivatechatData.find({ room:room  })
    // Userdata.findOne({"email":email})
    .then((otheruserdetail)=>{
        res.send(otheruserdetail);
     // console.log(otheruserdetail)
    });
})
app.post('/unblockContact', (req, res) => {
  // console.log(req.params.item)
  const from = req.body.fromemail
  const to = req.body.toemail
   console.log(from)
   console.log(to)
    Blockchatdata.findOneAndDelete({"from":from,"to":to})
    .then((userdetail)=>{
        res.send();
      //  console.log(userdetail)
    });
})
  const users = [];
io.on('connection',(socket)=>{
  socket.emit("connected", { clientId: socket.id });  
  
      // ---------------Private chat-------------------------

      socket.on('joinprivatechat',function(data){ 
        console.log(data.room)
        socket.join(data.room);
             socket.join(data.loginmail);
           // console.log( data.loginmail+ ' need to chat with : ' + data.recepient+' on room '+data.room);
            socket.join(data.recepient);
         socket.broadcast.to(data.room).emit('invite_to',{user:data.loginmail,room:data.room, message:'need to chat.'})
         })   
         
    
    
         socket.on('sendindvmsg',function(data){
          let date_ob = new Date();
          let monthnum=date_ob.getMonth();
          let monthname=['January','February','March','April','May','June','July','August','September','October','November','December'];
          var chatdata={
            user:data.user,
            message:data.message,
            room:data.room,
            date:date_ob.getDate(),
            month:monthname[monthnum],
            time:date_ob.getHours()+ ':' + date_ob.getMinutes()
          }
          var chatdata=new PrivatechatData(chatdata);
      chatdata.save();
         io.in(data.room).emit('new_indvmessage', {message:data.message,user:data.user});
        
        })
    
    
    //-----send private Image-----------
    
        socket.on('sendimage',function(data){
          let date_ob = new Date();
          let monthnum=date_ob.getMonth();
          let monthname=['January','February','March','April','May','June','July','August','September','October','November','December'];
          var chatdata={
            user:data.user,
            imgfile:data.image,
            room:data.room,
            date:date_ob.getDate(),
            month:monthname[monthnum],
            time:date_ob.getHours()+ ':' + date_ob.getMinutes()
          }
         // console.log(data.image)
          var chatdata=new PrivatechatData(chatdata);
     chatdata.save();
         io.in(data.room).emit('new_image', {image:data.image,user:data.user});
        
        })
        socket.on('forwardimage',function(data){
          // console.log(data)
          // console.log(data.room)
           socket.join(data.room);
                socket.join(data.loginmail);
              // console.log( data.loginmail+ ' need to chat with : ' + data.recepient+' on room '+data.room);
               socket.join(data.recepient);
            socket.broadcast.to(data.room).emit('frwdImg',{user:data.loginmail,room:data.room, image:data.image})
         
            
            }) 
             socket.on('forwardmessage',function(data){
          // console.log(data)
          // console.log(data.room)
           socket.join(data.room);
                socket.join(data.loginmail);
              // console.log( data.loginmail+ ' need to chat with : ' + data.recepient+' on room '+data.room);
               socket.join(data.recepient);
            socket.broadcast.to(data.room).emit('frwdMsg',{user:data.loginmail,room:data.room, message:data.message})
         
            
            }) 
      
  console.log('new connection made.');
 
  socket.on('logins', function(data){
    //login
     
     SignupData.findOne({email:data})
      .then(function(datas){
        socket.broadcast.emit('online',{username:datas.lname, useremails:datas.email, userstatus:datas.online});
        console.log(datas.lname)
        console.log(datas.email)
    });
   
  });
  socket.on("disconnect", () => {
    const index = users.indexOf(socket.id);
    if (index > -1) {
        users.splice(index, 1);
    }
    console.log(`User [ ${socket.id} ] has disconnected`);

});
socket.on('whoami', () => {
  socket.emit('socket-id', socket.id);
})
  socket.on('join', function(data){
    //joining
    socket.join(data.room);

    console.log(data.user + 'joined the room : ' + data.room);

    socket.broadcast.to(data.room).emit('new user joined', {user:data.user, message:'has joined this room.'});
  
  });


  socket.on('leave', function(data){
  
    console.log(data.user + 'left the room : ' + data.room);

    socket.broadcast.to(data.room).emit('left room', {user:data.user, message:'has left this room.'});

    socket.leave(data.room);
  });

  socket.on('message',function(data){

    io.in(data.room).emit('new message', {user:data.user, message:data.message});
    let date_ob = new Date();
    let monthnum=date_ob.getMonth();
    let monthname=['January','February','March','April','May','June','July','August','September','October','November','December'];
    var chatdata={
      name:data.user,
      room:data.room,
      message:data.message,
      date:date_ob.getDate(),
      month:monthname[monthnum],
      time:date_ob.getHours()+ ':' + date_ob.getMinutes()
    }
    var chatdata = new ChatroomData(chatdata);
    chatdata.save();
  })
  socket.on('logoutsall', function(data){
    //login
    delete users[socket.id];
    email=data.email;
    SignupData.findOne({email:email})
     .then(function(datas){
       io.emit('offline',{username:datas.lname, useremails:datas.email, userstatus:datas.online});
       console.log(datas.lname)
       console.log(datas.email)
   });
  })
});
server.listen(port);
server.on('error',onError);
server.on('listening',onListening);
function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}
function onListening(){
  var addr = server.address();
  var bind = typeof addr === 'string'
  ? 'pipe' +addr
  : 'port' + addr.port;
  debug('Listening on' + bind);
}
// app.listen(5200);
