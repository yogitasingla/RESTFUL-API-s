const express=require('express');
const bank_app=express();
const nodemailer = require('nodemailer');
const multer = require('multer');

var mongoose = require('mongoose');
mongoose.promise=global.promise;
mongoose.connect("mongodb://localhost:27017/banking",{useNewUrlParser:true, useUnifiedTopology: true});
console.log('hoo');

var acSchema =new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    gender:{ type: String, required: true },
    phone_no:{ type:Number, required: true },
    city:{ type:String, required: true },
    Account_no:{
        type:Number,
        default:Math.floor(Math.random()*1E16),

    }
});
var balance = new mongoose.Schema({
    Account_no:{type:Number},
    depositAmount:{ type:Number},
    withdrawRs:{ type:Number},
    transactions:{type:Array},
    updatedAt: {type: Date, default: Date.now}
   //transactions:[]

});

var imageSchema =new mongoose.Schema({
    uploadedImage: { type: String, required: true },
   
});

var bodyParser= require('body-parser');
 bank_app.use(bodyParser.json());
 bank_app.use(bodyParser.urlencoded({extended:true}));


 var person=mongoose.model("person",acSchema);
 var balance=mongoose.model("balance",balance);

var image=mongoose.model("image",imageSchema);
const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./uploads/');
    },
    filename:function(req,file,cb){
        cb(null, Date.now() + '-' +file.originalname );
    }
});
 const fileFilter =(req,file,cb)=>{
     //reject a file
     if(file.mimetype ==="image/jpeg"||file.mimetype ==="image/png"||file.mimetype ==="image/x-nikon-nef")
     {
     cb(null,true);
    }
    else{
        cb(null,false);
    }
}
const upload = multer({storage:storage, fileFilter:fileFilter});

 var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'singlayogita0@gmail.com',
      pass: 'nlqcvntficmntijn'
    }
  });
  
 var mailOptions = {
  from: 'banking',
  to: 'aggarwal7m@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'hii!'
};



 //API for bank REgistration 
 bank_app.post("/register",(req,res)=>{
     
    var phoneno = /^\d{10}$/;
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    var email =req.body.email;
    var usernmame=req.body.username;
    
 
    
        if(usernmame=="" && req.body.email=="" &&req.body.password==""){
            res.send('please fill the details');
        }
        else if(req.body.email==""){
            res.send('please fill the email');
        }
        else if(usernmame==""){
            res.send('please fill the usernmame');
        }
        else if(req.body.password==""){
            res.send('please fill the password');
        }
        if(req.body.phone_no.match(phoneno) && req.body.email.match(mailformat))
         {  
            person.find({email:email},function(err,found){
                if(err){
                    res.send('server error');
                }
                else{
                    
                    if(found[0]){

                        res.send('error: user already exist,please fill the new details');
                    }
                    else{
                            var myData= new person(req.body);
                                myData.save()
                                .then(item =>{
                                    console.log("item======",item);
                                    var myObj = {name:item.username , Account_no:item.Account_no, email:item.email};
                                    
                                    res.send(myObj );
                                })
                                .catch(err => {
                                    res.status(400).send("unable to save to database");
                                });
                                
                    }
                }
            }) 
          
        }
        else {
            res.send('fill the detail in correct format');
        }     

 });
//api for login 
bank_app.post("/login",(req,res)=>{
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
                    res.status(200).send("login sucessfull");
                }else{
                    res.status(401).send("user not exit ");
                }
            }
   
            })
}
 });


