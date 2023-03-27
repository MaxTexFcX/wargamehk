require('dotenv').config()
const express = require("express");
const app = express();
const server = require('http').createServer(app);

const path = require('path')
const { logger } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const cors = require("cors");
const io = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }
});
const corsOptions = require('./config/corsOptions')
const connectDB = require('./config/dbConn')
const mongoose = require('mongoose')
const { logEvents } = require('./middleware/logger')
const PORT = process.env.PORT || 5000
const { SerialPort } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline')
const arduinoController = require('./controllers/arduinoController');
const { COM } = require('./controllers/arduinoController')

console.log(process.env.NODE_ENV)

let port

// const port = new SerialPort({
//   path: 'COM4',
//   baudRate: 9600,
// })

connectDB()

app.use(logger)

app.use(cors(corsOptions));

app.use(express.json())

app.use(cookieParser())

app.use('/', express.static(path.join(__dirname, 'public')))

app.use('/', require('./routes/root'))
app.use('/users', require('./routes/userRoutes'))
app.use('/games', require('./routes/gameRoutes.js'))
app.use('/auth', require('./routes/authRoutes.js'))
app.use('/arduino', require('./routes/arduinoRoutes'))

app.all('*', (req, res) => {
  res.status(404)
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'))
  } else if (req.accepts('json')) {
    res.json({ message: "404 Not Found" })
  } else {
    res.type('txt').send('404 not Found')
  }
})

app.use(errorHandler)

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB')
  app.listen(5050, () => console.log(`Server running on port 5050`))
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})

mongoose.connection.on('error', err => {
  console.log(err)
  logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})


//Arduino connection
function executeTask() {
  port = arduinoController.COM
}
const UpdatePort = setInterval(executeTask, 0);

function executeTask2() {
  if (port) {
    const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }))
    port.pipe(parser)
    parser.on('data', function (data) {
      io.emit('data', data)
    })
  }
}
const GetPortInfo = setInterval(executeTask2, 1000);





module.exports = {
  io: io
}


// app.use(express.json());

// const session=require("express-session");
// app.use(session({
//   secret: "anything",
//   resave: false,
//   saveUninitialized: true
// }));

// app.get("/api", (req, res) => {
//     res.json({ "users": ["userOne", "userTwo", "userThree"]})
// })



// //connect mangoDB
// const mongo = require("mongodb");
// const { Server } = require('http');
// const { modelName } = require('./models/User');
// const uri = "mongodb+srv://root:One2free@cluster0.4dd4v.mongodb.net/?retryWrites=true&w=majority"
// const client= new mongo.MongoClient(uri);
// let db=null;
// client.connect(async function(err){
//   if(err){
//     console.log("connecting fail", err);
//     return;
//   }
//   db=client.db("WarGameHK")
//   console.log("connected");
// });

// app.get("/api", (req, res) => {
//   res.json({ "users": ["userOne", "userTwo", "userThree"]})
// });

// app.get("/checkmember", function(req, res){
//   let result = req.session.member;
//   if(!req.session.member){
//     res.json({"IsLogin": false, result});
//     return;
//   }
//   res.json({"IsLogin": true, result});
// });

// app.get('/member', function(req, res){
//   res.redirect('http://localhost:3000/Register');
// });
// //register account
// app.post("/signup", async function(req, res) {
//   const username = req.body.username;
//   const email = req.body.email;
//   const password = req.body.password;
//   const permissionlevel = "2"
//   if(username===null || email===null || password===null){
//     window.alert("sasadasdasdsa")
//   }

//   const collection=db.collection("member");
//   let result=await collection.findOne({
//     email:email
//   });
//   if(result!==null){
//     res.json({ "message": ["信息: 重複的電子郵件地址"]})
//     return;
//   }
//   result=await collection.insertOne({
//     username:username, email:email, password:password, permissionlevel:permissionlevel
//   });
//   res.json({ "message": ["信息: 成功註冊帳號"]})
// });

// //Test Message
// app.get("/test", async function(req, res){
//   res.json({ "error": ["ERROR: 重複的電子郵件地址"]})
// });

// //Login account
// app.post("/signin", async function(req, res){
//   let loginstage = false;
//   const email = req.body.email;
//   const password = req.body.password;
//   const collection = db.collection("member");
//   let result= await collection.findOne({
//     $and:[
//       {email: email},
//       {password: password}
//     ]
//   })
//   if(result == null){
//     res.json({ "message": ["信息: 登入失敗"]});
//     return;
//   }
//   req.session.member=result;
//   loginstage = true;
//   res.json({ "message": ["信息: 成功登入"], result});
// });

