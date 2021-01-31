var express = require('express');

var app = express();

const path = require('path'); 
var exphbs = require('express-handlebars');
const nodemailer = require("nodemailer");
require('dotenv').config();

app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    extname: 'handlebars',
}));
app.set('view engine', 'handlebars');

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use(express.static(path.join(__dirname, '/public')));

app.set('port', 5835);

const getBody = (req, res, next) => {
  res.locals.resStuff = res.query;
  next();
}

app.use(getBody);

app.get('/', (req,res) => {
    res.render('home')
})

app.get('/info', (req,res) => {
    res.render('info')
})


app.get('/recruitment', (req,res) => {
    res.render('recruitment')
})


app.get('/contact', (req,res) => {
    res.render('contact')
})

app.get('/trwow', (req,res) => {
  res.render('trwow')
})

app.get('/troasis', (req,res) => {
  res.render('troasis')
})


app.post('/contactus', (req,res) =>{


  var data = req.body

  var emailBody = "Contact Form Submitted: \n    Name: " + data.name + "\n    References: " + data.references + "\n    Preferred Game: " + data.gameslist + "\n    Additional Games: " + data.othergames + "\n    Message: " + data.message;
  console.log(emailBody)


  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
  });

  let mailOptions = {
    //mail options for stuff
    from: 'temp38251337@gmail.com',
    to: 'pdf272@gmail.com',
    Subject: 'Tabula Rasa Notification',
    text: emailBody
  };

  transporter.sendMail(mailOptions, function(err,data) {
    if (err) {
      console.log('error occured', err);
    } else {
      console.log('Email sent!');
    }
  });

  res.render('contactus')

});




/*
app.get('/', (req,res) => {
  //Creating an object which has a property which contains an array
  var tableObject = {};
  tableObject.arrayForTable = [];
    for (var query in res.locals.queryStuff){
      //For each query name/value pair, push it to our array where the query term is the name and the query value is the value
      tableObject.arrayForTable.push({'name':query, 'value':res.locals.queryStuff[[query]]})
    }
    //Render our 'get' page by passing it this object contaning the array to build the table
  res.render('get', tableObject);
})
*/

app.post('/', (req,res) => {
  //Creating an object which has a property which contains an array
  var tableObject = {};
  tableObject.arrayForFirstTable = [];
    for (var query in res.locals.queryStuff){
      //For each query name/value pair, push it to our array where the query term is the name and the query value is the value
      tableObject.arrayForFirstTable.push({'name':query, 'value':res.locals.queryStuff[[query]]})
    }
  
  //creating a second property for the tableObject that is pushed to our template
  tableObject.arrayForSecondTable = [];
    for (var data in req.body){
      //For each query name/value pair, push it to our array where the query term is the name and the query value is the value
      tableObject.arrayForSecondTable.push({'name':data,'value':req.body[data]})
    }
  res.render('post', tableObject);
})

app.use(function(req,res){
  //res.type('text/plain');
  res.status(404).render('404');
  //res.render('404')
  //res.send('404 - Not Found');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.send('500 - Server Error');
});

app.listen(app.get('port'), function(){
  console.log(`Express started on http://${process.env.HOSTNAME}:${app.get('port')}; press Ctrl-C to terminate.`);
});
