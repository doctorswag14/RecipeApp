app.controller('editrecipeController', function($scope, $routeParams, $location, recipeService, notificationService, loaderService) {
    function SetRecipeItem(a) {
        $scope.recipe = a;
    }

    $scope.getEditRecipe = function(id){
        $location.path('/edit/' + id)
        loaderService.showLoader();
        recipeService.get(id).then(function(response) {
            SetRecipeItem(response);
            loaderService.hideLoader();
        });
    }

    $scope.$on('$routeChangeSuccess', function() {
        var path = $location.path();
        $scope.showBackButton = (path === '/add' || path === '/edit' || path === '/view');
    });

    $scope.handleFileSelect = function(element) {
        $scope.$apply(function() {
            $scope.recipe.ImageFile = element.files[0];
        });
    };

    $scope.goHome = function() {
        $location.path('/home');
    };

    $scope.updateRecipe = function() {
        var fd = new FormData();
        loaderService.showLoader();
        fd.append('Title', $scope.recipe.title);
        fd.append('Ingredients', $scope.recipe.ingredients);
        fd.append('Directions', $scope.recipe.directions);

        if ($scope.recipe.ImageFile) {
            fd.append('ImageFile', $scope.recipe.ImageFile);
        }

        recipeService.update($routeParams.id, fd).then(function() {
            $location.path('/view/' + $routeParams.id);
            loaderService.hideLoader();
            notificationService.success("Recipe was Update successully");
        })
        .catch((error) => {
            console.error(error);
            loaderService.hideLoader();
            notificationService.fail("Could not update Recipe please tell husband!!!!");
          });
    };
    // File input handler
    $scope.handleFileInput = function(files) {
        $scope.recipe.ImageFile = files[0];
    };
});