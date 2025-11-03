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
            templateUrl: 'app/views/recipeViews/add/addRecipes.html',
            controller: 'addRecipeController'
        })
        .otherwise({
            redirectTo: '/'
        });
});


app.controller('appController', function($scope, $rootScope, $location) {
    //$scope.hideNavbar = false;

    // listen to route changes
    $rootScope.$on('$routeChangeSuccess', function() {
        var path = $location.path();

        // Hide navbar on login/register pages
        if (path === '/' || path === '/register') {
            $scope.hideNavbar = true;
        } else {
            $scope.hideNavbar = false;
        }
    });
});