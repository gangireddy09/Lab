angular.module("labModule").controller("loginCtrl",['$scope','loginService','opService','$state', 'commonService', function($scope,loginService,opService,$state, commonService){
	
	$scope.submit = submit;
	$scope.getDoctorByUserId = getDoctorByUserId;
	
	function init(){
		$scope.invalidLogin = false;
		$scope.loginForm = {};
	}
	function submit() {
		loginService.login($scope.user).then(function(res){
			if(res){
				if(res.userRole.roleName === "BILLDESK"){
					$state.go('labTestsEntry');
				}else if(res.userRole.roleName === "DATAENTRY"){
					$state.go('labTests');
				}else{
					$scope.invalidLogin = true;
					$scope.user = {};
					$scope.loginForm.$setPristine();
				}
				sessionStorage.setItem('role',res.userRole.roleName);
				sessionStorage.setItem('userName',res.userId);
			}else{
				$scope.invalidLogin = true;
				$scope.user = {};
				$scope.loginForm.$setPristine();
			}
		});
	}

	function getDoctorByUserId(userId) {
		sessionStorage.clear();
		commonService.getDoctorByUserId(userId).then(function(res){
			if (res.id) {
				var doctor = angular.copy(res);
				sessionStorage.setItem('doctor',JSON.stringify(doctor));
				$state.go('opList');
			}
		});
	};
	init();
}]);