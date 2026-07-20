const client = require("../database");


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
module.exports={UpdateProfile,getProfile};