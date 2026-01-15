const path=require('path')
const express=require("express");
const storeRouter=require("./routes/storeRouter")
const hostRouter=require("./routes/hostRouter")
const authRouter=require("./routes/authRouter")
const rootDir=require("./utils/pathUtil");

const errorsControllers=require("./controllers/errors");

const { default: mongoose } = require('mongoose');

const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const DB_PATH="mongodb+srv://root:root@cluster0.mpothsl.mongodb.net/airbnb?appName=Cluster0"


const app=express();








app.set('view engine','ejs');

app.set('views','views');
const PORT=3000;


const store=new MongoDBStore({
  uri:DB_PATH,
  collection:'sessions'
});





app.use(session({
  secret: 'life2025',
  resave: false,
  saveUninitialized: true,
  store
}));

app.use(express.static(path.join(rootDir,'public')))

app.use((req,res,next)=>{
//console.log('In the middleware',req.get('Cookie'));
req.isLoggedIn=req.session.isLoggedIn;
  next();
});


app.use(storeRouter);
app.use(authRouter);
app.use("/host",(req,res,next)=>{
if(req.isLoggedIn){
  next();
}
 else{
  res.redirect('/login');
 }
});

app.use("/host",hostRouter);




app.use(errorsControllers.pageNotFound);



mongoose.connect(DB_PATH).then(()=>{
console.log("connected to mongo")
 app.listen(PORT,()=>{
  console.log(`server running on address http://localhost:${PORT}`);
});

}).catch(err=>
{
console.log('Error while connecting to mongo',err)
})