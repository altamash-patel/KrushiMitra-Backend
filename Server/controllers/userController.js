const client = require("../database");
const bcrypt=require("bcrypt");


const getProfile = (req, res) => {

    return res.json({
        success: true,
        message: "Welcome",
        user: req.user
    });

}

const UpdateProfile=async(req,res)=>{

    const {name,phone,address}=req.body;
    const userId = req.user.id;
    if(!name.trim() || !phone.trim() || !address.trim())
        return res.status(400).json({
    success:false,
    message:"Fill the data for update"
    })
    const query="update users set name=$1 , phone=$2 , address=$3 where id=$4";
    try{
    const result=await client.query(query,[name,phone,address,userId]);
    if(result.rowCount==0)
    {
        return res.status(404).json({
            success:false,
            message:"Something goes Wrong"
        })
    }
    else{
        return res.status(200).json({
        success:true,
        message:"Profile Updated successfully",
        user:req.user
        })
    }
    }
    catch(err){
        console.error(err);
        return res.status(500).json({
            success:false,
            message:"Internal server Problem"
        })
    }

}

const UpdatePassword=async(req,res)=>{
    const {currentPassword,newPassword,confirmPassword}=req.body;
    const userId=req.user.id;
    if(!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim())
        return res.status(400).json({
    success:false,
    message:"Enter All the Required Data"
    })
    else{
        if(newPassword !==confirmPassword)
        {
            return res.status(400).json({
                success:false,
                message:"New password and confirm password are not matched"
            })
        }
        if(currentPassword===newPassword)
            return res.json({
        success:false,
        message:"New password must be different from the current password."
        })
    }
    
    const query1="select password from users where id=$1";
    const query2="update users set password=$1 where id=$2"
    try{
    const result1=await client.query(query1,[userId]);

    if(result1.rowCount===0)
        return res.status(404).json({
    success:false,
    message:"User not found"
    })
    const storedPassword = result1.rows[0].password;
    const isMatch = await bcrypt.compare(
      currentPassword,
      storedPassword
    );
    if(!isMatch)
    {
        return res.status(401).json({
            success:false,
            message:"Enters password is wrong"
        })
    }
    const newHashedPassword=await bcrypt.hash(newPassword,10)

    const result2=await client.query(query2,[newHashedPassword,userId]);
    if(result2.rowCount===0)
    {
        return res.status(500).json({
            success:false,
            message:"Internal Database Problem"
        })
    }
    else{
        return res.status(200).json({
            success:true,
            message:"Password Updated Successfully"
        })
    }

    
    }
    catch(err){
        console.error(err);
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        })

    }

}
module.exports={UpdateProfile,getProfile,UpdatePassword};