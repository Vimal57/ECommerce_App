const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const orderRoute = require("./routes/order");
const productRoute = require("./routes/product");
const userRoute = require("./routes/user");
const url = "mongodb://localhost:27017/eCommerceApp";
const port = process.env.PORT || 3000;


mongoose.connect(url, {
    useNewUrlParser : true
}).then(() => {
    console.log("Database connected successfully...");
}).catch(err => {
    console.log("Err in database connection :: ", err);
});




app.use("/uploads", express.static("uploads"));
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());
app.use("/products", productRoute);
app.use("/orders", orderRoute);
app.use("/user", userRoute);


app.listen(port, () => {
    console.log("Listening to the port : ", port);
});