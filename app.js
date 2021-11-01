
if(process.env.NODE_ENV !== 'production')
{
    require('dotenv').config();
}




const express=require('express');
const path=require('path');
const app= express();
const mongoose=require('mongoose');
const seedDB= require('./seed');
const session= require('express-session');
const flash= require('connect-flash');
const CartRoutes = require('./routes/cartRoutes');
const User=require('./models/user')
const passport = require('passport');
const LocalStrategy = require('passport-local');
mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log('Db Connected'))
.catch(err=>console.log(err));
//seedDB(); 

const sessionConfig = {

    secret:'weneedsomebettersecret',
    resave:false,
    saveUninitialized:true,
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req, res, next)=>{
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    res.locals.currentUser=req.user;
    console.log(req.user);
    next();
})




app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({ extended:true}));
const productRoutes=require('./routes/productRouters.js');
const authRoutes=require('./routes/authRoutes')
const methodOverride=require('method-override');
app.get('/', (req, res) => {
    res.render('home')
});
app.use(methodOverride('_method'));

app.use(productRoutes);
app.use(authRoutes);
app.use(CartRoutes);


app.listen(process.env.PORT || 2323,(req, res)=>{
    console.log('listening');
});