'use strict';

/* Variables:
 * 1) $scope: Here we pass in the $scope dependency because this controller needs the two-way databinding functionality of angular.
 * 2) geolocation: The geo location service will get and return the user's current location
 * 3) $http: This is angular service to  post and get data from external sources
 */

//////// Current scene right top menu handler
$app.factory('MethodHandler', function() {
	var methodHandler={};
	methodHandler.text="Skip";
	methodHandler.show = true;
	methodHandler.icon_class="glyphicon glyphicon-chevron-right";
	methodHandler.func=null;
  return methodHandler;
});
//////// local cache service
$app.factory('CacheServiceApp', function($cacheFactory) {
  return $cacheFactory('CacheServiceApp');
});
//////// local database service
$app.factory('LocalMyDb',function(){
	var dbAccess={

	};
	dbAccess.db = new localStorageDB("LocalMyDb",localStorage);
	dbAccess.resetDb = function(){
		if (!dbAccess.db.isNew()){
			dbAccess.db.drop();
			dbAccess.db.commit();

		}
	}
	dbAccess.storeFunction ={};
	dbAccess.storeFunction.checkNewInstallation=function(){
		var tmp = dbAccess.db.query("master_db",{fresh_installation:true});
		return tmp[0];
	}
	dbAccess.storeFunction.exportJSON = function(){
		var db ={};
		db["users"] = dbAccess.db.query("users");
		db["users_social"] = dbAccess.db.query("users_social");
		db["vaults"] = dbAccess.db.query("vaults");
		db["assets"] = dbAccess.db.query("assets");
		db["asset_pricing"] = dbAccess.db.query("asset_pricing");
		db["master_db"] = dbAccess.db.query("master_db");
		db["invoice_detail"] = dbAccess.db.query("invoice_detail");
		db["billing_plans"] = dbAccess.db.query("billing_plans");
		db["invoices"] = dbAccess.db.query("invoices");
		return angular.toJson(db);
	}
	if (dbAccess.db.isNew()){
		//////create table user
		dbAccess.db.createTable("users",["user_id","user_name","password","email","date_joined"]);
		///// create table user social
		dbAccess.db.createTable("users_social",["user_id","social_type","social_username","social_profile_image_url","social_code","social_secret"]);
		//// create table vault
		dbAccess.db.createTable("vaults",["user_id","vault_name","vault_password","vault_single_sign_check","created_date"]);
		/// create asset table
		dbAccess.db.createTable("assets",["asset_name","asset_type","asset_value","vault_id","created_date","status"]);
		/// create table asset pricing
		dbAccess.db.createTable("asset_pricing",["asset_id","pricing_name","pricing_type","price","currency","due_pricing_date"]);
		/// create master table
		dbAccess.db.createTable("master_db",["fresh_installation","installation_date","username"]);
		/// create table billing plan
		dbAccess.db.createTable("billing_plans",["plan_name","created_date","due_date","tag","asset_id","note","user_id"]); //Asset_id ref assets(ID)
		/// create table invoice
		dbAccess.db.createTable("invoices",["billing_plan_id","created_date","total_value","paid","due_paid"]); //billing_plan_id ref billing_plan(ID)
		/// create table invoice detail
		dbAccess.db.createTable("invoice_detail",["invoice_id","pricing_id","qty","amount"]); //invoice_id ref invoices(ID), pricing_id ref asset_pricing(ID)
		//// lib commit
		dbAccess.db.commit();
	}
	return dbAccess;
});

$app.controller('LayoutController', function($scope, $http){

  $scope.isLogin = true;

});
$app.controller('NavController', function($scope, $http,$location,CacheServiceApp,LocalMyDb){
	
});


$app.controller('LayoutHeaderController', function($scope, $http,$location,CacheServiceApp,MethodHandler,$routeParams){



	$scope.pageTitle = "Assets";
	var routes = settings.theme.routes;
	
	//check for top level routes only
	for(var i in routes){
		
		var route = routes[i];
		var routepath = route.path + "";
		var locpath = $location.path() + "";
		var routeslash = routepath.substr(1,routepath.length-1).indexOf('/');
		var locslash = locpath.substr(1,locpath.length-1).indexOf('/');
		locslash=locslash>0?locslash:locpath.length;
		routeslash=routeslash>0?routeslash:routeslash.length;
		if (routepath.substr(0,routeslash) == locpath.substr(0,locslash)){
			
			$scope.pageTitle = route.title;
		}
	}
	
});
$app.controller('StartUpController', function($scope, $http,$location,CacheServiceApp,MethodHandler,$routeParams){



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
