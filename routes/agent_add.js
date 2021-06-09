var express = require('express');
var router = express.Router();
var mysql = require('mysql');  
 
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
 
router.get("/property",function(req,res){
  var user =  req.session.user;
  if(user == null){
    res.redirect("/login");
    return;
 }
  con.query("select O_ID,Firstname,Lastname from owner",(err, agnt) => {
    var user = req.session.user;
    res.render("addproperty.ejs",{ user: user, error : "",Data : agnt});
  
    });
  });
 
  router.get("/propertyUpdate/:propid",function(req,res){
  console.log("I AM IN UPDATE");
  var user =  req.session.user;
  if(user == null){
    res.redirect("/login");
    return;
 }
    con.query("select O_ID,Firstname,Lastname from owner",(err, agnt) => {
      var propid = req.params.propid;
      con.query("select * from property where P_ID="+propid,(err,currData) =>{
       
        var user = req.session.user;
        res.render("updateproperty.ejs",{ user: user, error : "",Data : agnt, curr : currData});
      });
     
    
      });
    });
 
    router.get("/propertyUnlist/:propid",function(req,res){
      console.log("I AM IN UPDATE");
      var user =  req.session.user;
      if(user == null){
        res.redirect("/login");
        return;
     }
     var propid = req.params.propid;
        con.query("update property set Available='No' where P_ID="+propid,(err, agnt) => {
          var propid = req.params.propid;
          res.redirect("/agent/view/property");
      });
  });
 
    
router.get("/buyer",function(req,res){
  var user =  req.session.user;
  if(user == null){
    res.redirect("/login");
    return;
 }
    res.render("ag_add_bs.ejs",{user: user, error : "",tit : "buyer"});
});
 
router.get("/buyerUpdate/:bid",function(req,res){
  var user =  req.session.user;
  if(user == null){
    res.redirect("/login");
    return;
 }
 
 var buyerid = req.params.bid;
 var sql = "select * from buyer where B_ID="+buyerid;
 con.query(sql,(err, buyerdata)=>{
      if(err){
            var sql = "select b.B_ID,b.Firstname,b.Lastname from buyer b, sale_details ts where (ts.ID = " + user.ID + " and b.B_ID = ts.B_ID) union select b.B_ID,b.Firstname,b.Lastname from buyer b, sale_details tr where (tr.ID =" + user.ID +" and b.B_ID = tr.B_ID)"
 
            con.query(sql,(err, agnt) => {
              var user = req.session.user;
              res.render("ag_view_list.ejs",{user : user, userData : agnt, tit : "buyer",flag : 1});
              })
              }
      else {
        res.render("ag_add_bs_update.ejs",{user: user,error : "",tit : "buyer", ownerData : buyerdata});
      }
  });
});
 
router.get("/seller",function(req,res){  
  var user =  req.session.user;
  if(user == null){
    res.redirect("/login");
    return;
 }
    res.render("ag_add_bs.ejs",{user: user,error : "",tit : "seller", ownerData:{} });
});
 
router.get("/sellerUpdate/:oid",function(req,res){  
  var user =  req.session.user;
  if(user == null){
    res.redirect("/login");
    return;
 }
 var ownerid = req.params.oid;
 var sql = "select * from owner where O_ID="+ownerid;
 con.query(sql,(err, ownerdata)=>{
      if(err){
        con.query("select o.O_ID,o.Firstname,o.Lastname from owner o,property p where o.O_ID=p.O_ID and p.ID = "+user.ID,(err, agnt) => {
          var user = req.session.user;
          res.render("ag_view_list.ejs",{user : user, userData : agnt, tit : "seller", flag : 1});
         });
      }
      else{
  res.render("ag_add_bs_update.ejs",{user: user,error : "",tit : "seller", ownerData : ownerdata});
      }
 });
    
});
 
