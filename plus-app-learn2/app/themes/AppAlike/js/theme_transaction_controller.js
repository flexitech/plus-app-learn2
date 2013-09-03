$app.controller('BillingPlanViewController', function($scope, $http,CacheServiceApp,LocalMyDb,MethodHandler,$navigate){

 	MethodHandler.text="New";
	MethodHandler.show=true;
	MethodHandler.icon_class ="glyphicon glyphicon-chevron-right";
	MethodHandler.func=function(){ $navigate.go("billing_plan_view_all_assets","slide")};
	$scope.billing_plans=[];
	//// query all billing plans

	$scope.billing_plans = LocalMyDb.db.query("billing_plans");
	$scope.showPlan = function(id){
		if (canClick)
			$navigate.go("billing_plan_info/" + id + "/update","slide");

	}
	$scope.deletePlan=function(id){
		///check if it has been used in invoices
		var canDel= _.where(LocalMyDb.db.query("invoices"),{billing_plan_id:id+""}).length<=0;
		if (canDel){
			LocalMyDb.db.deleteRows("billing_plans",{ID:id});
			LocalMyDb.db.commit();
			$scope.billing_plans = LocalMyDb.db.query("billing_plans");

		}
		else{
			alert("Cannot Delete this plan!");
		}
		setTimeout(function(){
			
			canClick=true;
		},1000);
	}
	var  lastButton = null;
	var canClick=true;
	$scope.showDelete=function(o){
		canClick=false;
		$scope.hideDelete();
		lastButton = $(o);
		lastButton.removeClass('hideDeleteButton');
		lastButton.addClass('showDeleteButton');
		setTimeout(function(){
			$scope.hideDelete();
			canClick=true;
		},2000);
	}
	$scope.hideDelete=function(){
		if (lastButton!=null){
			lastButton.removeClass('showDeleteButton');
			lastButton.addClass('hideDeleteButton');
		}

	}

});
/////////// billing_plan
$app.controller('BillingPlanViewAllAssetController', function($scope, $http,CacheServiceApp,LocalMyDb,MethodHandler,$navigate){
	MethodHandler.text="Back";
	MethodHandler.show=true;
	MethodHandler.icon_class ="glyphicon glyphicon-chevron-left";
	MethodHandler.func=function(){ $navigate.back()};

	///// query all assets
	$scope.assets=[];
	var assets = LocalMyDb.db.query("assets");
	var billing_plans = LocalMyDb.db.query("billing_plans");
	
	$scope.assets = _.reject(assets,function(asset){
		return _.where(billing_plans,{asset_id:asset.ID+""}).length>0;
	});
});
$app.controller('BillingPlanInfoController', function($scope, $http,CacheServiceApp,LocalMyDb,MethodHandler,$navigate,$routeParams){
	//Asset id
	$scope.id = $routeParams.id;
	//mode: update/new 
	$scope.mode = $routeParams.mode;
 	MethodHandler.text="Plans";
	MethodHandler.show=true;
	MethodHandler.icon_class ="glyphicon glyphicon-chevron-right";
	MethodHandler.func=function(){ $navigate.go("billing_plan_view","slide")};

	/// init 
	$scope.bill={name:"",note:"",tag:"",duedate:""};
	/// if update, load to textbox
	if ($scope.mode=="update"){
		var bill = LocalMyDb.db.query("billing_plans",{ID:$scope.id})[0];
		if (bill!=undefined){
			$scope.bill.name = bill.plan_name;
			$scope.bill.note = bill.note;
			$scope.bill.tag = bill.tag;
			$scope.bill.duedate = bill.due_date;
		}
		else{
			$scope.mode="new";
		}
	}
	$scope.createBill=function(bill){
		var uname = CacheServiceApp.get("login_user");
		var uid = LocalMyDb.db.query("users",{user_name:uname})[0].ID;
		if (uid==undefined || uid<=0){
			alert("You have not login yet! Please login!");
			$navigate.go("login","slide");
			return;
		}
		if ($scope.mode=="new"){
			//get user id

			var currentDate = new Date();
			var date = currentDate.getDate() + "/" + (currentDate.getMonth()+1) + "/" + currentDate.getFullYear();
			var row_affected = LocalMyDb.db.insert("billing_plans",{
					plan_name:bill.name,
					created_date:date,
					due_date:bill.duedate,
					tag:bill.tag,
					asset_id:$scope.id,
					user_id:uid,
					note:bill.note
					});
			LocalMyDb.db.commit();
			if (row_affected>0){
				alert("Save Successfully!");
				$scope.bill.name="";
				$scope.bill.tag="";
				$scope.bill.note="";
				$scope.bill.duedate="";

			}
			else{
				alert("Save fail!");
			}
		}
		else{
			var row_affected = LocalMyDb.db.update("billing_plans",{ID:$scope.id},function(row){
				row.plan_name=bill.name;
				row.due_date=bill.duedate;
				row.tag=bill.tag;				
				row.note=bill.note;
				return row;
			});
			LocalMyDb.db.commit();
			if (row_affected>0){
				alert("Save Successfully!");
				$scope.bill.name="";
				$scope.bill.tag="";
				$scope.bill.note="";
				$scope.bill.duedate="";

			}
			else{
				alert("Save fail!");
			}
		}
	}
});
///////// invoices
$app.controller('InvoiceViewAllBillingPlanController', function($scope, $http,CacheServiceApp,LocalMyDb,MethodHandler,$navigate,$routeParams){
	$scope.invoice_bills=[];
	if ($routeParams.val==undefined && $routeParams.val==undefined){
	
	

		$scope.invoice_bills = LocalMyDb.db.query("billing_plans");
	}
	else{
		$scope.invoice_bills = LocalMyDb.db.query("billing_plans",{due_date:$routeParams.val+""});
	}
	MethodHandler.text="New";
	MethodHandler.show=false;
	MethodHandler.icon_class ="glyphicon glyphicon-chevron-right";
	MethodHandler.func=function(){ };
	
	$scope.createInvoice = function(id){
		
		//$navigate.go("billing_plan_info/" + id + "/update","slide");

	}
	
});