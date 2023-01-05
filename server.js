

if(process.env.NODE_ENV!=="production"){
    require("dotenv").config()
}





const express=require("express");
const bodyparser=require("body-parser");
const bcrypt=require("bcrypt")
const app=express()
const initializePassport=require("./passport-config")
const passport = require("passport")
const flash=require("express-flash")
const session=require("express-session")
const mongoose=require("mongoose")
const { name } = require("ejs")

mongoose.set('strictQuery', false);
 

const mongoURI = 'mongodb+srv://Abhijay:iN5MTLuQQjY05Aya@cluster0.pqy0o1i.mongodb.net/test';



mongoose.connect (mongoURI,{ 
        useNewUrlParser: true,
        useUnifiedTopology: true
        
      })

      const formSchema = new mongoose.Schema(
      {
        data: Object,
      },
      {Collection: "test"}
      )
    const Form = mongoose.model("Form", formSchema);
    const formData = (bodyData) => {
        Form({data: bodyData}).save((err) => {
      if (err) {
        throw err;
      }
        });
    };

initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
  )
  


const users=[]


app.use(express.static("views"))
app.use(bodyparser.urlencoded({extended:false}))
app.use(flash())
app.use(session({
    secret:process.env.SECRET_KEY,
    resave:false,
    saveUninitialized:false
}))
app.use(passport.initialize())
app.use(passport.session())

app.post("/form",async(req, res) => {
    formData(req.body);
    res.redirect("/index");
  });

  app.post("/contact",async(req, res) => {
    formData(req.body);
    res.redirect("/contact");
  });

//configuring the register post login
app.post("/login", passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/login",
    failureFlash: true
  }))
  


//configuring the register post functionality
app.post("/register",async(req,res)=>{
    try{const hashedPassword = await bcrypt.hash(req.body.password, 10)
users.push({
    
    id:Date.now().toString(),
    name:req.body.name,
    email:req.body.email,
    password: hashedPassword,
})
console.log(users)
res.redirect("/login")
    }
    catch(e){
        console.log(e)
        res.redirect("/register")

    }
})



//routes
app.get('/',(req,res) =>{
    res.render("index.ejs")
})
app.get('/index',(req,res) =>{
    res.render("index.ejs")
})
app.get('/register',checknotAuthenticated, (req,res) =>{
    res.render("register.ejs")
})
app.get("/login",(req,res) =>{
    res.render("login.ejs")
})
app.get("/home",checkAuthenticated,(req,res) =>{
    res.render("home.ejs", {name: req.user.name})
})
app.get("/vacancies",checkAuthenticated,(req,res) =>{
    res.render("vacancies.ejs")
})
app.get("/form",checkAuthenticated,(req,res) =>{
    res.render("form.ejs")
})
app.get("/contact",checkAuthenticated,(req,res) =>{
    res.render("contact.ejs")
})
app.get("/profile",checkAuthenticated,(req,res) =>{
    res.render("profile.ejs", {name: req.user.name}, {email: req.user.email})
})



app.get("/logout", (req, res) => {
    req.logout(req.user, err => {
        if (err) return next(err)
        res.redirect("/")
    })
})

function checkAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect("/login")
}

function checknotAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return res.redirect("/")
    }
    return next()
}


 app.listen(3000,function(){
    console.log("the server is up running")
})


