//jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");   // These will require the project modules as usual
const https = require("https");
const { response } = require("express");

const app = express();  // creates a new express app

// Special function of express
app.use(express.static("public"));  // refers to a folder that we creates, which stores local files, and allows our server to serve those local files by using express.
app.use(bodyParser.urlencoded({extended: true}));  // This allows us to use body-parser, which again will allow us to parse through the bodies of HTML files

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");  // sets up the app.get in order to display our local html file.
});

app.post("/", function(req, res) {
    
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;    // These names are given to the inputs that we created in our HTML file. The values of those user inputs are stored in these variables.

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us19.api.mailchimp.com/3.0/lists/7cde348f7e";

    const options = {
        method: "POST",
        auth: "davis:642b59f9f56f3a92f57f761d81199e50-us19"
    }

    const request = https.request(url, options, function(response) {

        if(response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data) {
            console.log(JSON.parse(data));
        })
    });

    request.write(jsonData);
    request.end();

});

app.post("/failure", function(req, res) {
    res.redirect("/");
});


app.listen(process.env.PORT || 3000, function() {
    console.log("Server started on port 3000");  // Server is built and started on local host as usual.
});