const express=require('express');
const bank_login_app=express();
var mongoose = require('mongoose');
mongoose.promise=global.promise;
mongoose.connect("mongodb://localhost:27017/banking",{useNewUrlParser:true, useUnifiedTopology: true});

var loginSchema =new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
});


var bodyParser= require('body-parser');
 bank_login_app.use(bodyParser.json());
 bank_login_app.use(bodyParser.urlencoded({extended:true}));
 var login=mongoose.model("login",loginSchema);


 //api for login 
 bank_login_app.post("/login",(req,res)=>{
    if(req.body.username=="" && req.body.password==""){
        res.send('please fill the details');
        }
        else if(req.body.password==""){
             res.send('please fill the password');
        }
         else if(req.body.username==""){
             res.send('please fill the usernmame');
        }

     else{
        person.find({username:req.body.username,password:req.body.password},function(err,user){
            if (err){
                res.status(500).send("internal server error");
            }else{
                console.log(user);
                if(user[0]){
                    res.status(200).send({"userId":user[0]._id});
                }else{
                    res.status(401).send("fail");
                }
            }
   
            })

}



 });



 module.exports=bank_login_app;