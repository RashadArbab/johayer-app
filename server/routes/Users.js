const router = require("express").Router();
const User = require("../models/Usermodel");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const auth = require("../middleware/authorization");
const methodOverride = require('method-override');
const express = require('express');
const app = express();
const nodemailer = require('nodemailer');
//return the views

app.set('view engine', 'ejs');
app.use(methodOverride('_method'));

router.get("/", (req,res) => {
    res.render("users/index" , {});
})

router.get("/register", (req,res) => { // this finds a list of all the users already registered
    // User.find()
    // .then((users) => res.json(users))
    // .catch((err) => res.status(400).json("Error: " + err));
    res.render("users/register");
});

router.post("/register", async (req, res) => {
    if(!req.body.username || !req.body.password || !req.body.email) {
        res.redirect("/register")
        return res.status(400).json({msg: "Please enter in all fields"}); 
    }
    const user = await User.findOne({username: req.body.username});
    if(user){
        return res.status(400).json({msg: "User already exists"})
    }

    bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(req.body.password, salt, function(err, hash) {
            const newUser = new User({
                username: req.body.username,
                email: req.body.email,
                password: hash,
            });
            newUser
                .save()
                .then((user) => res.redirect("/"))
                .catch((err) => res.status(400).json("Error: " + err));
        });
    });
});
//login functions
router.get("/login", async (req, res)=> {
    res.render("users/login");
    
});

router.post("/login", async(req,res) => {
    //checks validity of entry
    if(!req.body.username || !req.body.password) {
        return res.status(400).json({msg: "Enter in any missing fields"})
    }
    const user = await User.findOne({username: req.body.username});
    if(!user){
        return res.status(400).json({msg: "user doesn't exist"});
    }
    const valid = await bcrypt.compare(req.body.password, user.password);
    if(valid){
        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET);
        res.json({
            token: token, 
            user:{
                id: user._id,
                username: user.username,


            },
            msg: "Successfully Logged in"
        });
        // res.redirect("/");
    }
    else{
        return res.status(400).json({msg: "Authentication Error"});
    }
});
router.get("/forgot_password" , async(req,res) =>{
    res.render("users/forgotPassword")
});
router.post("/forgot_password", async(req, res) => {
    const user = await User.findOne({ username: req.body.username, email: req.body.email});
    if(!user){
        return res.status(400).json({msg: "User doesn't exist"});
    }

    bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(req.body.password, salt, function(req, hash)  {
            var newValues = {username: user.username, email: user.email ,  password: hash}
            User.updateOne(user, newValues, function(err, res) {
                if(err) {
                    console.log(err)
                }
            });
            user.save()
            .then((user) => { 
                res.json(user);
            });
        });
    });


});
router.get("/profile", auth,async (req,res) =>{
    const user = await User.findById(req.user._id);
    res.json({
        id: user._id,
        username: user.username,
        email: user.email,
    });
});



router.post("/tokenIsValid", async(req,res) =>{ // this determines if the jwt token is valid or not (for authorization)
    try{
        const token = req.header("auth-token");
        if(!token){ //if no token
            return res.json("false");
        }
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if(!verified){ //if this doesn't return with the object containing user ID
            return res.json("false");
        }
        const user = await User.findById(verifid._id); // if user cannot be found baed on id
        if(!user){
            return res.json("false");
        }
        return res.json(true);

    } catch(err){
        res.status(500).json({msg: err.message});
    }
});
module.exports = router;