router.get("/payment",function(req,res){
  var user =  req.session.user;
  if(user == null){
    res.redirect("/login");
    return;
 }
  con.query("select B_ID,Firstname,Lastname from buyer",(err, agnt) => {
    var user = req.session.user;
    con.query("select P_ID,Sale_or_Rent from property where Available='Yes' and ID="+user.ID,(err, agnt1) => {
      res.render("payment.ejs",{user : user, error :"",Data : agnt,Data1 : agnt1});
    });
  
    });
  });
 
router.post("/property",function(req,res){
  var user =  req.session.user;
  if(user == null){
    res.redirect("/login");
    return;
 }
  var s = "insert into property(Available,Address,Bedroom,Area,Sale_or_Rent,Original_price,Bathroom,O_ID,ID) values ('Yes'";
  s+= ",'"+req.body.hno+","+req.body.road+" ,"+req.body.zip+"'";
  s+=","+Number(req.body.Bedroom);
  s+=","+Number(req.body.Area);
  s+=",'"+req.body.Sale_or_Rent+"'";
  s+=","+Number(req.body.Original_price);
  s+=","+Number(req.body.Bathroom);
  s+=","+Number(req.body.seller);
  s+=","+user.ID+")";
 
  console.log(s);
  con.query(s,(err, agnt) => {
      
        con.query("select O_ID,Firstname,Lastname from owner",(err, agnt) => {
          var user = req.session.user;
          res.render("addproperty.ejs",{user: user, error : " Property added successfully !",Data : agnt});
          });
      
 
  });
});
 
router.post("/propertyUpdate",function(req,res){
  var user =  req.session.user;
  if(user == null){
    res.redirect("/login");
    return;
 }
  var s = "update property set Available='Yes', Address='" +req.body.hno+",";
  
  s+=req.body.pname+", ";
 
 
  s= s +req.body.road+","+req.body.zip+"'";
 
  s=s+",Bedroom ="+ req.body.Bedroom+",Area ="+ req.body.Area+",Sale_or_Rent='"+ req.body.Sale_or_Rent +"',Original_price="+ req.body.Original_price+",Bathroom="+ req.body.Bathroom+",O_ID="+ req.body.seller+",ID="+user.ID+" where P_ID="+ req.body.propid;
  console.log(s);
 con.query(s,(err, agnt) => {
       if(err){
       con.query("select O_ID,Firstname,Lastname from owner",(err, agnt) => {
        var user = req.session.user;
       res.render("addproperty.ejs",{user : user ,error : "Some Date is in wrong format!!",Data : agnt});
       });
      }
      else{
        con.query("select O_ID,Firstname,Lastname from owner",(err, agnt) => {
          var user = req.session.user;
          res.render("addproperty.ejs",{user: user, error : " Property added successfully !",Data : agnt});
          });
      }
 
  });
  
});
 
 
 
 
/////////////////////////////////////////payment post////////////////////////////////////////////////
 
