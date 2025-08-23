app.controller('weekrecipesController', function($scope, $routeParams, $location, RecipeService, loaderService, notificationService) {
    if ($routeParams.id) {
        loaderService.showLoader();
        RecipeService.get($routeParams.id).then(function(response) {
            $scope.recipe = response;
            loaderService.hideLoader();
        })
        .catch((error) => {
            console.error(error);
            loaderService.hideLoader();
            notificationService.fail("Could not get Recipe please tell husband!!!!");
          });
    } else {
        loaderService.showLoader();
        RecipeService.getRecipeForTheWeek().then(function(response) {
            $scope.recipes = response;
            loaderService.hideLoader();
        })
        .catch((error) => {
            console.error(error);
            loaderService.hideLoader();
            notificationService.fail("Could not get Recipe please tell husband!!!!");
          });
    }

    function SetRecipeItem(a) {
        $scope.recipe = a;
    }

    $scope.goHome = function() {
        $location.path('/');
    };

    $scope.setRecipeForTheWeek = function(){
        loaderService.showLoader();
        RecipeService.SetRecipeForWeek(id).then(function(response) {
        })
        .catch((error) => {
            console.error(error);
            loaderService.hideLoader();
            notificationService.fail("Could not add Recipe please tell husband!!!!");
          });
    }

    $scope.removeRecipeForTheWeek = function(){
        loaderService.showLoader();
        RecipeService.RemoveRecipeForWeek(id).then(function(response) {
            loaderService.hideLoader();
        })
        .catch((error) => {
            console.error(error);
            loaderService.hideLoader();
            notificationService.fail("Could not remove Recipe please tell husband!!!!");
          });
    }

    // Check the current path and set showBackButton accordingly
    $scope.$on('$routeChangeSuccess', function() {
        var path = $location.path();
        $scope.showBackButton = (path === '/add' || path === '/edit' || path === '/view');
    });

    $scope.getViewRecipe = function(id){
        loaderService.showLoader();
        RecipeService.get(id).then(function(response) {
            SetRecipeItem(response);
            $location.path('/view/' + id)
            loaderService.hideLoader();
        })
        .catch((error) => {
            console.error(error);
            loaderService.hideLoader();
            notificationService.fail("Could not get Recipe please tell husband!!!!");
          });
    }
});