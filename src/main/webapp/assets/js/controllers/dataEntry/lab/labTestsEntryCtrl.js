angular.module("labModule").controller("labTestsEntryCtrl", ['$scope', 'commonService','labPatientService', '$state','ngDialog','$stateParams','$timeout','$parse',
                                                                function($scope, commonService,labPatientService, $state,ngDialog,$stateParams,$timeout, $parse) {
	
	$scope.onSelectPatient = onSelectPatient;
	$scope.saveLabTestPatient = saveLabTestPatient;
	$scope.addLabPatient = addLabPatient;
	$scope.addOpPatient = addOpPatient;
	$scope.listOpPatients = listOpPatients;
	$scope.listPatients = listPatients;
	$scope.deleteTest = deleteTest;
	$scope.getLabPatientTests = getLabPatientTests;
	$scope.toggleExpansion = toggleExpansion;
	$scope.clearAll = clearAll;
	$scope.totalFeeCal = totalFeeCal;
	$scope.changeSubPayType = changeSubPayType;
	$scope.labPatient = {};
	$scope.payment  = {};
	$scope.dirOptions = {};
	$scope.form = {salesPaymentForm:{}};
	$scope.formLoader = false;
	$scope.getOperatorList = getOperatorList;
	
	var testIds = [];
	function init() {
		$scope.operator = PHARMACY_OPERATOR;
		getOperatorList();
		$scope.selectAll = false;
		$scope.expanded = false;
		getDoctors();
		$scope.payTypeList = SALES_PAYMENT_TYPES;
		$scope.freePayTypeList = SALES_FREE_PAYMENT_TYPES;
		$scope.creditPayTypeList = SALES_CREDIT_PAYMENT_TYPES;
		$scope.subPayType = undefined;
		$scope.dispenserList = [];
		$scope.labPatient = {};
		$scope.labPatient.hospitalName = HOSPITAL_NAME;
		$scope.isSaved = false;
		commonService.getLabData().then(function(data) {
			$scope.labsData = JSON.parse(data['json']);
		});
		commonService.getLabReportData().then(function(data) {
			$scope.labsReport = JSON.parse(data['json']);
		});
		 $timeout(function () {
		    if($stateParams.labPatientId){
		    	$scope.labPatientId = $stateParams.labPatientId;
		    	getLabPatientTests($stateParams.labPatientId);
		    }
		  }, 100);
	}
	
	function getOperatorList(){
		commonService.getOperatorList($scope.operator).then(function(res){
			$scope.dispenserList= res;
		})
	}
	
	function clearAll(){
		$scope.selectedLabs = {};
		$scope.cost = 0;
		$scope.selectAll = false;
	}
	function getDoctors(){
		commonService.getDoctors().then(function(res) {
			$scope.doctors = res;
		});
	}
	function onSelectPatient(patient){
		$scope.selectedPatient = patient;
		$scope.labPatient.patient = patient;
		$scope.labPatient.customerName  = patient.name;
		$scope.paidBy = $scope.labPatient.patient.name;
		delete $scope.selectedPatient.photoString;
		$scope.isSaved = false;
		ngDialog.close();
	}
	function deleteTest(test){
		$scope.dirOptions.removeTest(test);
	}
	// calculate total fee either on save or update lab patient
	function totalFeeCal(fromSelectAll, selected){
		$scope.cost = 0;
		testIds = [];
		var hasUnSelectedLab = false;
		angular.forEach($scope.selectedLabs, function(values, key){
			values.map(function(val) {
				val.isFeePaid = fromSelectAll? selected: val.isFeePaid; 
				if(val.whatsappCost){
					val.isWhatsapp = !val.isFeePaid ? false: val.isWhatsapp;
				}
				if(!val.isFeePaid){
					hasUnSelectedLab = true;
				}
				testId = {};
				testId['id'] = val.id;
				testId['src'] = val.src || sessionStorage.getItem('userName');
				testIds.push(testId);
				if(val.isFeePaid) {
					$scope.cost += parseFloat(Number((val.isWhatsapp?val.whatsappCost:val.cost)));
					testId['val'] = val.isFeePaid ;
				} else {
					testId['val'] = false;
				}
			});
		});
		$scope.selectAll = !hasUnSelectedLab;
	}
	function changeSubPayType(type){
		$scope.subPayType = type;
	}
	// save lab patient
	function saveLabTestPatient(){
		$scope.formLoader = true;
		if($scope.labPatientId){
			$scope.labPatient.id = $scope.labPatientId;
			$scope.labPatient.testIds = JSON.stringify(testIds);
			$scope.labPatient.status = LAB_STATUS[0];
			$scope.labPatient.dispensedBy  =  $scope.labPatient.dispensedBy;
		}else{
			$scope.labPatient.doctorName = $scope.labPatient.doctorName;
			$scope.labPatient.dispensedBy  =  $scope.labPatient.dispensedBy;
			$scope.labPatient.testIds = JSON.stringify(testIds);
			$scope.labPatient.status =  LAB_STATUS[1];
			};
		labPatientService.save($scope.labPatient).then(function(res){
			if(res){
				$scope.isSaved = true;
				$scope.labPatient.id = res.id;
				getLabTestsByPatientId();
				$scope.formLoader = false;
				$scope.formMsgClass = "form-msg-success";
				$scope.formMsgContent = "Bill Success.";
				$scope.clearFormMsg();
			}else{
				$scope.formLoader = false;
				$scope.formMsgClass = "form-msg-error";
				$scope.formMsgContent = "Error Bill.";
				$scope.clearFormMsg();
			}
		}, function(e){
			console.log('Error: ', e);
			$scope.formLoader = false;
		});
	}
	//fetch lab patient by patient id
	function getLabTestsByPatientId(){
		$scope.formLoader = true;
		labPatientService.search({patientId:$scope.labPatient.patient.id}).then(function(res){
			if(res.length){
				var labTestIds = JSON.parse(res[0].testIds);
				$scope.data = {
						id: res[0].id,
						labs: getLabsByIds(labTestIds, $scope.labsData,$scope.labsReport,true),
						patient: res[0].patient,
						hospitalName: res[0].hospitalName,
						doctorName: res[0].doctorName,
						createdOn: res[0].createdOn
					};
				var req = {
						opLabPatient: $scope.labPatient, 
						labReport: JSON.stringify($scope.data),
						fee: $scope.cost,
						payType: $scope.payType == 'Free'? $scope.subPayType : $scope.payType,
						paymentRemarks: $scope.paymentRemarks
					};
				labPatientService.getReport($parse('data.id')($scope)).then(function(res){
					if(res){
						req.id = $parse('id')(res);
					}
					labPatientService.saveReport(req).then(function(report){
						if(report){
							$scope.payment = {
									report : { id : report.id},
									paidBy : $scope.paidBy,
									receivedBy : $scope.labPatient.dispensedBy,
									paidOn : new Date(),
									paidAmount : $scope.payment.paidAmount
							};
							labPatientService.savePayment($scope.payment).then(function(pay){
								if(pay){
									$scope.isView = true;
									$state.go('billDeskLabs');
									$scope.formLoader = false;
								}else{
									$scope.formLoader = false;
								}
							}, function(e){
								console.log('Error: ', e);
								$scope.formLoader = false;
							});
						}else{
							$scope.formLoader = false;
						}
					}, function(e){
						console.log('Error: ', e);
						$scope.formLoader = false;
					});
				});
				$scope.formLoader = false;
			}
		}, function(e){
			console.log('Error: ', e);
			$scope.formLoader = false;
		});
	}
	$scope.$watch("payType",function(val) {
		if(val == 'Free'){
			$scope.cost = 0;
			$scope.paidAmount = 0;
		}else if(val =='Credit'){
			$scope.paidAmount = 0;
			$scope.totalFeeCal();
		}else if(val != undefined){
			$scope.totalFeeCal();
		}
	});
	//To fetch existing lab patient with report (edit the lab) 
	function getLabPatientTests(labPatientId){
		$scope.formLoader = true;
		labPatientService.search({labPatientId:labPatientId}).then(function(res){
			if(res.length){
				var labTestIds = JSON.parse(res[0].testIds);
				$scope.labPatientId = res[0].id;
				labPatientService.getReport($scope.labPatientId).then(function(report){
					if(report){
						$scope.cost = report.fee;
						$scope.labPatientReportId = report.id;
					}
				});
				$scope.data = {
						id:res[0].id,
						labs: getLabsByIds(labTestIds, $scope.labsData,$scope.labsReport,true),
						patient: res[0].patient,
						hospitalName: res[0].hospitalName,
						doctorName: res[0].doctorName,
						customerName: res[0].customerName
				};
				$scope.selectedPatient = $scope.data.patient;
				$scope.labPatient.patient = $scope.data.patient;
				$scope.labPatient.customerName = $scope.data.customerName;
				$scope.labPatient.doctorName = $scope.data.doctorName;
				$scope.labPatient.hospitalName = $scope.data.hospitalName;
				$scope.selectedLabs  = getSelectedLabs($scope.data.labs,$scope.labsReport);
				totalFeeCal();
				$scope.formLoader = false;
			}else{
				$scope.formLoader = false;
			}
		}, function(e){
			console.log('Error: ', e);
			$scope.formLoader = false;
		});
	}
	//patients dialog box
	function listPatients(){
		ngDialog.open({
			template:'<patient-search on-select="onSelectPatient($patient)" on-save="onPatientAdd(patient)"  select="select"></patient-search>',
    		className: 'ngdialog-theme-default ngdialog-lg',
    		scope : $scope,
    		plain : true
    	}).closePromise.then(function() {
    	});
	}
	//OP patients dialog box
	function listOpPatients(){
		ngDialog.open({
			template:'./views/dataEntry/lab/addOpPatient.html',
    		className: 'ngdialog-theme-default ngdialog-lg',
    		controller:'addOpPatientCtrl',
    		scope : $scope
    	}).closePromise.then(function() {
    	});
	}
	$scope.clearFormMsg = function() {
		$timeout(function() {
			$scope.formMsgContent = undefined;
		}, 3000);
	};
	init();
	
	function addLabPatient(labPatient){
		$scope.labPatient = labPatient; 
		testIds = JSON.parse($scope.labPatient.testIds);
		labs = getLabsByIds(testIds, $scope.labsData,$scope.labsReport,true),
		$scope.selectedLabs  = getSelectedLabs(labs,$scope.labsReport);
		onSelectPatient(labPatient.patient);
		$scope.payment = {};
		$scope.cost = 0;
	}
	
	function addOpPatient(opPatient){
		$scope.labPatient.doctorName = opPatient.op.doctor.name;
		$scope.labPatient.opPatient = opPatient;
		onSelectPatient(opPatient.patient);
		$scope.payment = {};
		$scope.cost = 0;
	}
	
	function toggleExpansion(fromLabs){
		$scope.expanded = !$scope.expanded;
		if(fromLabs){
			$scope.expanded = true;
		}
	};
}]);