// API for change password
 
            bank_app.post("/changePassword",(req,res)=>{
                if(req.body.password=="" ||req.body.newPassword=="" || req.body.conPassword=="" || req.body.email=="")
                    {
                        res.send('please fill  the details');
                    }
                else{
                        
                        person.find({email:req.body.email,password:req.body.password},function(err,found)
                        {
                            if(err)
                            {
                                res.send('server error');
                            }
                            else
                            {
                                if(found[0])
                                {
                                    if(req.body.newPassword==req.body.conPassword)
                                    {
                                        person.updateOne({email:req.body.email},{$set:{password:req.body.newPassword}},function(err,set){
                                            if(err){res.send('password not updatd');}
                                            else{res.send('password change sucessfully');}
                                        })
                                    }
                                    else{
                                        res.send('enter the same password in new password and confirm password');
                                    }
                                }
                                else
                                {
                                    res.send('user not found');
                                }
                            }
                        })
                    }
                    

 });


 // API for forgot password

 bank_app.post('/forgotPassword',(req,res)=>{
     person.find({email:req.body.email},function(err,result){
         if(err)
         {
             res.send('server error');
         }
         else
         {
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });
            
         }
     })
    
 });



 // API for deposit amount to acoount 
 bank_app.post('/depositAmount',(req,res)=>{
    var depositAmount= req.body.depositAmount; //amount entered
    var  Account_no=req.body.Account_no;   
   
    person.find({Account_no:Account_no},function(err,result){
        if(err)
        {
            res.send('account no not found in person');
        }
        else
        {       console.log(result[0]); 
                if(result[0])
                {
                    balance.find({Account_no:Account_no},function(err,result){
                        if(err)
                        {
                            res.send('error');
                        }
                        else
                        {
                            console.log(result[0]);
                            // var newDepositAmount= parseInt(result[0].depositAmount)+parseInt(req.body.depositAmount);
                             
                            if(result[0])
                            {   var newDepositAmount= parseInt(result[0].depositAmount)+parseInt(req.body.depositAmount);   
                                let transactions = result[0].transactions;
                                transactions.push({balance:result[0].depositAmount +'        Date:  '+result[0].updatedAt});
                                transactions.push({deposit:req.body.depositAmount +'        Date:  '+result[0].updatedAt});
                                transactions.push({withdraw:result[0].withdrawRs+'        Date:  '+result[0].updatedAt});

                                balance.updateOne({Account_no:req.body.Account_no},
                                {$set:{depositAmount:newDepositAmount,transactions:transactions}},function(err,results){
                                    if(err){
                                        res.send('error in updating');
                                    }
                                    else{
                                       res.send({' current balance now':result[0].depositAmount+'        Date:  '+result[0].updatedAt});
                                       

                                       
                                    }
                                })
                                
                                
                            }
                            else
                            {
                                var myData= new balance(req.body);
                                let transactions = myData.transactions;
                                transactions.push({depositAmount:myData.depositAmount+'        Date:  '+result[0].updatedAt});
                                console.log(myData);
                                
                                myData.save()
                                .then(item =>{
                                    res.send("item save to the datbase");
                                })
                                .catch(err => {
                                    res.status(400).send("unable to save to database");
                                });
                            }
                        }
                    })

                }
                else
                {
                    res.send('user not exist');
                }
        }
       
       

    })
   
});
 


//API for withdraw amount

 
 bank_app.post('/withdrawAmount',(req,res)=>{
    var withdrawRs=req.body.withdrawRs;
    
    var Account_no=req.body.Account_no;
    balance.find({Account_no},function(err,result){
         if(err)
         {
             res.send('server error in ac no');
         }
         else{
             console.log(result[0]);
                if(result[0])
                {
                  var oldDepositAmount=result[0].depositAmount;
                  let transactions = result[0].transactions;
                  
                    
                        if(oldDepositAmount > withdrawRs){
                           var newDepositAmount=oldDepositAmount-withdrawRs;
                           transactions.push({balance:result[0].newDepositAmount +'        Date:  '+result[0].updatedAt});
                                   
                             transactions.push({withdraw:result[0].withdrawRs+'        Date:  '+result[0].updatedAt});
                             balance.updateOne({Account_no:req.body.Account_no},{$set:{depositAmount:newDepositAmount,withdrawRs:req.body.withdrawRs,transactions:transactions}},function(err,result){
                                if(err){
                                    res.send('server error in updating');
                                }
                                else{
                                   // let transactions = result[0].transactions;
                                   
    

                                    console.log(result);
                                    res.send({'now the amount left is':newDepositAmount});
                                }
                            })
                        }
                        else{
                            res.send('cannot withdraw that much money you have less balance');
                        }
                }
                else{
                    res.send('user not exist');
                }
         }
     })
 });


 //API for check balance
 bank_app.post('/checkBalance',(req,res)=>{
     Account_no=req.body.Account_no;
     balance.find({Account_no:Account_no},function(err,result){
         if(err){
             res.send('server error');

         }
         else{
             if(result[0]){
                    res.send({"balance":result[0].depositAmount});
             }
             else{
                 res.send('error');
             }
         }
     })
 });

//API for checking all the transactions

 bank_app.post('/checkAll',(req,res)=>{
    Account_no=req.body.Account_no;
     balance.find({Account_no:Account_no},function(err,result){
         if(err){
             res.send('server error');

         }
         else{
             if(result[0]){
                    res.send({result:result[0]});
             }
             else{
                 res.send('error');
             }
         }
     })
    
    
    
});

bank_app.post("/upload",upload.single('uploadedImage'),(req,res,next)=>{
    try{
     console.log(req.file);
     if(req.file){
     const  Image = new image({
         uploadedImage:req.file.path
     });
     Image
     .save()
     .then(result=>{
         console.log(result)
         res.status(400).send("saved to the database");
     })
     .catch(err => {
        res.status(400).send("unable to save to database");
    });
    
    
        return res.json({
            success: true,
            message: 'uploading image sucessfully'
        })
    }else{
        return res.json({
            success: false,
            message: 'Failed in uploading images'
        })
    }
}catch(e){
    console.log('Error!', e);
        res.setHeader('Content-Type', 'application/json');
        res.send('error');
        res.end();
   }
});












 

 module.exports=bank_app;