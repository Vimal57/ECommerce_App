const mongoose = require("mongoose");
const Order = require("../models/order");
const Product = require("../models/product");



async function getAllProducts(req, res) {
    try {
        let allProducts = await Product.find();

        let response = {
            count : allProducts.length,
            products : allProducts.map(data => {
                return {
                    name : data.name,
                    price : data.price,
                    productImage : data.productImage,
                    _id : data._id,
                    request : {
                        type : "GET",
                        url : "http://localhost:3000/products/" + data._id
                    }
                };
            })
        };

        res.status(200).json(response);

    } catch(err) {
        console.log("err '/' :: ", err);
        res.status(500).json({
            error: err
        });
    }
};


async function createdProduct(req, res) {
    try {
        console.log(req.file);
        let newProduct = new Product({
            _id : new mongoose.Types.ObjectId(),
            name : req.body.name,
            price : req.body.price,
            productImage : req.file.path
        });
    
        newProduct.save();
        res.status(200).json({
            msg : "Product Created Successfully...",
            createdProduct : {
                name : newProduct.name,
                price : newProduct.price,
                _id : newProduct._id,
                request : {
                    type : "GET",
                    url : "http://localhost:3000/products/" + newProduct._id
                }
            }
        });

    } catch(err) {
        res.status(400).json({
            error : err
        })
    }
    
};


async function getProductById(req, res) {
    try {
        const id = req.params.productId;

        let product = await Product.findById({ _id : id });
        if(product) {
            res.status(200).json({
                product : product,
                request : {
                    type : "GET",
                    url : "http://localhost:3000/products"
                }
            })
        } else {
            res.status(400).json({
                msg : "No product available with this id"
            })
        }

    } catch(err) {
        console.log("err in get product by id : ", err);
        res.status(404).json({
            error : err
        })
    }
    
};


async function updateProduct(req, res) {
    try {
        const id = req.params.productId;
        const updates = {};
        for (let key in req.body) {
            // updates[key.propName] = key.value;
            updates[key] = req.body[key];
        };

        let updateProduct = await Product.updateOne({ _id : id }, { $set : updates });
        res.status(200).json({
            message : "Product Updated...",
            request : {
                type : "GET",
                url : "http://localhost:3000/products/" + id
            }
        });

    } catch(err) {
        console.log("err in update product : ", err);
        res.status(404).json({
            error : err
        });
    }
    
};


async function deleteProduct(req, res) {
    try {
        const id = req.params.productId;
        let deleteOrder = await Order.remove({ product : id });
        let deleteProduct = await Product.remove({ _id : id });

        res.status(200).json({
            msg : "Product deleted...",
            request : {
                type : "POST",
                url : "http://localhost:3000/products",
                body : {
                    name : "String",
                    price : "Number"
                }
            }
        });

    } catch(err) {
        console.log("error in delete product : ", err);
        res.status(400).json({
            error : err
        });
    }

};


module.exports = { getAllProducts, createdProduct, getProductById, updateProduct, deleteProduct };