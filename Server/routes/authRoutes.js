const express = require("express");
const router = express.Router();

router.get("/",(req,res)=>{
    console.log("welcome root router");
    res.send("welcome client");
})
const authMiddleware = require("../middleware/authMiddleware");

const { register, login } = require("../controllers/authController");
const { UpdateProfile,getProfile } = require("../controllers/userController");
router.post("/registration",register); 

router.post("/login", login)    //login route

router.get("/profile", authMiddleware, getProfile); //get profile
router.put("/profile",authMiddleware,UpdateProfile);
module.exports = router;