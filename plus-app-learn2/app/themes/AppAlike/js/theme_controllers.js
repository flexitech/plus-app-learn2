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
		//// lib commit
		dbAccess.db.commit();
	}
	return dbAccess;
});

$app.controller('LayoutController', function($scope, $http){

  $scope.isLogin = true;

});
$app.controller('NavController', function($scope, $http,$location,CacheServiceApp,LocalMyDb){
	$scope.userLogined = function(){
		var tmp=(CacheServiceApp.get("login_user")!=undefined && CacheServiceApp.get("login_user")!=null && CacheServiceApp.get("login_user")!="");
		
		return tmp;
	}
	$scope.logoff = function(){
		CacheServiceApp.remove("login_user");
		LocalMyDb.db.deleteRows("master_db");
		LocalMyDb.db.commit();
		$location.path("/login");
	}
	
});


$app.controller('LayoutHeaderController', function($scope, $http,$location,CacheServiceApp,MethodHandler){

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
	$scope.isLogin=false;
	$scope.checkUserLogin = function(){
		$scope.isLogin = (CacheServiceApp.get("login_user")!=undefined && CacheServiceApp.get("login_user")!=null && CacheServiceApp.get("login_user")!="");
		
	}
	$scope.getMethodHandler=function(){return MethodHandler;};
	
});
$app.controller('HomeController', function($scope, $http,MethodHandler){
	$scope.isLogin = false;
  	MethodHandler.text="Exit	";
	MethodHandler.show=true;
	MethodHandler.icon_class ="glyphicon glyphicon-chevron-right";
	MethodHandler.func=function(){alert("now you are in ome page!")};

});
$app.controller('RoomController', function($scope, $http,MethodHandler){

  	MethodHandler.text="New Room";
	MethodHandler.show=true;
	MethodHandler.icon_class ="glyphicon glyphicon-chevron-right";
  	MethodHandler.func=function(){alert("New room information!")};

});
$app.controller('AssetViewController', function($scope, $http,LocalMyDb,CacheServiceApp,MethodHandler,$routeParams,$navigate){
	$scope.id=0;
	$scope.asset =null;

	$scope.asset_pricing=[];
	if ( $routeParams.id==null || $routeParams.id==undefined || $routeParams.id<1){
		$navigate.back();
	}
	else{
		$scope.id = $routeParams.id;
		
	}
	function viewAsset(){
		var tmp = LocalMyDb.db.query("assets",{ID:$scope.id});
		$scope.asset =  tmp[0];
		if ($scope.asset==null){
			$navigate.back();
		}
		//get asset pricing
		$scope.asset_pricing = LocalMyDb.db.query("asset_pricing",{asset_id:$scope.id});
	}
	$scope.edit=function(){
		$navigate.go("new_assets/" + $scope.id + "/update","slide");
	}
	$scope.editAssetPricing = function(pid){
		$navigate.go("asset_pricing/" + pid + "/update","slide");
		//alert(pid);
	}
	viewAsset();
	MethodHandler.show=true;
	MethodHandler.icon_class ="glyphicon glyphicon-chevron-left";
	MethodHandler.text="Back";
	MethodHandler.func=function(){
		
		$navigate.back();
		
	}
});
$app.controller('AssetPricingController', function($scope, $http,LocalMyDb,CacheServiceApp,MethodHandler,$routeParams,$navigate){


	MethodHandler.show=true;
	MethodHandler.text="Vaults";
	MethodHandler.icon_class ="glyphicon glyphicon-chevron-right";
	MethodHandler.func=function(){
		
		$navigate.go("vaults" ,"slide");
		
	}


	//asset init
	$scope.pricing={name:"",type:"",currency:"",duedate:"",price:0};

	$scope.id=0;
	$scope.mode = "new";
	if ($routeParams.mode ==null || $routeParams.id==null || $routeParams.id==undefined || $routeParams.id<1){
		$navigate.go("assets","slide");
	}
	else{
		$scope.id = $routeParams.id;
		$scope.mode = $routeParams.mode;
		if ($scope.mode=="update"){
			//query current pricing plan
			var priceplan = LocalMyDb.db.query("asset_pricing",{ID:$scope.id})[0];
			if (priceplan!=null && priceplan!=undefined){
				$scope.pricing.name = priceplan.pricing_name;
				$scope.pricing.type = priceplan.pricing_type;
				$scope.pricing.currency = priceplan.currency;
				$scope.pricing.duedate  = priceplan.due_pricing_date;
				$scope.pricing.price = priceplan.price;
				MethodHandler.text="Back";
				MethodHandler.icon_class ="glyphicon glyphicon-chevron-left";
				MethodHandler.func=function(){
					
					$navigate.back();
					
				}

				
			}
			else{
				$scope.mode="New";
			}
		}
	}
	$scope.createPricing = function(pricing){

		///insert into database
		if($scope.mode=="new"){
			var row_affected = LocalMyDb.db.insert("asset_pricing",{
				asset_id:$scope.id,
				pricing_name:pricing.name,
				pricing_type:pricing.type,
				price:pricing.price,
				currency:pricing.currency,
				due_pricing_date:pricing.duedate
			});
			LocalMyDb.db.commit();
			
			if (row_affected>0){
				alert("Save success!");
				$scope.pricing.name="";
				$scope.pricing.type="";
				$scope.pricing.currency ="";
				$scope.pricing.duedate = "";
				$scope.pricing.price = 0;
			}
			else{
				alert("Save Fail!");
			}
		}
		else{
			var row_affected = LocalMyDb.db.update("asset_pricing",{ID:$scope.id},function(row){
				row.pricing_name = pricing.name;
				row.pricing_type = pricing.type;
				row.price = pricing.price;
				row.currency = pricing.currency;
				row.due_pricing_date = pricing.duedate;
				return row;
			});
			LocalMyDb.db.commit();
			if (row_affected>0){
				alert("Update success!");
				$scope.pricing.name="";
				$scope.pricing.type="";
				$scope.pricing.currency ="";
				$scope.pricing.duedate = "";
				$scope.pricing.price = 0;
				$scope.mode="new";
			}
			else{
				alert("Update Fail!");
			}
		}

	}


	
});
$app.controller('AssetInfoController', function($scope, $http,LocalMyDb,CacheServiceApp,MethodHandler,$routeParams,$navigate){
	//asset init
	$scope.assetinfo={asset_name:"",asset_value:"",asset_type:""};

	$scope.id=0;
	$scope.mode = "new";
	if ($routeParams.mode ==null || $routeParams.id==null || $routeParams.id==undefined || $routeParams.id<1){
		$navigate.go("assets","slide");
	}
	else{
		$scope.id = $routeParams.id;
		$scope.mode = $routeParams.mode;
		if ($scope.mode=="update"){
			//query data 

			var currentAsset = LocalMyDb.db.query("assets",{ID:$scope.id});

			if (currentAsset.length>0){
				$scope.assetinfo.asset_name = currentAsset[0].asset_name;
				$scope.assetinfo.asset_type = currentAsset[0].asset_type;
				$scope.assetinfo.asset_value = currentAsset[0].asset_value;

					console.log($scope.assetinfo);
			}
			else{
				$scope.mode="new";
			}
		}
	}
	MethodHandler.show=true;
	MethodHandler.text="Back";
	MethodHandler.icon_class ="glyphicon glyphicon-chevron-left";
	MethodHandler.func=function(){
		/*if ($scope.mode=="new"){
			$navigate.go("assets/" + $scope.id,"slide");
		}
		else{

		}*/
		$navigate.back();
	}

	$scope.createAsset=function(){
		if ($scope.mode=="update"){
			
			LocalMyDb.db.update("assets",
				{
					ID:$scope.id
				}
				,function(row)
				{
					row.asset_name=$scope.assetinfo.asset_name;
					row.asset_type=$scope.assetinfo.asset_type;
					row.asset_value=$scope.assetinfo.asset_value;
					return row;
				}
			);
			LocalMyDb.db.commit();
			$navigate.back();
		}else{
			var currentDate = new Date();
			var date = currentDate.getDate() + "/" + (currentDate.getMonth()+1) + "/" + currentDate.getFullYear();
			LocalMyDb.db.insert("assets",
				{
					asset_name:$scope.assetinfo.asset_name,
					asset_type:$scope.assetinfo.asset_type,
					asset_value:$scope.assetinfo.asset_value,
					vault_id:$scope.id,
					created_date:date,
					status:"fine"

				}
			);
			LocalMyDb.db.commit();
			var assets = LocalMyDb.db.query("assets");
			var lastInsertedId = _.last(assets).ID;
			
			//alert(lastInsertedId);
			$navigate.go("asset_pricing/" + lastInsertedId +"/new","slide");
		}
		//CacheServiceApp.create
	}
});
$app.controller('AssetController', function($scope, $http,LocalMyDb,CacheServiceApp,MethodHandler,$routeParams,$navigate){
	$scope.vaultid=0;
	if ($routeParams.vault_id==null || $routeParams.vault_id==undefined || $routeParams.vault_id<1){
		$navigate.go("vaults","slide");
	}
	else{
		$scope.vaultid = $routeParams.vault_id;
	}
	var  lastButton = null;
	$scope.assets=[];
	MethodHandler.text="New";
	MethodHandler.show=true;
	MethodHandler.icon_class ="glyphicon glyphicon-chevron-right";
	MethodHandler.func=function(){
		console.log("hey u!!!");
		$navigate.go("new_assets/" + $scope.vaultid + "/new","slide");
	};
	$scope.showDelete=function(o){
		$scope.hideDelete();
		lastButton = $(o);
		lastButton.removeClass('hideDeleteButton');
		lastButton.addClass('showDeleteButton');
	}
	$scope.hideDelete=function(){
		if (lastButton!=null){
			lastButton.removeClass('showDeleteButton');
			lastButton.addClass('hideDeleteButton');
		}
	}
	$scope.getAsset=function(assetid){

	}
	function getAssets(){
  		//get user id
  		
  		$scope.assets = LocalMyDb.db.query("assets",{vault_id:$scope.vaultid});

  	}
  	$scope.showAsset=function(id){
  		$navigate.go("view_asset/" + id,"slide");
  	}
  	getAssets();
});
$app.controller('VaultInfoController', function($scope, $http,LocalMyDb,CacheServiceApp,MethodHandler,$navigate,$routeParams){
	MethodHandler.text="Back";MethodHandler.icon_class ="glyphicon glyphicon-chevron-left";
  	MethodHandler.func=function(){
  		$navigate.go("vaults","slide");
  	};
	MethodHandler.show=true;

	$scope.vault={name:"",password:"",single_sign:false};
	

	$scope.id=0;
	$scope.mode="new";
	if ($routeParams.mode==null || $routeParams.id==null || $routeParams.id==undefined ){
		$navigate.go("vaults","slide");
	}
	else{
		$scope.id = $routeParams.id;
		$scope.mode=$routeParams.mode;
		if ($scope.mode =="update" && $scope.id>0){
			//get the current vault to update
			var v = LocalMyDb.db.query("vaults",{ID:$scope.id})[0];
			if(v!=undefined){

				$scope.vault.name = v.vault_name;
				$scope.vault.password = v.vault_password;
				$scope.vault.single_sign= v.vault_single_sign_check;
				console.log(v);
			}
			else{
				$scope.mode="new";
			}
		}
		else{
			$scope.mode="new";
		}
	}
	$scope.save=function(vault){
		if ($scope.mode=="new"){
			if (LocalMyDb.db.query("vaults",{vault_name:vault.name}).length){
				alert("Vault name is already taken!");
			}
			else{
				var uname=CacheServiceApp.get("login_user");
				if (uname!=undefined){
					var uid = LocalMyDb.db.query("users",{username:uname})[0].user_id;

					var currentDate = new Date();
					var created = currentDate.getDate() + "/" + (currentDate.getMonth()+1) + "/" + currentDate.getFullYear();
					var affected_row=LocalMyDb.db.insert("vaults",
							{
								user_id:uid,
								vault_name:$scope.vault.name,
								vault_password:$scope.vault.password,
								vault_single_sign_check:$scope.vault.single_sign,
								created_date:created
							}
						);
					LocalMyDb.db.commit();
					if (affected_row>0){
						alert("Save success!");
						$scope.vault.name="";
						$scope.vault.password="";
						$scope.vault.single_sign = false;
						$scope.mode="new";
					}
					else{
						alert("Save fail!");
					}
				}
				
				
			}
		}
		else{
			var affected_row=LocalMyDb.db.update("vaults",{ID:$scope.id},function(row){
				row.vault_name = $scope.vault.name;
				row.vault_password = $scope.vault.password;
				row.vault_single_sign_check = $scope.vault.single_sign;
				return row;
			});
			LocalMyDb.db.commit();
			if (affected_row>0){
				alert("Save success!");
				$scope.vault.name="";
				$scope.vault.password="";
				$scope.vault.single_sign = false;
				$scope.mode="new";
			}
			else{
				alert("Save fail!");
			}
			

		}
	}
});
$app.controller('VaultController', function($scope, $http,LocalMyDb,CacheServiceApp,MethodHandler,$navigate){

	var  lastButton = null;
	$scope.vaults=[];
	MethodHandler.text="New";
	MethodHandler.show=true;
	MethodHandler.icon_class ="glyphicon glyphicon-chevron-right";
	MethodHandler.func=function(){$navigate.go("vaults/0/new","slide")};
	$scope.showDelete=function(o){
		$scope.hideDelete();
		lastButton = $(o);
		lastButton.removeClass('hideDeleteButton');
		lastButton.addClass('showDeleteButton');
	}
	$scope.hideDelete=function(){
		if (lastButton!=null){
			lastButton.removeClass('showDeleteButton');
			lastButton.addClass('hideDeleteButton');
		}
	}
	$scope.deleteVault=function(id){
		//check if has used
		editing=true;
		if ($scope.getTotalAssetCount(id)>0){
			alert("Cannot Delete this vault!");
		}
		else{
			LocalMyDb.db.delete("vaults",{ID:id});
			getVaults();

		}
		setTimeout(function(){
			editing=false;	
		},1000);
		 
		
	}
  	function getVaults(){
  		//get user id
  		var name = CacheServiceApp.get("login_user");
  		var id = LocalMyDb.db.query("users",{user_name:name}).ID;
  		$scope.vaults = LocalMyDb.db.query("vaults",{user_id:id});

  	}

  	getVaults();
  	$scope.showAssets=function(vault){
  		if(!editing)
  			$navigate.go("assets/" + vault.ID,"slide");
  	}
  	$scope.getTotalAssetCount = function(id){
  		var count = LocalMyDb.db.query("assets",{vault_id:id}).length;
  		if (count>99){
  			return count + "+";

  		}
  		else
  			return count;
  	}
  	$scope.getTotalAssetValue = function(id){
  		var value = 0;
  		_.each(LocalMyDb.db.query("assets",{vault_id:id}),function(asset){
  			value += asset.asset_value;
  		});;
  		if (value>9999){
  			return "$ " + value + "+";

  		}
  		else
  			return "$ " + value;
  		
  	}
  	var editing=false;
  	$scope.editVault=function(id){
  		editing=true;
  		$navigate.go("vaults/"+id+"/update","slide");
  	}
});
$app.controller('StartUpController', function($scope, $http,LocalMyDb,$navigate,CacheServiceApp,MethodHandler,$location){
	MethodHandler.text="";
  	MethodHandler.func=null;
  	MethodHandler.icon_class ="glyphicon glyphicon-chevron-right";
	MethodHandler.show=false;

	$scope.formRegisterDone=false;
	$scope.isformRegisterDone=function(){return $scope.formRegisterDone};
	$scope.formVaultDone=false;
	$scope.isformVaultDone=function(){return $scope.formVaultDone};

	$scope.registerinfo={username:"",password:"",email:"",id:-1};
	$scope.vault={name:"",password:"",single_sign:false};
  	$scope.isLogin = true;
  	$scope.myscroll=null;

  	//LocalMyDb.resetDb();return;
  	//check if already login or just register
	var data = "";
	var mst_data = LocalMyDb.storeFunction.checkNewInstallation();
	if (mst_data==undefined || mst_data==null){
	  	//first time
	  	console.log("first time!");
	}
	else{
		//check startup
		console.log("already register!");
		CacheServiceApp.put("login_user",mst_data.username);
		//alert(CacheServiceApp.get("login_user"));
		console.log(LocalMyDb.storeFunction.exportJSON());
		//$navigate.go("vaults","slide");
		setTimeout(function(){
			$location.path("/vaults");	
		},300);
		
		return;
	}
	//////////debug data users .vaulth
	console.log(LocalMyDb.db.query("users"));
	console.log(LocalMyDb.db.query("vaults"));

	$scope.register=function(reg){
		if (LocalMyDb.db.query("users",{user_name:reg.username}).length){
			alert("Username alread taken!");
		}
		else{
			var currentDate = new Date();
			var joined = currentDate.getDate() + "/" + (currentDate.getMonth()+1) + "/" + currentDate.getFullYear();
			console.log(LocalMyDb.db.insert("users",{user_id:reg.username,user_name:reg.username,password:reg.password,email:reg.email,date_joined:joined}));
			myScroll2.scrollToPage(0,0,200);
			//LocalMyDb.db.commit();
			$scope.registerinfo.id= LocalMyDb.db.query("users",{user_id:reg.username})[0].ID;
			$scope.formRegisterDone=true;
			login_username = reg.username;
		}
	}
	var login_username="";
	$scope.setupVault=function(vault){
		if (LocalMyDb.db.query("vaults",{vault_name:vault.name}).length){
			alert("Vault name is already taken!");
		}
		else{
			//dbAccess.db.createTable("vaults",["vault_id","vault_name","vault_password","vault_single_sign_check","created_date"]);
			var currentDate = new Date();
			var created = currentDate.getDate() + "/" + (currentDate.getMonth()+1) + "/" + currentDate.getFullYear();
			console.log(LocalMyDb.db.insert("vaults",
					{
						user_id:$scope.registerinfo.id,
						vault_name:$scope.vault.name,
						vault_password:$scope.vault.password,
						vault_single_sign_check:$scope.vault.single_sign,
						created_date:created
					}
				));
			$scope.formVaultDone=true;
			
			myScroll2.scrollToPage(0,0,200);
		}
	}

	$scope.finish= function(){
		var currentDate = new Date();
		var created = currentDate.getDate() + "/" + (currentDate.getMonth()+1) + "/" + currentDate.getFullYear();
		//set first installation
		LocalMyDb.db.insert("master_db",{fresh_installation:true,installation_date:created,username:login_username});
		LocalMyDb.db.commit();
		$navigate.go("login","slide");
	}
});

$app.controller('LoginController', function($scope, $http,LocalMyDb,$navigate,CacheServiceApp,MethodHandler,$location){
	MethodHandler.text="";
  	MethodHandler.func=null;
	MethodHandler.show=false;


	//check if already login or just register
	var data = "";
	var mst_data = LocalMyDb.storeFunction.checkNewInstallation();
	if (mst_data==undefined || mst_data==null){
	  	//first time
	  	console.log("first time!");
	}
	else{
		//check startup
		CacheServiceApp.put("login_user",mst_data.username);
		
		console.log(LocalMyDb.storeFunction.exportJSON());
		setTimeout(function(){
			$location.path("/vaults");	
		},300);
	}

	$scope.logininfo={username:"",password:""};
	$scope.login=function(logininfo){
		var query = LocalMyDb.db.query("users",{user_name:logininfo.username,password:logininfo.password});
		if (query.length>0){
			//login success
			// temporarily navigate to vault
			CacheServiceApp.put("login_user",logininfo.username);
			alert(CacheServiceApp.get("login_user"));
			$navigate.go("vaults","slide");
		}
		else
		{
			//login fail
			alert("Invalid Username or password!");
		}

	}
});
