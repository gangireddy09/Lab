angular.module("labModule").controller("addOpPatientCtrl",['$scope','opService','commonService','labPatientService','opPatientService',function($scope,opService,commonService,labPatientService,opPatientService){
	
	$scope.init = init;
	$scope.searchLabPatients = searchLabPatients;
	$scope.getOpPatients = getOpPatients;
	$scope.getOpList = getOpList;
	$scope.toggleSearch = toggleSearch;
	$scope.sort = sort;
	$scope.showLabSearch = true;
	$scope.showOpSearch = false;
	$scope.defaultStatusSort = true;
	var enableDateSort = true;
	var enableStatusSort = true;
	
	function init(){
		getDoctors();
		$scope.op = {opDate: new Date()};
		searchLabPatients(1,$scope.op.opDate);
	}
	
	function toggleSearch(){
		$scope.showLabSearch = !$scope.showLabSearch;
		$scope.showOpSearch = !$scope.showOpSearch;
	}
	
	function getDoctors(){
		commonService.getDoctors().then(function(res) {
			$scope.doctors = res;
		});
	}
	
	function getOpList(doctorId,searchDate){
		opService.search({doctor:{id:doctorId},opDate:dateToStr(new Date(searchDate))}).then(function(res) {
			$scope.opList = res;
			
		});
	}
	
	function getOpPatients(op){
		opPatientService.getOpPatientsListByOptions({op:{id:op.id}}).then(function(res) {
			$scope.opPatientList = res;
			
		});
	}
	
	function searchLabPatients(doctorId,searchDate){
		labPatientService.search({doctorId:doctorId,createdOn:dateToStr(new Date(searchDate))}).then(function(res){
			if(res){
				$scope.labPatients = res;
			}
		});
	}
	
	//sort both date and status
	function sort(defaultStatusSort){
		$scope.defaultStatusSort = defaultStatusSort;
		if($scope.defaultStatusSort === true){
			var list = $scope.labPatients;
			if(enableStatusSort === true){
				for(var i = 0; i < list.length; i++){
					for(var j = i + 1; j < list.length; j++){
						if(list[j].opPatient.status.toLowerCase() === 'new'){
							var temp = list[i];
							list[i] = list[j];
							list[j] = temp;
						}
					}
				}
				$scope.labPatients = list;
				enableStatusSort = false;
			}else{
				for(var i = 0; i < list.length; i++){
					for(var j = i + 1; j < list.length; j++){
						if(list[j].opPatient.status.toLowerCase() === 'consulted'){
							var temp = list[i];
							list[i] = list[j];
							list[j] = temp;
						}
					}
				}
				$scope.labPatients = list;
				enableStatusSort = true;
			}
			$scope.defaultStatusSort = false;
		}else{
			var list = $scope.labPatients;
			if(enableDateSort === true){
				list.sort(function(a,b){
					var c = new Date(a.createdOn);
					var d = new Date(b.createdOn);
					return c - d;
				});
				$scope.labPatients = list;
				enableDateSort = false;
			}else{
				list.sort(function(a,b){
					var c = new Date(a.createdOn);
					var d = new Date(b.createdOn);
					return d - c;
				});
				$scope.labPatients = list;
				enableDateSort = true;
			}
			$scope.defaultStatusSort = true;
		}
	}
	
	init();
}]);