router.post("/payment",function(req,res){
  var user =  req.session.user;
  if(user == null){
    res.redirect("/login");
    return;
 }
 
  if(req.body.tran_type=="Rent")
  {
    console.log("rent");
    console.log(req.body.pid);
    con.query("select Available from property where P_ID="+Number(req.body.pid),(err, agnt) => {
      console.log(agnt);
      if(agnt[0].Available=="No"){
        console.log(agnt);
        con.query("select B_ID,Firstname,Lastname from buyer",(err, agnt) => {
          var user = req.session.user;
          con.query("select P_ID,Sale_or_Rent from property where Available='Yes' and ID="+user.ID,(err, agnt1) => {
          res.render("payment.ejs",{user : user, error : "Property already transacted ! Not available",Data : agnt,Data1 : agnt1});
        });
      });
      }
      else
      {
        con.beginTransaction(function(err) {
        var s = "insert into rent_details(Rent,Start_Date,END_DATE,ID,P_ID,B_ID) values (";
        var user = req.session.user;
        s+=Number(req.body.Rent);
        s+=",'"+req.body.date+"'";
        s+=",'"+req.body.END_DATE+"'";
        s+=","+user.ID;
        s+=","+Number(req.body.pid);
        s+=","+Number(req.body.buyer)+")";
       
        console.log(s);
        
        con.query(s,(err, a) => {
          if(err){
            console.log(err);
            console.log("error");
            con.rollback(function() {
              throw err;
            });
          }
          con.query("update property set Available='No' where P_ID="+Number(req.body.pid),(err, ab) => {
               if(err)
               { 
                 console.log(err);
                 con.rollback(function() {
                  throw err;
                  return;
                });
              }
              con.commit(function(err) {
                if (err) { 
                  con.rollback(function() {
                    throw err;
                    return;
                  });
                }
                console.log('Transaction Complete.');
                con.query("select B_ID,Firstname,Lastname from buyer",(err, agnt) => {
                  var user = req.session.user;
                  console.log("buyer");
                  console.log(user.ID);
                  con.query("select P_ID,Sale_or_Rent from property where Available='Yes' and ID="+user.ID,(err, agnt1) => {
                    console.log(agnt1);
                    res.render("payment.ejs",{user : user, error : "Transaction complete !",Data : agnt,Data1 : agnt1});
                  });
                });
 
              });
               
               
          });
        });
      });
      }
  });
  }
  else
  {
    console.log("sale");
    con.query("select Available from property where P_ID="+Number(req.body.pid),(err, agnt) => {
      console.log(agnt);
      if(agnt[0].Available=="No"){
        console.log(agnt);
        con.query("select B_ID,Firstname,Lastname from buyer",(err, agnt) => {
          var user = req.session.user;

          con.query("select P_ID,Sale_or_Rent from property where Available='Yes' and ID="+user.ID,(err, agnt1) => {
            res.render("payment.ejs",{user : user, error : "Property already transacted ! Not available",Data : agnt,Data1 : agnt1});
          });
        });
      }
      else
      {
        con.beginTransaction(function(err) {
        var s = "insert into sale_details(Sell_price,S_date,ID,P_ID,B_ID) values (";
        s+=Number(req.body.Sell_price);
        s+=",'"+req.body.date+"'";
        var user = req.session.user;
        s+=","+user.ID;
        s+=","+Number(req.body.pid);
        s+=","+Number(req.body.buyer)+")";
        console.log(s);

        con.query(s,(err, a) => {
          if(err){
            console.log(err);
            console.log("error");
            con.rollback(function() {
              throw err;
            });
          }
          con.query("update property set Available='No' where P_ID="+Number(req.body.pid),(err, ab) => {
               if(err)
               { 
                 console.log(err);
                 con.rollback(function() {
                  throw err;
                });
              }
              con.commit(function(err) {
                if (err) { 
                  con.rollback(function() {
                    throw err;
                  });
                }
                console.log('Transaction Complete.');
                con.query("select B_ID,Firstname,Lastname from buyer",(err, agnt) => {
                  
                  var user = req.session.user;
                  con.query("select P_ID,Sale_or_Rent from property where Available='Yes' and  ID="+user.ID,(err, agnt1) => {
                    console.log(agnt1);
                    res.render("payment.ejs",{user : user, error : "Transaction complete !",Data : agnt,Data1 : agnt1});
                  });
                });
              });
               
               
          });
        });
      });
      }
  });
  }
  


});

 
router.post("/updateAgentCredentials",function(req,res){
  var user =  req.session.user;
  if(user == null){
    res.redirect("/login");
    return;
 }
 
 var sql = "UPDATE login set username='"+req.body.newusername+"', password='"+req.body.newpassword+"' where ID="+user.ID;
  console.log(sql);
  con.query(sql,(err, cred) => {
    if(err){
      res.render("dashboard.ejs",{user: user, message:{ "text":"Something went wrong!","newuser":"", "newpass":""}});
  
   }
   else{
    res.render("dashboard.ejs",{user: user, message: { "text":"Credentials updated!","newuser":"Username: "+req.body.newusername, "newpass":"Password: "+req.body.newpassword}});
  
   }
 
});
  
 
});
 
 
  setInterval(function(){con.query('select 1');},5000);
module.exports = router;
 

