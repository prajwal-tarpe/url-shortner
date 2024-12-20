const {v4: uuidv4} = require('uuid');
const User = require('../models/user');
const { setUser } = require("../service/auth");

async function handleUserSingup(req,res){
    const {name,email,password} = req.body;
    await User.create({
        name,
        email,
        password    
    });
    return res.render("home");
}

async function handleUserLogin(req,res){
    const {email,password} = req.body;
    const user = await User.findOne({
        email,
        password    
    });
    if(!user) return res.render('login',{
        error: "Invalid username or password"
    })

    // Stateful Auth
    // const sessionId = uuidv4();
    // setUser(sessionId, user);
    // res.cookie('uid',sessionId);

    // Stateless Auth
    const token = setUser(user);
    // res.cookie("uid",token);

    // return res.redirect("/");
    return res.json({ token });
}

module.exports = {
    handleUserSingup,
    handleUserLogin
}