const { json } = require("body-parser");
var express = require("express");
var https = require("https")
var app = new express();
var formidable = require("formidable");
var db = require("./public/js/db");
const { response } = require("express");

app.set("view engine", "ejs");
app.use(express.static("./public"));

app.get("/register", function(req, res, next){
  res.render("register");
});

app.post("/doRegister", function(req, res, next){
  var form = new formidable.IncomingForm();

  form.parse(req, function(err, fields, files){
    db.insertOne("iService", "users", fields, function(err, result){
      if(err){
        console.log("Register failed " + err);
        res.send(err);
        return;
      }
      console.log("Register successfully " + result);
      res.send("1");

      email_data = {
        members: [{
          email_address: fields.email,
          status: "subscribed",
          merge_fields:{
            FNAME: fields.first_name,
            LNAME: fields.last_name
          },
          content: "Welcome " + fields.first_name + ", " + fields.last_name + "! You have successfully register the iService account."
        }]
      }

      json_data = JSON.stringify(email_data)
      const url = "https://us17.api.mailchimp.com/3.0/lists/217c8407f8"
      const options = {
        methods: "POST",
        auth: "azi:80b200d6a3feb9b64bdfca905737e58f-us17"
      }

      const request = https.request(url, options, (response) => {
        response.on("data", (data) => {
          console.log(JSON.parse(data))
        })
      })

      request.write(json_data)
      request.end()
    });
  });
});

app.listen(3000);

