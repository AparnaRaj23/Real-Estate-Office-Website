var express = require('express');
var router = express.Router();


var mysql = require('mysql');  

 var df = require('dateformat');
 
 
 var con = mysql.createConnection({  
  host: '35.213.189.162',
  user: 'urkgr9wtuqha6',
  password: 'password@123',
  database: 'db3ic80zkfi89v'
 });  
 con.connect(function(err) {  
   if (err) throw err;  
   console.log("Connected11111!");  
 });

 router.get('/agent',function(req,res){
      console.log(req.url);
      var user =  req.session.user;
      if(user == null){
        res.redirect("/loginOffice");
        return;
     }
      con.query("select ID,Firstname,Lastname from agent",(err, agnt) => {
        var user =  req.session.user;
        res.render("view_aggent.ejs",{user : user,userData : agnt, tit : "Agent",flag : 1});
    
       });

   
  });

  router.get('/buyer',function(req,res){
    console.log(req.url);
    var user =  req.session.user;
      if(user == null){
        res.redirect("/loginOffice");
        return;
     }
    con.query("select B_ID,Firstname,Lastname from buyer",(err, agnt) => {
      var user =  req.session.user;
      res.render("view_aggent.ejs",{user : user,userData : agnt, tit : "Buyer",flag : 1});
    
     });

 
});

router.get('/seller',function(req,res){
    console.log(req.url);
    var user =  req.session.user;
      if(user == null){
        res.redirect("/loginOffice");
        return;
     }
    con.query("select O_ID,Firstname,Lastname from owner",(err, agnt) => {
      var user =  req.session.user;
      res.render("view_aggent.ejs",{user : user, userData : agnt, tit : "Seller", flag : 1});
     });

 
});
var usr;

router.get('/property',function(req,res){
  var user =  req.session.user;
      if(user == null){
        res.redirect("/loginOffice");
        return;
     }
  var str = "select * from property where Available='Yes'";
  
         
  con.query(str,(err, agnt) => {
    var user =  req.session.user;
    
    res.render("view_aggent.ejs",{user : user,userData : agnt, tit : "Available Properties", flag : 2,flag1 : 1});
     });


});

router.get('/unlistproperty',function(req,res){
  var user =  req.session.user;
      if(user == null){
        res.redirect("/loginOffice");
        return;
     }
  var str = "select * from property where Available='No'";
  
         
  con.query(str,(err, agnt) => {
    var user =  req.session.user;
    
    res.render("view_aggent.ejs",{user : user,userData : agnt, tit : "Unlisted Properties", flag : 2,flag1 : 2});
     });


});



router.post('/property',function(req,res){
  var user =  req.session.user;
      if(user == null){
        res.redirect("/loginOffice");
        return;
     }
  var mx = req.body.max_price;
  var mn = req.body.min_price;
  var address = req.body.Address;
  var s = req.body.Sale;
  var r = req.body.Rent;
  var ad = req.body.ID;
  var o = req.body.O_ID;

  var str = "select * from property where Available='Yes'";
  if(mx.length>0)
    { str = str + " and Original_price<="+Number(mx);}
  if(mn.length>0)
    { str = str + " and Original_price>="+Number(mn);}
  if(address.length>0)
    { str = str + " and Address like '%"+address+"%'";}
  if(s != null)
    { str = str + " and Sale_or_Rent='Sale'";}
  if(r != null)
    { str = str + " and Sale_or_Rent='Rent'";}
    if(ad.length>0)
    { str = str + " and ID ="+Number(ad);}
    if(o.length>0)
    { str = str + " and O_ID ="+Number(o);}
         
  con.query(str,(err, agnt) => {
    var user =  req.session.user;
    res.render("view_aggent.ejs",{user : user,userData : agnt, tit : "Available Properties", flag : 2,flag1 : 1});
     });

});

router.post('/unlistproperty',function(req,res){
  var user =  req.session.user;
      if(user == null){
        res.redirect("/loginOffice");
        return;
     }
  var mx = req.body.max_price;
  var mn = req.body.min_price;
  var address = req.body.Address;
  var s = req.body.Sale;
  var r = req.body.Rent;
  
  var ad = req.body.ID;
  var o = req.body.O_ID;
  
  var str = "select * from property where Available='No'";
  if(mx.length>0)
    { str = str + " and Original_price<="+Number(mx);}
  if(mn.length>0)
    { str = str + " and Original_price>="+Number(mn);}
  if(address.length>0)
    { str = str + " and Address like '%"+address+"%'";}
  if(s != null)
    { str = str + " and Sale_or_Rent='Sale'";}
  if(r != null)
    { str = str + " and Sale_or_Rent='Rent'";}

  if(ad.length>0)
    { str = str + " and ID ="+Number(ad);}
    if(o.length>0)
    { str = str + " and O_ID ="+Number(o);}

  con.query(str,(err, agnt) => {
    var user =  req.session.user;
    res.render("view_aggent.ejs",{user : user,userData : agnt, tit : "Unlisted Properties", flag : 2,flag1 : 2});
     });

});



setInterval(function(){con.query('select 1');},5000);
module.exports = router;