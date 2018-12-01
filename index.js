
const session = require('express-session');
const express = require('express');
const app = express();

const routes = require( "./backEnd/routes/routes.js" );
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');

app.use(bodyParser.urlencoded({
  extended: false }));
app.use(bodyParser.json());

app.route( "/Home" ).get((req, res) => {
  res.sendFile(__dirname + '/frontEnd/index.html');
});
app.route( "/Company" ).get((req, res) => {
  res.sendFile(__dirname + '/frontEnd/company.html');
});
app.route( "/Taxies" ).get((req, res) => {
  res.sendFile(__dirname + '/frontEnd/taxies.html');
});
app.route( "/About" ).get((req, res) => {
  res.sendFile(__dirname + '/frontEnd/about.html');
});
app.use( "/css", express.static( "frontEnd/css") );
app.use( "/js", express.static( "frontEnd/js") );
app.use( "/images", express.static( "frontEnd/images") );

routes( app );


app.get('/', (req, res) => {
  res.redirect('/login');
});


app.route('/login')
    .get((req, res) => {
        res.sendFile(__dirname + '/frontEnd/login.html');
    })
    .post((req, res) => {
        res.redirect( "/Home" );
    });




app.listen(8000);
