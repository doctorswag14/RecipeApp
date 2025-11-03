(function () {
    'use strict';
    angular
        .module('recipeApp')
        .controller('registerController', function ($scope, $http, $q, $location) {
            //Update Urls with the url that the API is running on.
            $scope.register = function() {
                var userData = GetUserData();
                $http.post('http://localhost:8080/api/auth/register', userData)
                    .then(function(response) {
                        $location.path('/login');
                    }, function(error) {
                        $scope.errorMessage = "Error registering user";
                    });
            };

            $scope.BackToLogin = _BackToLogin;
            function _BackToLogin(){
                $location.path('/')
            }

            function GetUserData(){
                return $scope.user;
            }
            
            function LoadView() {

            }

            LoadView();
        });
})();