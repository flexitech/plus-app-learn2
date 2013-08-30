'use strict';

/* Variables:
 * 1) $scope: Here we pass in the $scope dependency because this controller needs the two-way databinding functionality of angular.
 * 2) geolocation: The geo location service will get and return the user's current location
 * 3) $http: This is angular service to  post and get data from external sources
 */

$app.controller('HomeController', function($scope, $http){

  

});
$app.controller('RoomController', function($scope, $http){

  

});
$app.controller('StartUpController', function($scope, $http){

  $scope.isLogin = true;

});

$app.controller('LayoutController', function($scope, $http){

  $scope.isLogin = true;

});


$app.controller('LayoutHeaderController', function($scope, $http,$location){

	$scope.pageTitle = "Assets";
	var routes = settings.theme.routes;
	
	//check for top level routes only
	for(var i in routes){
	
		var route = routes[i];
		if (route.path == $location.path()){
			$scope.pageTitle = route.title;
		}
	}
	$scope.show=function(t){
		if ($(t).attr("data-cur")=="hide"){
			$(t).click();
			$(t).attr("data-cur","show");
		}
	}
	$scope.hide=function(t){
		if ($(t).attr("data-cur")=="show"){
			$(t).click();
			$(t).attr("data-cur","hide");
		}
		
	}
});

