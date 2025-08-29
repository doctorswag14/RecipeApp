var app = angular.module('recipeApp', ['ngRoute']);

app.config(function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(false);

    $routeProvider
        .when('/', {
            templateUrl: 'app/views/authetication/login.html',
            controller: 'loginController'
        })
        .when('/register', {
            templateUrl: 'app/views/authetication/register.html',
            controller: 'registerController'
        })
        .when('/edit/:id', {
            templateUrl: 'app/views/recipeViews/edit/editRecipe.html',
            controller: 'editController'
        })
        .when('/view/:id', {
            templateUrl: 'app/views/recipeViews/view/viewRecipe.html',
            controller: 'viewController'
        })
        .when('/week', {
            templateUrl: 'app/views/recipeViews/week/recipesfortheweek.html',
            controller: 'weekrecipesController'
        })
        .when('/home', {
            templateUrl: 'app/views/recipeViews/main/recipes.html',
            controller: 'recipeController'
        })
        .otherwise({
            redirectTo: '/'
        });
});