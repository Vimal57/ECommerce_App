const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


/**
 * @param {*} req
 * @param {*} res
 * @description "create new user with sign up"
 * @author "Vimal Solanki (zignuts technolabs)"
 */
router.post("/signup", async (req, res) => {
    try {
        // find user
        let user = await User.findOne({ email : req.body.email });

        // if user already exists 
        if (user) {
            return res.status(409).json({
                msg : "Email already registered!"
            });

        // if user not exists
        } else {
            // check password is correct or not
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    return res.status(400).json({
                        msg : "Unable to hash password",
                        error : err
                    });
    
                } else {
                    let newUser = new User({
                        _id : mongoose.Types.ObjectId(),
                        email : req.body.email,
                        password : hash
                    });
                    newUser.save();
    
                    res.status(200).json({
                        msg : "User created successfully..."
                    })
    
                }
            });

        }
        
    } catch(err) {
        res.status(400).json({
            error : err
        })
    }
});


/**
 * @param {*} req
 * @param {*} res
 * @description "login user"
 * @author "Vimal Solanki (zignuts technolabs)"
 */
router.post("/login", async (req, res) => {
    try {
        let user = await User.findOne({ email : req.body.email });
        if (!user) {
            return res.status(404).json({
                msg : "User not found!"
            });
        } 

        bcrypt.compare(req.body.password, user.password, async (err, result) => {
            if (err) {
                return res.status(401).json({
                    msg : "Authencation failed!",
                    error : err
                });
            }
            if (result) {
                const token = await jwt.sign(
                    {
                        email : user.email,
                        userId : user._id
                    },
                    "secret",
                    {
                        expiresIn : "1h"
                    }
                );

                return res.status(200).json({
                    msg : "Authorised Successfully...",
                    token : token
                }); 
            }

            res.status(401).json({
                msg : "Authencation failed!"
            });

        });

    } catch(err) {
        console.log("err in login : ", err);
        res.status(400).json({
            msg : "Unable to login, something went wrong!",
            error : err
        });
    }
});


/**
 * @param {*} req
 * @param {*} res
 * @description "delete user"
 * @author "Vimal Solanki (zignuts technolabs)"
 */
router.delete("/:userId", async (req, res) => {
    try {
        let deleteUser = await User.remove({ _id : req.params.userId });
        res.status(200).json({
            msg : "User deleted successfully..."
        });

    } catch(err) {
        res.status(400).json({
            msg : "Can't delete user!!",
            error : err
        });
    }
});


module.exports = router;