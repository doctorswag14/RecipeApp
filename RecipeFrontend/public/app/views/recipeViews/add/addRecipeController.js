app.controller('addrecipeController', function($scope, $routeParams, $location, recipeService, notificationService, loaderService) {
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

    $scope.$on('$routeChangeSuccess', function() {
        var path = $location.path();
        $scope.showBackButton = (path === '/add' || path === '/edit' || path === '/view');
    });

    $scope.goHome = function() {
        $location.path('/home');
    };

    $scope.addRecipe = function() {
        var fd = new FormData();
        loaderService.showLoader();
        fd.append('Title', $scope.recipe.Title);
        fd.append('Ingredients', $scope.recipe.Ingredients);
        fd.append('Directions', $scope.recipe.Directions);
        if ($scope.recipe.ImageFile) {
            fd.append('ImageFile', $scope.recipe.ImageFile);
        }
        recipeService.create(fd).then(function() {
            $location.path('/home');
            loaderService.hideLoader();
            notificationService.success("Recipe was Added successully");
        })
        .catch((error) => {
            console.error(error);
            loaderService.hideLoader();
            notificationService.fail("Could not add Recipe please tell husband!!!!");
          });
    };

    $scope.handleFileSelect = function(element) {
        $scope.$apply(function() {
            $scope.recipe.ImageFile = element.files[0];
        });
    };

    // File input handler
    $scope.handleFileInput = function(files) {
        $scope.recipe.ImageFile = files[0];
    };
});