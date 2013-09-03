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
$app.controller('StartUpController', function($scope, $http,$location){



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
		
	
});
