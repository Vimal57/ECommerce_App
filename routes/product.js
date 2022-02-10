const express = require("express");
const router = express.Router();
const authorize = require("../middleware/check-auth");
const multer = require("multer");
const { getAllProducts, createdProduct, getProductById, updateProduct, deleteProduct } = require("../controllers/product");

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
router.get("/", getAllProducts);


/**
 * @param {*} req
 * @param {*} res
 * @description "for add a new product"
 * @author "Vimal Solanki (zignuts technolabs)"
 */
router.post("/", authorize, upload.single("productImage"), createdProduct)


/**
 * @param {*} req
 * @param {*} res
 * @description "get product with productID"
 * @author "Vimal Solanki (zignuts technolabs)"
 */
router.get("/:productId", getProductById);


/**
 * @param {*} req
 * @param {*} res
 * @description "update product details with productID"
 * @author "Vimal Solanki (zignuts technolabs)"
 */
router.patch("/:productId", authorize, updateProduct);


/**
 * @param {*} req
 * @param {*} res
 * @description "delete product with productID"
 * @author "Vimal Solanki (zignuts technolabs)"
 */
router.delete("/:productId", authorize, deleteProduct);

module.exports = router;