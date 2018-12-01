"use strict";
var UberApi = require('uber-api-gb');
var uberApi = new UberApi('1Hd1lrgoc2m6AbHihCqfKIj5-PlrYdTVNLPXDPPz');

const mysql = require('mysql');
var async = require('async');
/*
var connection = mysql.createPool({
    connectionLimit: 50,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'taxiDB'
});

*/
const { Client } = require('pg');

const client = new Client({
  connectionString: "postgres://oxxdqhrghnxtnv:666cc29523248f92449fdfc2b0ca1c9dcec4b0a32b1e4fa9704cc6acfff9dd49@ec2-79-125-124-30.eu-west-1.compute.amazonaws.com:5432/dd67l51glh9flj",
  ssl: true,
});

client.connect();

client.query("SELECT * FROM Taxies;", (err, res) => {
  if (err) throw err;
  var obj = res.rows;
  client.end();
  res.json(obj);
});

exports.taxies = function( req, res )
{
  /*connection.getConnection(function(error, tempCont) {
    if(error){
      tempCont.release();
      console.log("Error");
    }else {
      console.log("Connected");
      tempCont.query("SELECT * FROM Taxies", function functionName(error, rows, fileds) {
        tempCont.release();
        if (error) {
          console.log("Error");
          res.json(error);
        }else {

          res.json(rows);
        }
      });
    }
  });*/

  client.query("SELECT * FROM Taxies;", (err, res) => {
    if (err) throw err;
    var obj = res.rows;
    client.end();
    res.json(obj);
  });
}

exports.maps = function( req, res )
{
  connection.getConnection(function(error, tempCont) {
    if(error){
      tempCont.release();
      console.log("Error");
    }else {
      console.log("Connected");
      tempCont.query("SELECT * FROM USERS", function functionName(error, rows, fileds) {
        tempCont.release();
        if (error) {
          console.log("Error");
        }else {

          res.json(rows);
        }
      });
    }
  });
}

function isTimeinDiaposone(time, time2) {
  var res = false;
  var chunks = time.split(':');
  var chunks1 = time2.split(':');
  var date = new Date();
  if(Number(chunks[0]) <= Number(date.getHours()) && Number(chunks[1]) <= Number(date.getMinutes())
  && Number(chunks1[0]) >= Number(date.getHours()) && Number(chunks1[1]) >= Number(date.getMinutes())){
    res = true;
  }
  return res;
}

var a = 0;
var localObj;
exports.loadtaxies = function( req, res ){
  localObj = req.body;

  console.log(req.params.taxiesCompany);
  if(req.params.taxiesCompany == "Uber"){
    var Durection =
    {
      'start_latitude': localObj.from_j,
      'start_longitude': localObj.from_l,
      'end_latitude': localObj.end_j,
      'end_longitude': localObj.end_l
    }
    uber(calculatePriceForUber , Durection);
    setTimeout( function(){
      console.log(a);
     res.json({price: a});
   },1500);
 }else if (req.params.taxiesCompany == "OnTaxi"){
    res.json({price: calculatePriceForOnTaxi()});
  }else if (req.params.taxiesCompany == "Taxify") {
    res.json({price: calculatePriceForTaxify()});
  }else if (req.params.taxiesCompany == "Uklon") {
    res.json({price: calculatePriceForUklon()});
  }else if (req.params.taxiesCompany == "Ugo") {
    res.json({price: calculatePriceForUgo()});
  }else if (req.params.taxiesCompany == "579") {
    res.json({price: calculatePriceFor579()});
  }else if (req.params.taxiesCompany == "898") {
    res.json({price: calculatePriceFor898()});
  }else if (req.params.taxiesCompany == "838") {
    res.json({price: calculatePriceFor838()});
  }else {
    res.json({price: 0});
  }

}
function functionName(response) {
  console.log(response);
  return response;
}
function calculatePriceForUber(obj){

  console.log(obj);
  var sum = 0;
  var minPrice = 60.00;
  var pricePerMinute = 1.15;
  var pricePerKm = 4.50;
  var startPrice = 25.00;
  var duration = localObj.duration;



  sum += ((obj.k *  localObj.timeWithTrafic * pricePerMinute) + (obj.k *  localObj.distance * pricePerKm) + obj.k * startPrice);
  if(sum <= minPrice) sum = obj.k * minPrice;
  sum = sum.toFixed(1);
  if(localObj.distance > 100) sum = "error more then 100km";
  a = sum;
  return sum;
}

