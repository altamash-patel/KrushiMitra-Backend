

const express=require("express"); // loaded the express into memory
const client = require("./database");
require("dotenv").config();

const app = express();   //express application has started 
app.use(express.json())  //like a middleware which will help the express by converting the json into object 

console.log("JWT =", process.env.JWT_SECRET);
app.use("/api/auth", require("./routes/authRoutes"));
app.listen(5000,()=>{
    console.log(" krushi mitra server successfuly started");
});