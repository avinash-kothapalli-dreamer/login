const mongoose = require("mongoose");
const userdetailschema = new mongoose.Schema({
  fname:String,
  lname:String,
  email:{type:String,unique:true},
  password:String,
},{
    collection:"UserInfo",
});

mongoose.model("UserInfo",userdetailschema);