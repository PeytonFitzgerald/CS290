var express = require('express');

var app = express();

var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.json())
app.use(express.urlencoded({extended: true}))


app.set('port', 1338);

const getQueryParams = (req, res, next) => {
  res.locals.queryStuff = req.query;
  next();
}

app.use(getQueryParams);

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
  res.type('text/plain');
  res.status(404);
  res.send('404 - Not Found');
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