const client=require("../database");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");


const register=async (req,res)=>{
    const { name, email, password, phone, address } = req.body;

   
    console.log(req.body);
    if(name.trim()==="" || email.trim()==="" || password.trim()==="" || phone.trim()==="" || address.trim()=="")
       { return res.json({
    success:false,
    message:"please enter All Fields"
        })
    }
    if(name.trim()==="")
        return res.json({
    success:false,
    message:"Enter name please"
    })
    if(email.trim()==="")
        return res.json({
    success:false,
    message:"Enter email please"
    }) 
    if(password.trim()==="")
        return res.json({
    success:false,
    message:"Enter password please"
    })
    if(phone.trim()==="")
        return res.json({
    success:false,
    message:"Enter Phone no. please"
    })
    if(address.trim()==="")
        return res.json({
    success:false,
    message:"Enter address please"
    })   

    const hashedPassword=await bcrypt.hash(password,10);

    const query="insert into users(name,email,password,phone,address)values($1,$2,$3,$4,$5)";
    
    try{
        await client.query(query,[name,email,hashedPassword,phone,address]);
        return res.json({
    success:true,
    message:"Data inserted successfully"});

    }
     catch(err){
        if(err.code==="23505")
        {
            const constraintMessages = {
               users_email_key: "Email is already registered",
               users_phone_key: "Phone number is already registered",
               users_username_key: "Username is already registered",
               users_pan_key: "PAN number is already registered"
            };
            const message = constraintMessages[err.constraint] || "Duplicate value already exists";
            constraintMessages[err.constraint];
            return res.json({
              success: false,
              message: message
            });
        }
        else{
          return res.json({
            success:false,
            message:"Internal Server Error"
           });
        }
    } 

}

const login=async (req , res)=>{

    const {email,password}=req.body;

    if(email.trim()==="" || password.trim()==="")
        return res.json({
    success:false,
    message:"Invalid email or password"
    })

    const query="SELECT * FROM users WHERE email = $1;";

    try{
     const result= await client.query(query,[email]);
    if(result.rows.length===0)
    {
       return res.json({
          success: false,
          message: "Invalid email or password"
       })
    };   
    const ismatch= await bcrypt.compare(password,result.rows[0].password);
    
    if(ismatch)
    {   
       const token=jwt.sign({
        id:result.rows[0].id,   //payload
        email:result.rows[0].email
       },
       process.env.JWT_SECRET,  //secrete key
       {
        expiresIn:"7d"   //token expire time
       }
    );
       return res.json({
          success:true,
          message:"Login Successfully",
          token
       })        
    } 
    else
    {
        return res.json({
            success:false,
            message:"Invalid email or password"
        })
    }       

    }
    catch(err){
        return res.json({
            success:false,
            message:err.message
        })
    }
}

module.exports={register,login};