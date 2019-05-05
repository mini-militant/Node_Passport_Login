var express               = require("express"),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    bodyParser            = require("body-parser"),
    localStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    user                  = require("./models/user");


mongoose.connect("mongodb://localhost/Authentication",{useNewUrlParser:true});

var app=express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(require("express-session")({
  secret : "Gangadhar hin Shaktiman hai",
  resave : false,
  saveUninitialized : false
}));
app.use(passport.initialize());
app.use(passport.session());

// Serialize and deserialize are the two important functions
// as it imp for reading sessions,taking data from sessions(encoding-decoding internally)

passport.use(new localStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

//===========
// ROUTES
//===========

app.get("/",function(req,res){
  res.render("home");
});

//show sign up form
app.get("/register",function(req,res){
  res.render("register");
});

//handling user sign up
app.post("/register",function(req,res){
  user.register(new user({username:req.body.userName}),req.body.password,
    function(err,user){
      if(err){
        console.log(err);
        return res.render("register");
      }
      passport.authenticate("local")(req,res,function(){
        res.redirect("/secret");
      })

    });
});

//Login ROUTES
app.get("/login",function(req,res){
  res.render("login");
});

//login logic
app.post("/login",passport.authenticate("local",{
  successRedirect : "/secret",
  failureRedirect : "/login"
}),function(req,res){}
);


app.get("/logout",function(req,res){
  req.logout();
  res.redirect("/");
});



app.get("/secret",isLoggedIn,function(req,res){
  res.render("secret");
});

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }

  res.redirect("/login");
}


app.listen(3000,function(req,res){
  console.log("Server Started!");
});
