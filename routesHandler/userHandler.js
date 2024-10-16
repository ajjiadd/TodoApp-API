const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const userSchema = require("../schemas/userSchema");
const User = new mongoose.model("User", userSchema);

//SignUp
router.post("/signup", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      name: req.body.name,
      username: req.body.username,
      password: hashedPassword,
    });

    await newUser.save(); // Correct usage
    res.status(200).json({
      message: "Signup was successfully!",
    });
  } catch {
    res.status(500).json({
      message: "Signup Failed!",
    });
  }
});

//Login
router.post("/login", async (req, res) => {

    const user = await User.find({
        username: req.body.username
    });

    try{
        if(user && user.length> 0){
            const invalidPassword = await bcrypt.compare(req.body.password, user[0].password);
            if(invalidPassword){
                //generate token
                const token = jwt.sign({
                    username: user[0].username,
                    id: user[0].id,
                }, process.env.JWT_SECRET, {
                    expiresIn: "1h"
                });
    
                res.status(200).json({
                    "access_token": token,
                    "message": "Login Successfully!",
                });
    
            }else{
                res.status(401).json({
                    "error": "Authentication failed!"
                });
            }
        }else{
            res.status(401).json({
                "error": "Authentication failed!"
            });
        }
    }catch{
        res.status(401).json({
            "error": "Authentication failed!"
        });
    }

    


});

//get all users
router.get("/all", async (req, res) => {
    try{
        const users = await User.find({
            
        }).populate("todos");

        res.status(200).json({
            message: "Success!",
            data: users,
        });
    }catch(err){
        console.log(err);
        res.status(500).json({
            message: "There was an error on the server!"
        });
    }
});

module.exports = router;
