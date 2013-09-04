'use strict';

/* Variables:
 * 1) $scope: Here we pass in the $scope dependency because this controller needs the two-way databinding functionality of angular.
 * 2) geolocation: The geo location service will get and return the user's current location
 * 3) $http: This is angular service to  post and get data from external sources
 */

//////// Current scene right top menu handler

//////// local cache service
$app.factory('CacheServiceApp', function($cacheFactory) {
  return $cacheFactory('CacheServiceApp');
});
//////// local database service

$app.controller('LayoutController', function($scope, $http){

  $scope.isLogin = true;

});
$app.controller('NavController', function($scope, $http,$location){
	
});


$app.controller('LayoutHeaderController', function($scope){



		
});
$app.controller('StartUpController', function($scope,geolocation, $http,$location){



	$scope.pageTitle = "Assets";
	var routes = settings.theme.routes;
	
	$scope.banners=[{
			src:'',
			text:''
		}];
	$scope.movies=[
		{src:'m_1375765675.jpg',title:'Fast & Furious 6'},
		{src:'m_1375770101.jpg',title:'Movie #1'},
		{src:'m_1375770345.jpg',title:'Now You See Me'},
		{src:'m_1375770360.jpg',title:'Pacific Rim'},
		{src:'m_1375770388.jpg',title:'Epic 3D'},
		{src:'m_1375770417.jpg',title:'After Earth'},
		{src:'m_1375770432.jpg',title:'Superman'}
	];
	
	$scope.events=[
		{
			src:'m_137584651280001.jpg',
			text:'m_137584651280001.jpg'
		},
		{
			src:'m_137584651556001.jpg',
			text:'m_137584651556001.jpg'
		},
		{
			src:'m_1375846512368001.jpg',
			text:'m_1375846512368001.jpg'
		},
		{
			src:'m_1375846512768001.jpg',
			text:'m_1375846512768001.jpg'
		},
		{
			src:'m_1375846513192001.jpg',
			text:'m_1375846513192001.jpg'
		},
		{
			src:'m_1375846513392001.jpg',
			text:'m_1375846513392001.jpg'
		},
		{
			src:'m_1375846513784001.jpg',
			text:'m_1375846513784001.jpg'
		},
		{
			src:'m_1375846515144001.jpg',
			text:'m_1375846515144001.jpg'
		}];
		
	///////// map
	//set Map defaults
  $scope.leaflet = {
    defaults: {
      /*tileLayer: $scope.app.paths.map("plusdark"),*/
      maxZoom: 18
    },
    center: {lat :0, lng:0},
    markers : {}
  };

  // Update Leaflet model once we have gotten the user's location & lets us change the message if we cannot reverse geocode the Lat/Lng
  function updateData(latlng, message){
    var marker = {
      currentLocation : {
        lat : latlng.lat,
        lng : latlng.lng,
        focus : true,
        message : message
      }
    }

    var newData = {
        center : {
          lat: latlng.lat,
          lng: latlng.lng,
          zoom: 18
        }
      };

    angular.extend($scope.leaflet.markers, marker);
    angular.extend($scope.leaflet, newData);
  }

  //if location is saved in localstorage use that until we can get updated locataion
  if(!_.isUndefined(localStorage.savedGeo)){
    var geo = angular.fromJson(localStorage.savedGeo);
    console.log(geo.latlng);
    updateData(geo.latlng, geo.address);
  }

  //get geolocation
  geolocation.getCurrentPosition(function(pos){
    var latlng = { lat : pos.coords.latitude, lng : pos.coords.longitude };

    //use the latlng with google maps geocode api to find the nearest address
    $http.get(sprintf('http://maps.googleapis.com/maps/api/geocode/json?latlng=%(lat)s,%(lng)s&sensor=true', latlng)).success(function(data){
      var address = data.results[0].formatted_address;
      if(_.isEmpty(address)){
        updateData(latlng, 'You are here');
      }else{
        updateData(latlng, address);
      }

      //save location data, so when user comes back to the page the map can still be populated
      localStorage.savedGeo = angular.toJson({
        latlng : latlng,
        address : address
      });

    }).error(function(error){
      updateData(latlng, 'You are here');
    });
  });

	
});
