const express = require("express");
const router = express.Router();
const authorize = require("../middleware/check-auth");
const { userSignUp, userLogin, userDelete } = require("../controllers/user");



/**
 * @param {*} req
 * @param {*} res
 * @description "create new user with sign up"
 * @author "Vimal Solanki (zignuts technolabs)"
 */
router.post("/signup", userSignUp);


/**
 * @param {*} req
 * @param {*} res
 * @description "login user"
 * @author "Vimal Solanki (zignuts technolabs)"
 */
router.post("/login", userLogin);


/**
 * @param {*} req
 * @param {*} res
 * @description "delete user"
 * @author "Vimal Solanki (zignuts technolabs)"
 */
router.delete("/:userId",authorize, userDelete);


module.exports = router;