function uber(callback, direction){


  uberApi.getEstimatePrice(direction, function(error, response){
        if(error){
          console.log(error);
        }else{
          console.log(response.prices[0]);
           callback({ k: response.prices[0].surge_multiplier,
                  duration: response.prices[0].duration / 60,
                  lowprice: response.prices[0].low_estimate});
        }
    });
}

function calculatePriceForTaxify(){
  var sum = 0;
  var minPrice = 40.0;
  if(isTimeinDiaposone("18:00", "20:00")){
    minPrice = 44;
  }else if(isTimeinDiaposone("20:01", "24:00")){
    minPrice = 48;
  }else if(isTimeinDiaposone("00:01", "02:00")){
    minPrice = 80;
  }else if(isTimeinDiaposone("02:01", "05:00")){
    minPrice = 48;
  }
  var pricePerMinute = 1.15;
  var pricePerKm = 6.0;
  var startPrice = 25.0;
  sum += (localObj.duration * pricePerMinute) + (localObj.distance * pricePerKm) + startPrice;
  if(sum <= minPrice) sum = minPrice;
  sum = sum.toFixed(1);
  if(localObj.distance > 100) sum = "error more then 100km";
  return sum;
}

function calculatePriceForUklon(){
  var sum = 0;
  var minPrice = 45.0;
  var pricePerMinute = 0;
  var pricePerKm = 7.0;
  var startPrice = 45.0;
  if(isTimeinDiaposone("14:01", "16:00")){
    minPrice = 76.0;
  }else if(isTimeinDiaposone("16:01", "18:00")){
    minPrice = 78.0;
  }else if(isTimeinDiaposone("18:01", "20:00")){
    minPrice = 50.0;
  }else if(isTimeinDiaposone("20:01", "24:00")){
    minPrice = 45.0;
  }else if(isTimeinDiaposone("00:01", "02:00")){
    minPrice = 63.0;
  }
  sum += (localObj.duration * pricePerMinute) + (localObj.distance * pricePerKm) + startPrice;
  if(sum <= minPrice) sum = minPrice;
  sum = sum.toFixed(1);
  if(localObj.distance > 100) sum = "error more then 100km";
  return sum;
}

function calculatePriceFor838(){
  var sum = 0;
  var minPrice = 35.0;
  var pricePerMinute = 0;
  var pricePerKm = 6.0;
  var startPrice = 35.0;
  var k = 1;
  if(isTimeinDiaposone("04:01", "10:00")){
    minPrice = 50.0;
    k = 1.4;
  }else if(isTimeinDiaposone("10:01", "12:00")){
    minPrice = 40.0;
    k = 1.2;
  }else if(isTimeinDiaposone("12:01", "14:00")){
    k = 1.05;
  }else if(isTimeinDiaposone("16:01", "18:00")){
    minPrice = 40.0;
    k = 1.2;
  }else if(isTimeinDiaposone("18:01", "20:00")){
    minPrice = 50.0;
    k = 1.4;
  }else if(isTimeinDiaposone("20:01", "24:00")){
    minPrice = 40.0;
    k = 1.15;
  }
  else if(isTimeinDiaposone("00:01", "02:00")){
    minPrice = 50.0;
    k = 1.42;
  }
  else if(isTimeinDiaposone("02:01", "04:00")){
    k = 1.05;
  }
  minPrice *= k;
  sum += k * ((localObj.duration * pricePerMinute) + ((localObj.distance - 1) * pricePerKm) + startPrice);
  if(sum <= minPrice) sum = k * minPrice;
  sum = sum.toFixed(1);
  if(localObj.distance > 100) sum = "error more then 100km";
  return sum;
}

