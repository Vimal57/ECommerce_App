const express = require("express");
const router = express.Router();
const authorize = require("../middleware/check-auth");
const { getAllOrders, createOrder, getOrderById, deleteOrder } = require("../controllers/order");



/**
 * @param {*} req
 * @param {*} res
 * @description "get all orders"
 * @author "Vimal Solanki (zignuts technolabs)"
 */
router.get("/", getAllOrders);


/**
 * @param {*} req
 * @param {*} res
 * @description "create a new order"
 * @author "Vimal Solanki (zignuts technolabs)"
 */
router.post("/", authorize, createOrder);


/**
 * @param {*} req
 * @param {*} res
 * @description "get any order details with it's orderID"
 * @author "Vimal Solanki (zignuts technolabs)"
 */
router.get("/:orderId", getOrderById);


/**
 * @param {*} req
 * @param {*} res
 * @description "for delete any order"
 * @author "Vimal Solanki (zignuts technolabs)"
 */
router.delete("/:orderId", authorize, deleteOrder);


module.exports = router;