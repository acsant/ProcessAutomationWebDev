var app = angular.module('jBPMRest', []);

app.controller('AuthenticationController', ['$scope', '$http',
	function($scope, $http) {
		$scope.taskList = [];	
		$http.post('/getTaskList').success(function (data, status, headers, config) {			
			$scope.taskList = data;
		}).error(function (data, status, headers, config) {
			
		});
		 
	}
]);
