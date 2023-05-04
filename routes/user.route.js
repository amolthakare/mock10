const express = require("express");
const bcrypt = require("bcrypt");
const User = express.Router();
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/user.model");

User.get("/", (req, res) => {
  res.send("hello");
});
User.get("/users", async (req, res) => {
  try {
    let user = await UserModel.find();
    res.send(user);
  } catch (err) {
    res.send(err);
  }
});

User.post("/register/", async (req, res) => {
  let { name, email, pass } = req.body;
  try {
    const user = await UserModel.findOne({email})
    if(user){
        res.send({msg:"already registered"});
    }
    bcrypt.hash(pass, 4, async (err, securepass) => {
      if (err) {
        res.send({msg:"Something went wrong"});
      } else {
        let user = new UserModel({ name, email, pass: securepass,verified:false });
        await user.save();
        const savedUser = await user.save();
        const otp = Math.floor(1000 + Math.random() * 9000);
        const transporter = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: "amolthakare629@gmail.com",
            pass: "troyjfbubahnqkhc",
          },
        });

        const mailOptions = {
          from: "amolthakare629@gmail.com",
          to: email,
          subject: "otp",
          text: "your otp is " + otp,
        };

        await transporter.sendMail(mailOptions);
        savedUser.otp = otp;
        await savedUser.save();
        res.send({ msg: "otp has send", email: email });
      }
    });
  } catch (error) {
    console.log(error);
    res.send({msg:"Something went wrong"});
  }
});

User.post("/verify", async (req, res) => {
    const {email,otp} = req.body;

    const user = await UserModel.findOne({email})
    console.log(user);
    if(!user){
        res.send({msg:"Please signup first not a user"});
    }
    const verify_otp = otp;

    if(user.otp==verify_otp){
        user.verified=true;
        await user.save();
        res.send({msg:"otp verified"});
    }
    else{
        res.send({msg:"Something went wrong"});
    }
})

User.post("/login", async (req, res)=>{
    let {email, pass} = req.body;
    try {
        const user = await UserModel.findOne({email})
        const hash_pass = user.pass
        if(!user){
            res.send("Please Register First")
        }else{
            if(user.verified=="true"){
                bcrypt.compare(pass, hash_pass,async (err, result)=>{
                    if(result){
                        const token = jwt.sign({userId: user._id}, process.env.key)
                        res.status(201).send({"message":"Login success", "token": token})
                    }else{
                        res.send({msg:"Something went wrong, check your passowrd ans email"})
                    }
                })
            }
            else{
                res.send({msg:"your mail is not verified please register again"});
            }
            
        }
        
    } catch (error) {
        console.log(error);
        res.send({msg:"Something went wrong"});
    }
})
module.exports = { User };
