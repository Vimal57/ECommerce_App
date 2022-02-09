const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Order = require("../models/order");
const Product = require("../models/product");


/**
 * @param {*} req
 * @param {*} res
 * @description "get all orders"
 * @author "Vimal Solanki (zignuts technolabs)"
 */
router.get("/", async (req, res) => {
    try {
        let allOrders = await Order.find().populate("product");

        res.status(200).json({
            count : allOrders.length,
            orders : allOrders.map(order => {
                return {
                    _id : order._id,
                    product : order.product,
                    quantity : order.quantity,
                    request : {
                        type : "GET",
                        url : "http://localhost:3000/orders/" + order._id
                    }
                };
            })
        });

    } catch(err) {
        console.log("err in fetch all orders : ", err);
        res.status(400).json({
            error : err
        })
    }
});


/**
 * @param {*} req
 * @param {*} res
 * @description "create a new order"
 * @author "Vimal Solanki (zignuts technolabs)"
 */
router.post("/", async (req, res) => {
    try {
        let productId = req.body.productId;
        let product = await Product.findOne({ _id : productId });

        if(!product) {
            return res.status(404).json({
                msg : "Product not found!"
            });

        } else {
            let newOrder = new Order({
                _id : mongoose.Types.ObjectId(),
                product : req.body.productId,
                quantity : req.body.quantity
            });
            newOrder.save();

            res.status(400).json({
                msg : "Order stored",
                createdOrder : {
                    _id : newOrder._id,
                    product : newOrder.product,
                    quantity : newOrder.quantity
                },
                request : {
                    type : "GET",
                    url : "http://localhost:3000/orders/" + newOrder._id
                }
            });
            
        }

    } catch(err) {
        console.log("err in post orders : ", err);
        res.status(400).json({
            error : err
        })
    }
});


/**
 * @param {*} req
 * @param {*} res
 * @description "get any order details with it's orderID"
 * @author "Vimal Solanki (zignuts technolabs)"
 */
router.get("/:orderId", async (req, res) => {
    try {
        const id = req.params.orderId;

        let order = await Order.findById({ _id : id });
        if(order) {
            res.status(200).json({
                order : order,
                request : {
                    type : "GET",
                    url : "http://localhost:3000/orders"
                }
            })
        } else {
            res.status(400).json({
                msg : "No order available with this id"
            })
        }

    } catch(err) {
        console.log("err in get order by id : ", err);
        res.status(404).json({
            error : err
        })
    }
    
});


/**
 * @param {*} req
 * @param {*} res
 * @description "for delete any order"
 * @author "Vimal Solanki (zignuts technolabs)"
 */
router.delete("/:orderId", async (req, res) => {
    try {
        const id = req.params.orderId;
        let deleteOrder = await Order.remove({ _id : id });

        res.status(200).json({
            msg : "Order deleted...",
            request : {
                type : "POST",
                url : "http://localhost:3000/orders",
                body : {
                    productId : "ID",
                    quantity : "Number"
                }
            }
        });

    } catch(err) {
        console.log("error in delete order : ", err);
        res.status(400).json({
            error : err
        });
    }
});


module.exports = router;