/*
var myMap = require('./index.js');
myMap.map();
console.log(myMap.map);
*/

"use strict";

const controller = require( "../controller/controller.js" );

module.exports = function( app )
{
  app.route( "/backEnd/taxies" )
    .get( controller.taxies );

  app.route( "/backEnd/taxies/:taxiesCompany")
    .post( controller.loadtaxies);

  app.route( "/backEnd/maps" )
      .post( controller.maps );


}
