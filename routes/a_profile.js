var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var con = mysql.createConnection({
  host: '35.213.189.162',
  user: 'urkgr9wtuqha6',
  password: 'password@123',
  database: 'db3ic80zkfi89v'
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

var prr, pss, ts;

router.get('/:thing', function (req, res) {
  console.log(req.url);
  var d = req.params.thing;
  var user = req.session.user;
  if (user == null) {
    if (d[1] == 'A')
      res.redirect("/login");
    else
      res.redirect("/loginOffice");

    return;
  }
  if (d[0] === "a") {
    var s = "select * from agent where ID =" + d.substring(1);
    con.query(s, (err, agnt) => {
      //  con.query("select username from login where ID="+d.substring(1),(err, agnt1) => {
      var user = req.session.user;
      console.log(user);
      res.render("ag_profile.ejs", { user: user, tit: "Agent", name: agnt[0].Firstname + " " + agnt[0].Lastname, con: agnt[0].Phone_Number, email: agnt[0].Email_ID, id: agnt[0].ID, user: agnt[0].ID, flag: 3, type: d[1] });
      // });
    });
  }

  if (d[0] === "b") {
    var s = "select * from buyer where B_ID =" + d.substring(2);
    con.query(s, (err, agnt) => {
      var user = req.session.user;
      console.log(user);

      con.query("select * from rent_details t,property p where p.P_ID=t.P_ID and t.B_ID=" + agnt[0].B_ID, (err, agent) => {
        con.query("select * from sale_details t,property p where p.P_ID=t.P_ID and t.B_ID=" + agnt[0].B_ID, (err, agent1) => {

          res.render("ag_profile.ejs", { user: user, tit: "Buyer", name: agnt[0].Firstname + " " + agnt[0].Lastname, con: agnt[0].Phone_Number, email: agnt[0].Email_ID, id: agnt[0].B_ID, user: agnt[0].ID, flag: 1, userDataRent: agent, userDataSale: agent1, type: d[1] });
        });
      });
    });
  }

  if (d[0] === "s") {
    var s = "select * from owner where O_ID =" + d.substring(2);
    con.query(s, (err, agnt) => {
      var user = req.session.user;
      console.log("SELLER ME HAI APUN!");
      console.log(user);
      con.query("select * from property where O_ID=" + agnt[0].O_ID, (err, agent1) => {
        res.render("ag_profile.ejs", { user: user, tit: "Seller", name: agnt[0].Firstname + " " + agnt[0].Lastname, con: agnt[0].Phone_Number, email: agnt[0].Email_ID, id: agnt[0].O_ID, user: agnt[0].ID, flag: 2, userData: agent1, type: d[1] });
      });
    });
  }


  if (d > 0) {
    d = d + "";
    var prr, pss, ts;
    s = "select count(*) as c,sum(Sell_price) as b from sale_details where ID=" + Number(d);

    con.query(s, (err, agent) => {
      if (agent.length > 0) {
        pss = agent[0].c;
        ts = agent[0].b;
      }
      else {
        pss = 0;
        ts = 0;
      }


      s = "select count(*) as c,sum(Rent) as b from rent_details where ID=" + Number(d);
      con.query(s, (err, agent) => {
        if (agent.length > 0) {
          prr = agent[0].c;
          ts = ts + agent[0].b;
        }
        else {
          prr = 0;
        }
        con.query("select TR_ID,Start_Date,END_DATE,t.ID,t.P_ID,Rent,Bedroom,Address from property p ,rent_details t where p.P_ID=t.P_ID and t.ID=" + Number(d), (err, agnt1) => {

          con.query("select TS_ID,S_date,t.ID,t.P_ID,Sell_price,Bedroom,Address from property p ,sale_details t where p.P_ID=t.P_ID and t.ID = " + Number(d), (err, agnt2) => {

            con.query("select * from agent where ID =" + Number(d), (err, agnt) => {
              var user = req.session.user;
              console.log(user);
              con.query("select * from property where Available = 'Yes' and ID =" + Number(d), (err, ag) => {

                res.render("report.ejs", { user: user, name: agnt[0].Firstname + " " + agnt[0].Lastname, id: agnt[0].ID, userDataSale: agnt2, userDataRent: agnt1, sale: ts, pr: prr, ps: pss, userDataPen: ag });
              });
            });
          });

        });

      });


    });



  }




});

setInterval(function () { con.query('select 1'); }, 5000);
module.exports = router;