(function () {
    'use strict';
    angular
        .module('recipeApp')
        .controller('loginController', function ($scope, $http, $q, $location, authService) {
            var url = "http://localhost:8080/";

            $scope.login = function() {
                $http.post(url + 'api/auth/login', GetLoginInfo())
                    .then(function(response) {
                        authService.login(response.data.token);
                        authService.setUser(response.data);
                        $location.path('/home');
                    }, function(error) {
                        $scope.errorMessage = "Invalid login credentials";
                    });
            };
            
            $scope.UserRegister = _UserRegister;
            function _UserRegister(){
                $location.path('/register')
            }

            function GetLoginInfo(){
                return $scope.user;
            }

            function LoadView() {

            }

            LoadView();
        });
})();