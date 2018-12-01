var map;
var markers = [];
var directionsService;
var directionsDisplay;
var trafficLayer;

var total = 0;
var totalDuration = 0;;
var totalDurationWithTrafic = 0;
var from_l = 0;
var from_j = 0;
var end_l = 0;
var end_j = 0;

function initMap() {
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  var haightAshbury = {lat: 50.450280, lng: 30.526336};
  map = new google.maps.Map(document.getElementById('map'), {
    center: haightAshbury,
    zoom: 13,
    mapTypeId: 'roadmap',
    streetViewControl: false,

  });
  directionsDisplay.setMap(map);

  trafficLayer = new google.maps.TrafficLayer();
  trafficLayer.setMap(map);

  var infoWindow;
  infoWindow = new google.maps.InfoWindow;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      infoWindow.setPosition(pos);
      infoWindow.setContent('You');
      infoWindow.open(map);
      map.setCenter(pos);
      map.setZoom(17);
      }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
  // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }

  directionsDisplay.addListener('directions_changed', function() {
    console.log(directionsDisplay.getDirections());
    from_l = directionsDisplay.getDirections().routes[0].bounds.l.j;
    from_j = directionsDisplay.getDirections().routes[0].bounds.j.j;
    end_l = directionsDisplay.getDirections().routes[0].bounds.l.l;
    end_j = directionsDisplay.getDirections().routes[0].bounds.j.l;
    total = directionsDisplay.getDirections().routes[0].legs[0].distance.value / 1000;
    totalDuration = directionsDisplay.getDirections().routes[0].legs[0].duration.value / 60;
    totalDurationWithTrafic = directionsDisplay.getDirections().routes[0].legs[0].duration_in_traffic.value / 60;
          });


  var onChangeHandler = function() {
    calculateAndDisplayRoute(directionsService, directionsDisplay);
  };

  document.getElementById('pac-input-from').addEventListener('change', onChangeHandler);
  document.getElementById('pac-input-To').addEventListener('change', onChangeHandler);


  new google.maps.places.SearchBox(document.getElementById('pac-input-from')) ;
  new google.maps.places.SearchBox(document.getElementById('pac-input-To'));

  setDistance('pac-input-from');
  setDistance('pac-input-To');
  //map.addListener('click', function(event) {
  //  addMarker(event.latLng);
  //});
  // Adds a marker at the center of the map.
  //addMarker(haightAshbury);
  // Create the search box and link it to the UI element.

}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}


function calculateAndDisplayRoute(directionsService, directionsDisplay) {
  var date = new Date();
  var dateDeparture = date;
  directionsService.route({
    origin: document.getElementById('pac-input-from').value,
    destination: document.getElementById('pac-input-To').value,
    travelMode: 'DRIVING',
    drivingOptions: {
      departureTime: dateDeparture,
      trafficModel: 'bestguess'
    },
    provideRouteAlternatives: true,
//  avoidHighways: true,
//  avoidTolls: true,
  }, function(response, status) {
    if (status === 'OK') {
      directionsDisplay.setDirections(response);


      //showSteps(response);

    } else {
      if(document.getElementById('pac-input-from').value != "" && document.getElementById('pac-input-To').value != ""){
        window.alert('Directions request failed due to ' + status);
      }
    }
  });
}

goToTaxie = function() {
  if(directionsDisplay.A.A.length == 2 && document.getElementById('pac-input-from').value != "" && document.getElementById('pac-input-To').value != ""){
    var obj = {
        duration: totalDuration.toFixed(1),
        distance: total.toFixed(1),
        timeWithTrafic: totalDurationWithTrafic.toFixed(1),
        from: document.getElementById('pac-input-from').value,
        to: document.getElementById('pac-input-To').value,
        from_l: from_j,
        from_j: from_l,
        end_l: end_j,
        end_j: end_l
    };
    localStorage.setItem("obj", JSON.stringify(obj));
    window.location.href = "Taxies";
  }

}

function setMapOnAll(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

function clearMarkers() {
  setMapOnAll(null);
  document.getElementById('pac-input-from').value = "";
  document.getElementById('pac-input-To').value = "";
  for(var i = document.getElementById("myTable").rows.length - 1; i > 0; i--)
  {
      document.getElementById("myTable").deleteRow(i);
  }
  // TODO:
  // clear direction

}

function setDistance(myroute){
  var inputFrom = document.getElementById(myroute);
  var searchBox = new google.maps.places.SearchBox(inputFrom);


  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      markers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      }));

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });
}

function addMarker(location) {
  var marker = new google.maps.Marker({
    position: location,
    map: map
  });
  markers.push(marker);
}
/*$.ajax({
  type: "POST",
  url: "/backEnd/maps",
  dataType: "json",
  success: function ( data ) {
    console.log(data);


  },
  data:
});*/
    /*fetch( "./backEnd/matrixRoute/" + directionsDisplay.getDirections() ).then( (response) => {
    if ( response.status == 200 )
    {
      response.json().then( (data) => {
        total = data.total;
        totalDuration = data.totalDuration;
        totalDurationWithTrafic = data.totalDurationWithTrafic;
        console.log(total);
        console.log(totalDuration);
        console.log(totalDurationWithTrafic);
      } )
    }
  } );*/
