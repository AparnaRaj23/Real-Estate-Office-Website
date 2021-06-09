var express = require('express');
var router = express.Router();
var mysql = require('mysql');  
 
 
 
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
 
 
 router.get('/:thing',function(req,res){
  var user =  req.session.user;
  if(user == null){
    res.redirect("/loginOffice");
    return;
 }
      var d = req.params.thing;
      if(d==="rent") 
      {
        con.query("select TR_ID,Start_Date,END_DATE,t.ID,t.P_ID,Rent,Bedroom,Address,t.B_ID from property p ,rent_details t where p.P_ID=t.P_ID",(err, agnt) => {
        console.log(agnt);
        
        res.render("prop_tran.ejs",{ user: user,userData : agnt ,tit : "Rented Properties", flag : 2 });
       }); 
      }
      if(d==="sale") 
      {
        con.query("select TS_ID,S_date,t.ID,t.P_ID,Sell_price,Bedroom,Address,t.B_ID from property p ,sale_details t where p.P_ID=t.P_ID",(err, agnt) => {
         
          res.render("prop_tran.ejs",{user: user,userData : agnt , tit : "Sold Properties", flag : 1});
        
       });
      }
  
 
      router.post('/sale',function(req,res){
        var user =  req.session.user;
        if(user == null){
          res.redirect("/loginOffice");
          return;
       }
        var mx = req.body.max_price;
        var mn = req.body.min_price;
        var ad = req.body.Address;
        var sd = req.body.S_date;
        var b = req.body.Bedroom;
        var a = req.body.ID;
        var by = req.body.B_ID;
        var str = "select TS_ID,S_date,t.ID,t.P_ID,Sell_price,Bedroom,Address,t.B_ID from property p ,sale_details t where p.P_ID=t.P_ID ";
        console.log(req.body);
        if(mx.length>0)
          { str = str + " and t.Sell_price <="+Number(mx);}
        if(mn.length>0)
          { str = str + " and t.Sell_price >="+Number(mn);}
        if(ad.length>0)
          { str = str + " and Address like '%"+ad+"%'";}
        if(sd.length>0)
          { str = str + " and S_date = '"+sd+"'";}
        if(b.length>0)
          { str = str + " and Bedroom ="+Number(b);}
          if(a.length>0)
          { str = str + " and t.ID ="+Number(a);}
          if(by.length>0)
          { str = str + " and t.B_ID ="+Number(by);}
        
               console.log(str);
        con.query(str,(err, agnt) => {
          var user = req.session.user;
          res.render("prop_tran.ejs",{user : user, userData : agnt , tit : "Sold Properties", flag : 1});
           });
      
      });
    
    
    
    router.post('/rent',function(req,res){
        var user =  req.session.user;
        if(user == null){
          res.redirect("/loginOffice");
          return;
       }
        var mx = req.body.max_price;
        var mn = req.body.min_price;
        var ad = req.body.Address;
        var sd = req.body.Start_Date;
        var b = req.body.Bedroom;
        var a = req.body.ID;
        var by = req.body.B_ID;
        
        var str = "select TR_ID,Start_Date,END_DATE,t.ID,t.P_ID,Rent,Bedroom,Address,t.B_ID from property p ,rent_details t where p.P_ID=t.P_ID ";
        console.log(req.body);
        if(mx.length>0)
          { str = str + " and t.Rent <="+Number(mx);}
        if(mn.length>0)
          { str = str + " and t.Rent >="+Number(mn);}
        if(ad.length>0)
          { str = str + " and Address like '%"+ad+"%'";}
        if(sd.length>0)
          { str = str + " and Start_Date = '"+sd+"'";}
        if(b.length>0)
          { str = str + " and Bedroom ="+Number(b);}
          if(a.length>0)
          { str = str + " and t.ID ="+Number(a);}
          if(by.length>0)
          { str = str + " and t.B_ID ="+Number(by);}
        
               console.log(str);
        con.query(str,(err, agnt) => {
          var user = req.session.user;
          res.render("prop_tran.ejs",{user : user, userData : agnt ,tit : "Rented Properties", flag : 2 });
           });
      
      });
   
  });
 
 
 
  setInterval(function(){con.query('select 1');},5000);
module.exports = router;
 

