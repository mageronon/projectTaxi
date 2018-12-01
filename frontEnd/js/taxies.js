var taxies = [];
var time = [];
var localObj;
var temp;
var initTaxies = function(){
  var k;

  localObj = JSON.parse(localStorage.getItem("obj"));
  var currentdate = new Date();
  var waitMin = 5.0;
  var departureDate = new Date(currentdate.getTime() + (waitMin + parseFloat(localObj.duration)) * 60000);
  time.push(createTime(waitMin, ("0" + (currentdate.getHours())).slice(-2) + ":" + ("0" + (currentdate.getMinutes())).slice(-2),
   ("0" + (departureDate.getHours())).slice(-2) + ":" + ("0" + (departureDate.getMinutes())).slice(-2)));

  fetch( "/backEnd/taxies" ).then( (response) => {
     if ( response.status == 200 )
     {
       response.json().then( (data) => {
         //console.log(data);
        temp  = data;
        k = 0;
         var price = "error";
         for(var i = 0; i < data.length; i++){
           $.ajax({
             type: "POST",
             url: "/backEnd/taxies/" + data[i].Company,
             dataType: "json",
             success: function ( data1 ) {
               taxies.push(createTaxi(data[k].City, data[k].Company, data[k].Type, data1.price, data[k].image));
               k++;
             },
             data: localObj
           });

         }
       } );

     }
   } );


  var app = new Vue({
    el: '#app',
    data: {
      localObj,
      taxies,
      time
    },
    computed:{
        sortedItems(){
            return this.taxies.sort((a,b) =>
                 a.price  - b.price)
        }
    }
  });

  document.getElementById('pac-input-fromT').value = localObj.from;
  document.getElementById('pac-input-ToT').value = localObj.to;
}

var createTime = function(waiting, now, departureTime) {
  var Time = {
    waiting: waiting,
    now : now,
    departureTime : departureTime
  };
  return Time;
}

var createTaxi = function(city, companyName, type, price, image) {
  var Taxi = {
    city: city,
    companyName : companyName,
    name : type,
    price : price,
    image: image
  };
  return Taxi;
}