function calculatePriceFor898(){
  var sum = 0;
  var minPrice = 0;
  var pricePerMinute = 0;
  var pricePerKm = 5.0;
  var startPrice = 30.0;
  var k = 1.0;
  if(isTimeinDiaposone("05:01", "10:00")){
    minPrice = 47.0;
    if(localObj.distance > 8) k = 1.4;
    else k = 1.5;
  }else if(isTimeinDiaposone("10:01", "14:00")){
    minPrice = 37.0;
    if(localObj.distance > 8) k = 0.93;
    else k = 0.9;
  }else if(isTimeinDiaposone("14:01", "16:00")){
    minPrice = 42.0;
  }else if(isTimeinDiaposone("16:01", "20:00")){
    minPrice = 47.0;
    if(localObj.distance > 8) k = 1.4;
    else k = 1.5;
  }else if(isTimeinDiaposone("20:01", "22:00")){
    minPrice = 35.0;
    k = 0.93;
    if(localObj.distance > 8) k = 0.93;
    else k = 0.9;
  }
  else if(isTimeinDiaposone("22:01", "24:00")){
    minPrice = 45.0;
    if(localObj.distance > 8) k = 1.07;
    else k = 1.06;
  }
  else if(isTimeinDiaposone("00:01", "02:00")){
    minPrice = 50;
    if(localObj.distance > 8) k = 1.6;
    else k = 1.7;
  }
  else if(isTimeinDiaposone("03:01", "05:00")){
    minPrice = 40;
  }
  minPrice *= k;
  sum += k * ((localObj.duration * pricePerMinute) + ((localObj.distance - 1) * pricePerKm) + startPrice);
  if(sum <= minPrice) sum = k * minPrice;
  sum = sum.toFixed(1);
  if(localObj.distance > 100) sum = "error more then 100km";
  return sum;
}

function calculatePriceForUgo(){
  var sum = 0;
  var minPrice = 55;
  var pricePerMinute = 0;
  var pricePerKm = 6.5;
  var startPrice = 43;
  var k = 1.0;
  if(isTimeinDiaposone("06:01", "10:00")){
    minPrice = 60.0;
    startPrice += 5.0;
  }else if(isTimeinDiaposone("16:01", "20:00")){
    minPrice = 60.0;
    startPrice += 5.0;
  }else if(isTimeinDiaposone("20:01", "24:00")){
    minPrice = 50.0;
    startPrice -= 5.0;
  }
  else if(isTimeinDiaposone("00:01", "02:00")){
    minPrice = 63.0;
    k = 1.15;
  }
  minPrice *= k;
  sum += k * ((localObj.duration * pricePerMinute) + (localObj.distance * pricePerKm) + startPrice);
  if(sum <= minPrice) sum = k * minPrice;
  sum = sum.toFixed(1);
  if(localObj.distance > 100) sum = "error more then 100km";
  return sum;
}

function calculatePriceForOnTaxi(){
  var sum = 0;
  var minPrice = 29.0;
  var pricePerMinute = 0;
  var pricePerKm = 8.0;
  var startPrice = 29.0;
  var k = 1.0;
  if(isTimeinDiaposone("06:01", "10:00")){
    k = 1.8;
    minPrice *= k;
  }else if(isTimeinDiaposone("16:01", "20:00")){
    k = 1.4;
    minPrice = 41.0;
    minPrice *= k;
  }
  else if(isTimeinDiaposone("00:01", "02:00")){
    k = 1.2;
  }
  sum += k * ((localObj.duration * pricePerMinute) + ((localObj.distance - 1) * pricePerKm) + startPrice);
  if(sum <= minPrice) sum = minPrice;
  sum = sum.toFixed(1);
  if(localObj.distance > 100) sum = "error more then 100km";
  return sum;
}

function calculatePriceFor579(){
  var sum = 0;
  var minPrice = 52;
  var pricePerMinute = 0;
  var pricePerKm = 5.5;
  var startPrice = 48;
  if(isTimeinDiaposone("00:01", "02:00")){
   minPrice = 56.0;
  }
  sum += (localObj.duration * pricePerMinute) + (localObj.distance * pricePerKm) + startPrice;
  if(sum <= minPrice) sum = minPrice;
  sum = sum.toFixed(1);
  if(localObj.distance > 100) sum = "error more then 100km";
  return sum;
}
