const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = require("../models/product");
const multer = require("multer");

const storage = multer.diskStorage({
    destination : function(req, file, cb){
        cb(null, "./uploads/");
    },
    filename : function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    // if i want only png/jpg file than this will filter that files
    if(file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({ 
    storage : storage, 
    limits : {
        fileSize : 1024 * 1024 * 5
    },
    fileFilter : fileFilter 
});


/**
 * @param {*} req
 * @param {*} res
 * @description "For fetch all products"
 * @author "Vimal Solanki (zignuts technolabs)"
 */
router.get("/", async (req, res) => {
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
});


/**
 * @param {*} req
 * @param {*} res
 * @description "for add a new product"
 * @author "Vimal Solanki (zignuts technolabs)"
 */
router.post("/", upload.single("productImage"), async (req, res) => {
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
    
})


/**
 * @param {*} req
 * @param {*} res
 * @description "get product with productID"
 * @author "Vimal Solanki (zignuts technolabs)"
 */
router.get("/:productId", async (req, res) => {
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
    
});


/**
 * @param {*} req
 * @param {*} res
 * @description "update product details with productID"
 * @author "Vimal Solanki (zignuts technolabs)"
 */
router.patch("/:productId", async (req, res) => {
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
    
});


/**
 * @param {*} req
 * @param {*} res
 * @description "delete product with productID"
 * @author "Vimal Solanki (zignuts technolabs)"
 */
router.delete("/:productId", async (req, res) => {
    try {
        const id = req.params.productId;
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
})

module.exports = router;