if(process.env.NODE_ENV != "production"){
require('dotenv').config()
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/expressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const User = require('./models/user.js');
const passport = require('passport');
const LocalStrategy = require('passport-local');


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const port = 3000;

const dbUrl = process.env.ATLASDB_URL;

async function main(){
    await mongoose.connect(dbUrl);
 }

main().then(()=>{
    console.log("connection successfull");
}).catch((err)=>{
    console.log("some error occurred" , err);
});

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24*3600,
});

store.on("error" , ()=>{
    console.log("Error in Mongo session store" , err);
})

const sessionOptions = {
    store: store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie : {
    expires : Date.now() + 1000 * 60 * 60 * 24 * 3,
    maxAge : 1000 * 60 * 60 * 24 * 3,
    httpOnly : true 
  }
}



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res , next )=>{
     res.locals.success =  req.flash("success"); // storing the message into the success local variable we can access this message by using the success variable
     res.locals.error =  req.flash("error");
     res.locals.currUser = req.user;
    next();
});


app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs" , ejsMate); // 
app.use(express.static(path.join(__dirname,"/public")));



app.use("/listing",listingRouter);
app.use("/listing/:id/reviews",reviewRouter);
app.use("/" , userRouter);


// this will handle the unvalid request route
app.all("*" , (req, res, next)=>{ // * is for all incoming req which will not match (not matched route) 
    next(new ExpressError(404 , "Page not Found!")); // passing the error to error handler
});

// custom error handler for handling the error 
app.use((err, req, res , next)=>{
    let {statusCode=500 , message= "someting went wrong"} = err; // destruct the statusCode and msg from error
    res.status(statusCode).render("Error.ejs", { message }); // this message will display to the frontend
});

app.listen(port , ()=>{
          console.log(`app listening at ${port}`);
});
