 const {Client}=require("pg");//cimport the library and {} this is bcs we are using the member client of pg library
  const client =new Client({//creating the client 
    host:"localhost",
    port:5432,
    user:"postgres",
    password:"admin123",
    database:"Krushi_Mitra"

})
client.connect()// connecting to client 
.then(()=>{
    console.log("Database successfully connected")
})
.catch((err)=>{
    console.log(err);
})

module.exports = client; //it will make the client available to other file 