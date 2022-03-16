var express = require('express');
var fs = require('fs');

var app = express();
const PORT = process.env.PORT || 8081;

app.use('/css',express.static(__dirname +'/css')); //load the css

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');  //load index.html
});

app.get('/guestbook', function(req, res){
    var data = require('./data.json'); //load data
    var results = '<table border="1"><tr><th>Name</th><th>Country</th><th>Date</th><th>Message</th><tr>';
    //make the table
    
    for (var i = 0; i < data.length; i++){ //fill it with all the data from json file
        results += '<tr>' +
        '<td>' + data[i].username +'</td>'+
        '<td>' + data[i].country +'</td>'+
        '<td>' + data[i].date +'</td>'+
        '<td>' + data[i].message +'</td>'+ '</tr>';
    }
    res.send(results); 
});

app.get('/newmessage', function(req, res){ //load form.html
    res.sendFile(__dirname + '/form.html');
});

var bodyParser = require('body-parser');
const { fstat } = require('fs');
const { response } = require('express');
app.use(bodyParser.urlencoded({extended: true}));

app.post("/newmessage", function(req, res){
    var data = require('./data.json');

    data.push({ // add form data to the JSON file
        username: req.body.name,
        country: req.body.country,
        message: req.body.message,
        date: Date()
        
    });
    var jsonStr = JSON.stringify(data);

    fs.writeFile("data.json", jsonStr, function(err, data) { // write it
        if (err) throw err;
        console.log("It's saved!");
      });
    
      res.send("Thank you for your message!");
});

app.get('/ajaxmessage', function(req, res){
    res.sendFile(__dirname + '/ajaxform.html') // load ajaxform.html
});
app.post('/ajaxmessage', function(req,res){
    var name = req.body.name;
    var country = req.body.country;
    var message = req.body.message;
    res.send("Form submitted by " + name + " from " + country + ". Your message: " + message);
})
app.listen(PORT, function(){
    console.log('Listening to port ' + PORT);
});
