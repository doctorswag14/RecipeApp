app.controller('viewController', function($scope, $routeParams, $location, recipeService, notificationService, loaderService) {
    if ($routeParams.id) {
        loaderService.showLoader();
        recipeService.get($routeParams.id).then(function(response) {
            $scope.recipe = response;
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

    $scope.$on('$routeChangeSuccess', function() {
        var path = $location.path();
        $scope.showBackButton = (path === '/add' || path === '/edit' || path === '/view');
    });

    function getViewRecipe(id){
        loaderService.showLoader();
        recipeService.get(id).then(function(response) {
            SetRecipeItem(response);
            //$location.path('/view/' + id)
            loaderService.hideLoader();
        });
    }

    $scope.handleFileSelect = function(element) {
        $scope.$apply(function() {
            $scope.recipe.ImageFile = element.files[0];
        });
    };

    $scope.goHome = function() {
        $location.path('/home');
    };

    // File input handler
    $scope.handleFileInput = function(files) {
        $scope.recipe.ImageFile = files[0];
    };

    getViewRecipe($routeParams.id)
});