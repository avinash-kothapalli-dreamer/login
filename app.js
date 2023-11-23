const express = require('express');
const app =express();
const mongoose = require("mongoose");
app.use(express.json());
const cors = require("cors")
app.use(cors())
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const JWT_SECRET = "1234rfgfd"
const mongoUrl = "mongodb+srv://Avinash:avinash@cluster0.h5pqcqq.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(mongoUrl,{
}).then(()=>{
    console.log("connected")
}).catch((e)=>{
    console.log("hii");
    console.log(e);
})

// app.post("/post", async(req,res)=>{
//     console.log(req.body);
//     const {data} = req.body;

//     if(data=="avinash"){
//         res.send({status:"ok"})
//     }
// })

require("./userdetails");

const user = mongoose.model("UserInfo");

app.post("/register",async(req,res)=>{
    const {fname,lname,email,password} = req.body;
    //console.log(req.body);
    //console.log("hii")
    

    try{
       const olduser = await user.findOne({email});
       // console.log(olduser);
        if(olduser){
           return res.json({error: "user exists"});
           
        }
         console.log("up running")
         //console.log(await bcrypt.hash(password,10));
        const encyptPass = await bcrypt.hash(password,10);
        //  console.log(encryptPass);
     await user.create({
        fname,
        lname,
        email,
        password:encyptPass
     });
     res.send({status:"ok"});
    }catch(e){
        console.log(e)
     res.send({status:"error7"});
    }
})
app.post("/login",async(req,res)=>{
    // console.log(req.body)
    //console.log("hii")
    const {email,password} = req.body;
    const user1 = await user.findOne({email});
    // console.log(user1)
    if(!user1){
        //console.log("jii")
        return res.json({error:"user not exists"})
    }
   // console.log("jii2")
    console.log(user1.password)
    if(await bcrypt.compare(password,user1.password)){
        const token = jwt.sign({email:user1.email},JWT_SECRET,{
            expiresIn:10
        });
        if(res.status(200)){
            return res.json({status:"ok",data:token});
        }else{
            return res.json({error:"error"});
        }
    }else{
        return res.json({status:"error",error:"Invalid password"})
    }
})
app.post("/userData",async(req,res)=>{
    // console.log("hiiii")
    const {token} = req.body;
    // console.log(token);
    try {
       const user1 = await jwt.verify(token,JWT_SECRET,(err,res)=>{
        if(err){
            return "token expired";
        }else{
            return res;
        }
        console.log(err,"error");
        console.log(res,"result")
       });
       if(user1 == "token expired"){
        return res.send({status:"error",data:"token expired"});
       }
       const useremail = user1.email;
       user.findOne({email:useremail})
       .then((data)=>{
        //console.log(data);
        res.send({status:"ok",data:data});
       })
       .catch((error)=>{
        res.send({status:"error",data:error});
       })

    } catch (error) {
        
    }
})
app.post('/forget-password',async(req,res)=>{
    const {email} = req.body;
    const olduser = await user.findOne({email});
    // console.log(olduser);
     if(olduser){
        return res.json({status: "email not exists"});
       
        }

        const secret = JWT_SECRET+olduser.password;
        const token = jwt.sign({email:olduser.email,id:olduser._id},secret,{
            expiresIn:"5m"
        });
        const link = `http://localhost:5000/reset-password/${olduser._id}/${token}`
        console.log(link);
        
     

})
app.listen(5000,()=>{
    console.log("server started");
})