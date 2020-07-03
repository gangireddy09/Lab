<!DOCTYPE html>
<html ng-app="labModule">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">

		<title id="title">Lab</title>

		<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/assets/css/font-awesome.min.css" />
		<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/assets/css/hospital.css" />
		<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/assets/css/login.css" />
		<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/assets/css/doctorOP.css" />
		<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/assets/css/ngDialog.css" />
		<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/assets/css/print.css" />
		<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/assets/css/components.css" />
		<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/assets/css/theme-doctor.css" />
		<link rel="icon" type="icon" href="<%=request.getContextPath()%>/assets/images/hospital-logo.png"/> 
		<script>
			if(sessionStorage.getItem("role") == "DATAENTRY"){
				document.getElementById("title").innerHTML = "LABORATORY";
			}else if(sessionStorage.getItem("role") == "BILLDESK"){
				document.getElementById("title").innerHTML = "BILL DESK";
			}
		</script>
	</head>
	
	<body>
		<ui-view></ui-view>
	</body>
	
	
	<!-- Libs -->
	<script type="text/javascript" src="./assets/js/common/util.js"></script>
	<script type="text/javascript" src="./assets/js/lib/webcam.js"></script>

	<script type="text/javaScript" src="./assets/js/lib/angular.min.js"></script>
	<script type="text/javaScript" src="./assets/js/lib/jquery.min.js"></script>
	<script type="text/javaScript" src="./assets/js/lib/angular-messages.min.js"></script>
	<script type="text/javaScript" src="./assets/js/lib/angular-ui-router.min.js"></script>
	<script type="text/javaScript" src="./assets/js/lib/angular-sanitize.min.js"></script>
	<script type="text/javaScript" src="./assets/js/lib/ngDialog.min.js"></script>
	<script type="text/javaScript" src="./assets/js/lib/ui-bootstrap-tpls-2.2.0.min.js"></script>
	<script type="text/javascript" src="./assets/js/lib/webcam-directive.js"></script>
	<script type="text/javascript" src="./assets/js/lib/tc-lib.min.js"></script>
	<script type="text/javascript" src="./assets/js/lib/hc-lib.min.js"></script>

	<!-- <script type="text/javascript" src="./assets/js/common/utilityModule.js"></script> -->
	
	<!-- Module -->
	<script type="text/javascript" src="./assets/js/LabModule.js"></script>
	
	<!-- constants -->
	<script type="text/javascript" src="./assets/js/common/constant.js"></script>
	
	<!--Services  -->

	<!--Directives  --><!-- 
	<script type="text/javascript" src="./assets/js/directives/patientSearch.js"></script> --> 
	<script type="text/javascript" src="./assets/js/lab/directives/labSelectorDirective.js"></script>
	<script type="text/javascript" src="./assets/js/lab/directives/treeNodeDirective.js"></script>
	<script type="text/javascript" src="./assets/js/lab/directives/requisitionSlip.js"></script>
	
	<!-- Controllers -->
	<script type="text/javascript" src="./assets/js/controllers/auth/loginCtrl.js"></script>
	<script type="text/javascript" src="./assets/js/controllers/dataEntry/lab/labTestsEntryCtrl.js"></script>
	<script type="text/javascript" src="./assets/js/controllers/dataEntry/lab/labTestsCtrl.js"></script>
	<script type="text/javascript" src="./assets/js/controllers/dataEntry/lab/labTestsReportCtrl.js"></script>
	<script type="text/javascript" src="./assets/js/controllers/dataEntry/lab/labPaymentsCtrl.js"></script>
	<script type="text/javascript" src="./assets/js/controllers/dataEntry/lab/addOpPatientCtrl.js"></script>
		
</html>