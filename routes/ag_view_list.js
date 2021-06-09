var express = require('express');
var router = express.Router();
 
 
var mysql = require('mysql');  
 
 var df = require('dateformat');
 var bp = require('body-parser');
 
 
router.use(bp.urlencoded( {extended: true}));
 
 
 var con = mysql.createConnection({  
  host: '35.213.189.162',
  user: 'urkgr9wtuqha6',
  password: 'password@123',
  database: 'db3ic80zkfi89v'
 });  
 con.connect(function(err) {  
   if (err) throw err;  
   console.log("Connected!");  
 });
 
 router.get('/agent',function(req,res){
      console.log(req.url);
      var user =  req.session.user;
      if(user == null){
        res.redirect("/login");
        return;
     }
      con.query("select ID,Firstname,Lastname from agent",(err, agnt) => {
        var user = req.session.user;
        res.render("ag_view_list.ejs",{user : user, userData : agnt, tit : "Agent",flag : 1});
    
       });
 
   
  });
 
  router.get('/buyer',function(req,res){
    console.log(req.url);
    var user =  req.session.user;
    if(user == null){
      res.redirect("/login");
      return;
   }
    var sql = "select b.B_ID,b.Firstname,b.Lastname from buyer b, sale_details ts where (ts.ID = " + user.ID + " and b.B_ID = ts.B_ID) union select b.B_ID,b.Firstname,b.Lastname from buyer b, sale_details tr where (tr.ID =" + user.ID +" and b.B_ID = tr.B_ID)"
 
    
    console.log(sql);
    con.query(sql,(err, agnt) => {
      var user = req.session.user;
      res.render("ag_view_list.ejs",{user : user, userData : agnt, tit : "Buyer",flag : 1});
    
     });
 
 
});
 
router.get('/seller',function(req,res){
    console.log(req.url);
   
    var user =  req.session.user;
    if(user == null){
      res.redirect("/login");
      return;
   }
    con.query("select o.O_ID,o.Firstname,o.Lastname from owner o,property p where o.O_ID=p.O_ID and p.ID = "+user.ID,(err, agnt) => {
      var user = req.session.user;
      res.render("ag_view_list.ejs",{user : user, userData : agnt, tit : "Seller", flag : 1});
     });
 
 
});
 
router.get('/property',function(req,res){
  console.log(req.url);
  var user =  req.session.user;
  if(user == null){
    res.redirect("/login");
    return;
 }
  con.query("select * from property where Available='Yes' and ID= "+user.ID,(err, agnt) => {
    var user = req.session.user;
  
  res.render("ag_view_list.ejs",{user: user, userData : agnt, tit : "Available Properties", flag : 2});
   });
 
 
});
 
 
router.post('/property',function(req,res){
  var user =  req.session.user;
  if(user == null){
    res.redirect("/login");
    return;
 }
  var mx = req.body.max_price;
  var mn = req.body.min_price;
  var ad = req.body.Address;
  var s = req.body.Sale;
  var r = req.body.Rent;
  var o = req.body.O_ID;
  
  var str = "select * from property where Available='Yes' and ID= "+user.ID;
  if(mx.length>0)
    { str = str + " and Original_price<="+Number(mx);}
  if(mn.length>0)
    { str = str + " and Original_price>="+Number(mn);}
  if(ad.length>0)
    { str = str + " and Address like '%"+ad+"%'";}
  if(s != null)
    { str = str + " and Sale_or_Rent='Sale'";}
  if(r != null)
    { str = str + " and Sale_or_Rent='Rent'";}
  if(o.length>0)
    { str = str + " and O_ID="+Number(o);}
         
  con.query(str,(err, agnt) => {
    var user = req.session.user;
    res.render("ag_view_list.ejs",{user: user, userData : agnt, tit : "Available Properties", flag : 2});
     });
 
});
 
 
setInterval(function(){con.query('select 1');},5000);
module.exports = router;
 

