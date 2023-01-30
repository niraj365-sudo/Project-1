const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const indexRoute = require("./routes/index");
const userRoute = require("./routes/users");
const path = require("path");
const app = express();
const mongoose = require('mongoose')
const flash = require('connect-flash')
const session = require('express-session');
const { nextTick } = require("process");
const dotenv = require('dotenv')
dotenv.config()
const passport = require('passport')
const cloudinary = require('cloudinary')
const uploadRoute = require('./routes/upload')
const Search = require('./models/search')

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_ID,
  api_secret: process.env.API_SECRET,
});
console.log('This is API ID',process.env.API_ID);

PORT = 9099;

//Passport Configuration
require('./config/passport')(passport);

//Database Config
const db = require('./config/keys').MongoURI;


//Database connection
mongoose.set("strictQuery", false);
mongoose.connect(db, {
  useNewUrlParser: true,
  useUnifiedTopology: true

}).then(()=>console.log("Connected to database.")).catch(err => console.log(err))

//EJS
app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// app.use(express.static(path.join(__dirname, 'public')));
app.use("/public", express.static("./public"));

//BodyParser
app.use(express.json())
app.use(express.urlencoded({
  extended: false
}))

console.log(new Date);

//Express Session
app.use(session({
    secret: 'Niraj',
    resave: true,
    saveUninitialized: true,
    // cookie: {secure: true}

}))
 
//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect flash
app.use(flash());

//Global Variables
app.use((req, res, next) =>{
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
})

//Routes
app.use("/", indexRoute);
app.use("/users", userRoute);
app.use("/image", uploadRoute)

app.listen(PORT, () => {
  console.log(`Connected to port ${PORT}`);
});


