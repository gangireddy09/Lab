var app = angular.module("labModule",['ui.router','ngDialog','ui.bootstrap','ngSanitize', 'ngMessages', 'tcLib','hcLib']);

app.config(['$stateProvider', '$urlRouterProvider',function ($stateProvider, $urlRouterProvider){
	$stateProvider.state({
		name:'login',
		url:'/login',
		controller : 'loginCtrl',
		templateUrl:"./views/common/auth/login.html"
	}).state('home', {
		url: '/home',
		templateUrl: './views/labHome.html'
    })
    .state('patientList', {
		url: '/patientList',
		parent : 'home',
		template: '<patient-search view-mode="patientSearch-info"></patient-search>',
    })
    //Bill desk - payments for lab tests, scanning report
    .state('billDesk', {
		url: '/bill-desk',
		templateUrl: './views/billdesk/billDesk.html'
    })
    .state('labTestsEntry', {
		url: '/lab-entry/{labPatientId}',
		param : {
			labPatientId : null
		},
		parent : 'billDesk',
		controller: 'labTestsEntryCtrl',
		templateUrl: './views/dataEntry/lab/labTestsEntry.html'
    })
    .state('billDeskLabs', {
		url: '/lab-list',
		parent : 'billDesk',
		controller: 'labTestsCtrl',
		templateUrl: './views/dataEntry/lab/labTests.html'
    })
    //lab report entry - lab tests
    .state('labReport', {
		url: '/lab-report',
		templateUrl: './views/dataEntry/labReport.html'
    })
    .state('labTests', {
		url: '/lab-list',
		parent : 'labReport',
		controller: 'labTestsCtrl',
		templateUrl: './views/dataEntry/lab/labTests.html'
    })
    .state('patientWise', {
		url: '/{opLabPatientId}',
		param : {
			opLabPatientId : null
		},
		parent : 'labReport',
		controller: 'labTestsReportCtrl',
		templateUrl: './views/dataEntry/lab/labTestsReport.html'
    });

	$urlRouterProvider.otherwise('/login');
}]);

app.filter('tcCamelCase', function() {
	return function(input) {
		input = input || ''; 
		return input.replace(/\w\S*/g, function(txt){
			var str = txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
			for (var i = 0; i < str.length; i++) {
				if(str[i] === '.') {
					str = str.replace(str.charAt(i+1),function(a){return a.toUpperCase();});
				}
			}
			return str; 
		});
	};
});		
