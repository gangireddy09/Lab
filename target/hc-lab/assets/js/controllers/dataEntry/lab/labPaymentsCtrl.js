angular.module('labModule').controller('labPaymentsCtrl',['$scope','labPatientService','commonService','$timeout',function($scope, labPatientService,commonService, $timeout){
	
	$scope.getPayments = getPayments;
	$scope.savePayment = savePayment;
	$scope.calPendingAmount = calPendingAmount;
	$scope.togglePayment = togglePayment;
	
	function dialogInit(){
		$scope.operator = PHARMACY_OPERATOR;
		$scope.form = {
						salesPaymentForm:{}
					};
		getPayments();
		getLabOperatorList();
		$scope.dispenserList = [];
		$scope.isPayment = false;
		$scope.formLoader = false;
		$scope.payment = {paidOn : new Date(),report : {id : $scope.report.id}};
	}
	
	function getLabOperatorList(){
		commonService.getOperatorList($scope.operator).then(function(res){
			$scope.dispenserList= res;
		})
	}
	

	function togglePayment(){
		$scope.isPayment = !$scope.isPayment;
	}
	function getPayments(){
		$scope.formLoader = true;
		labPatientService.getPayments($scope.report.id).then(function(res){
			if(res.length){
				$scope.formLoader = false;
				$scope.payments = res;
				$scope.report.isLabClosed = res[0].report.isLabClosed;
			}else{
				$scope.formLoader = false;
			}
		}).catch(function(e){
			console.log(e);
			$scope.formLoader = false;
		});
	}
	function savePayment(){
		$scope.formLoader = true;
		labPatientService.savePayment($scope.payment).then(function(res){
			if(res){
				$scope.form.salesPaymentForm.$setPristine();
				$scope.formLoader = false;
				$scope.formMsgClass = "form-msg-success";
				$scope.formMsgContent = "Success Bill.";
				$scope.clearFormMsg();
				dialogInit();
			}else{
				$scope.formMsgClass = "form-msg-error";
				$scope.formMsgContent = "Error Bill.";
				$scope.clearFormMsg();
			}
		}).catch(function(e){
			console.log(e);
			$scope.formLoader = false;
		});
	}
	function calPendingAmount(){
		$scope.pendingAmount = ($scope.report.fee - $scope.payments.add('paidAmount')- $scope.payment.paidAmount).toFixed(2);
	}
	$scope.clearFormMsg = function() {
		$timeout(function() {
			$scope.formMsgContent = undefined;
		}, 3000);
	};
	dialogInit();
}]);