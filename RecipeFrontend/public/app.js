var app = angular.module('recipeApp', ['ngRoute']);

app.config(function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(false);

    $routeProvider
        .when('/', {
            templateUrl: 'app/views/recipes.html',
            controller: 'RecipeController'
        })
        .when('/add', {
            templateUrl: 'app/views/addRecipe.html',
            controller: 'RecipeController'
        })
        .when('/edit/:id', {
            templateUrl: 'app/views/editRecipe.html',
            controller: 'RecipeController'
        })
        .when('/view/:id', {
            templateUrl: 'app/views/viewRecipe.html',
            controller: 'RecipeController'
        })
        .when('/week', {
            templateUrl: 'app/views/recipesfortheweek.html',
            controller: 'weekrecipesController'
        })
        .otherwise({
            redirectTo: '/'
        });
});