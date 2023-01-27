if(process.env.NODE_ENV!=='production'){
    require('dotenv').config();
}


const express = require('express');
const app= express();
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const seedDB = require('./seed');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');


//firebase
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDr2qClO2GmlhwbwlKOocLrZTGT7xTf558",
  authDomain: "shopnpopp.firebaseapp.com",
  projectId: "shopnpopp",
  storageBucket: "shopnpopp.appspot.com",
  messagingSenderId: "1049570681227",
  appId: "1:1049570681227:web:90e0ed5d8c39bd8abd0f8e",
  measurementId: "G-ED3HB832EB"
};

// Initialize Firebase
const app1 = initializeApp(firebaseConfig);
const analytics = getAnalytics(app1);




//routes
const productRoutes = require('./routes/product');
const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cart')


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))




const sessionConfig = {
    secret: 'weneedsomebettersecret',
    resave: false,
    saveUninitialized: true
}
app.use(session(sessionConfig));
app.use(flash());




app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());





app.use((req,res,next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
})



mongoose.connect(process.env.DB_URL, {
        useFindAndModify: false,
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    })
    .then(()=>{
        console.log("DB Connected");
    })
    .catch((err)=>{
        console.log("Error Connecting with DB");
        console.log(err);
    })



// seedDB();

app.get('/',(req,res)=>{
    res.render('home');
})


app.use(productRoutes);
app.use(authRoutes);
app.use(cartRoutes);

app.listen(process.env.PORT || 3000,()=>{
    console.log("Server Running at Port 3000");
})