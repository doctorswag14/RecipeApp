var app = angular.module('recipeApp', ['ngRoute', 'infinite-scroll']);

app.config(function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(false);

    $routeProvider
        .when('/', {
            templateUrl: 'app/views/authetication/login/login.html',
            controller: 'loginController',
            data: {
                hideNavbar: true
            }
        })
        .when('/register', {
            templateUrl: 'app/views/authetication/register/register.html',
            controller: 'registerController',
            data: {
                hideNavbar: true
            }
        })
        .when('/edit/:id', {
            templateUrl: 'app/views/recipeViews/edit/editRecipe.html',
            controller: 'editrecipeController',
            data: {
                hideNavbar: false
            }
        })
        .when('/view/:id', {
            templateUrl: 'app/views/recipeViews/view/viewRecipe.html',
            controller: 'viewController',
            data: {
                hideNavBar: false
            }
        })
        .when('/week', {
            templateUrl: 'app/views/recipeViews/week/recipesfortheweek.html',
            controller: 'weekrecipesController'
        })
        .when('/home', {
            templateUrl: 'app/views/recipeViews/main/recipes.html',
            controller: 'recipeController'
        })
        .when('/add', {
            templateUrl: 'app/views/recipeViews/add/addRecipe.html',
            controller: 'addRecipeController'
        })
        .when('/profile/:username', {
            templateUrl: 'app/views/recipeViews/profile/profile.html',
            controller: 'profileController'
        })
        .otherwise({
            redirectTo: '/'
        });
});


app.controller('appController', function($scope, $rootScope, $location, $window, usernotificationService) {
    $scope.isFriendDropdownOpen = false;

    $scope.toggleFriendDropdown = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.isFriendDropdownOpen = !$scope.isFriendDropdownOpen;
        UpdateFriendRequestNotification();
    };

    function UpdateFriendRequestNotification() {
        var userdata = $window.localStorage.getItem('thomastechuser');
        var user = JSON.parse(userdata);

        var tmpObj = {
            SenderUsername: null,
            ReceiverUsername: user.Username
        };

        usernotificationService.updateFriendRequestCount(tmpObj)
        .then(function(response) {
            GetFriendRequestCount();
        })
        .catch((error) => {
            console.error(error);
            notificationService.fail("Could not get Friend Request Count");
        });
    }

    // Optional: close when clicking anywhere else
    document.addEventListener('click', function () {
        $scope.$applyAsync(function () {
            $scope.isFriendDropdownOpen = false;
        });
    });

    $scope.friendRequests = [];

    $scope.acceptFriendRequest = function(request) {
        // call API
    };

    $scope.declineFriendRequest = function(request) {
        // call API
    };
    
    $scope.GoToProfile = function(){
        var userdata = $window.localStorage.getItem('thomastechuser');
        var user = JSON.parse(userdata);
        $location.path('/profile/' + user.Username);
    }

    function SetFriendRequestCount(a){
        $scope.friendRequestCount = a;
    }

    function SetFriendRequest(a){
        $scope.friendRequests = a;
    }

    function GetFriendRequestCount(){
        var userdata = $window.localStorage.getItem('thomastechuser');
        var user = JSON.parse(userdata);

        var tmpObj = {
            SenderUsername: null,
            ReceiverUsername: user.Username
        };

        usernotificationService.getFriendRequestCount(tmpObj)
        .then(function(response) {
            SetFriendRequest(response.requests);
            SetFriendRequestCount(response.count);
        })
        .catch((error) => {
            console.error(error);
            notificationService.fail("Could not get Friend Request Count");
        });
    }

    // listen to route changes
    $rootScope.$on('$routeChangeSuccess', function() {
        var path = $location.path();

        // Hide navbar on login/register pages
        if (path === '/' || path === '/register') {
            $scope.hideNavbar = true;
        } else {
            $scope.hideNavbar = false;

            GetFriendRequestCount();
        }
    });
});