app.controller('RecipeController', function($scope, $routeParams, $location, RecipeService, notificationService, loaderService) {
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
        RecipeService.getAll().then(function(response) {
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

    $scope.getEditRecipe = function(id){
        $location.path('/edit/' + id)
        loaderService.showLoader();
        RecipeService.get(id).then(function(response) {
            SetRecipeItem(response);
            loaderService.hideLoader();
        });
    }

    $scope.goHome = function() {
        $location.path('/');
    };

    $scope.goToWeek = function() {
        $location.path('/week');
    };

    $scope.setRecipeForTheWeek = function(id){
        loaderService.showLoader();
        RecipeService.SetRecipeForWeek(id).then(function(response) {
            loaderService.hideLoader();
            notificationService.success("Recipe for the week added");
        })
        .catch((error) => {
            console.error(error);
            loaderService.hideLoader();
            notificationService.fail("Could not add Recipe please tell husband!!!!");
          });
    }

    $scope.removeRecipeForTheWeek = function(id){
        loaderService.showLoader();
        RecipeService.RemoveRecipeForWeek(id).then(function(response) {
        })
        .catch((error) => {
            console.error(error);
            loaderService.hideLoader();
            notificationService.fail("Could not add Recipe please tell husband!!!!");
          });
    }

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
        });
    }

    $scope.addRecipePage = function() {
        $location.path('/add');
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
        RecipeService.create(fd).then(function() {
            $location.path('/');
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

    $scope.updateRecipe = function() {
        var fd = new FormData();
        loaderService.showLoader();
        fd.append('Title', $scope.recipe.title);
        fd.append('Ingredients', $scope.recipe.ingredients);
        fd.append('Directions', $scope.recipe.directions);

        if ($scope.recipe.ImageFile) {
            fd.append('ImageFile', $scope.recipe.ImageFile);
        }

        RecipeService.update($routeParams.id, fd).then(function() {
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

    $scope.deleteRecipe = function(id) {
        loaderService.showLoader();
        RecipeService.delete(id).then(function() {
            location.reload();
            loaderService.hideLoader();
            notificationService.success("Recipe was deleted successully");
        })
        .catch((error) => {
            console.error(error);
            loaderService.hideLoader();
            notificationService.fail("Could not delete Recipe please tell husband!!!!");
          });
    };

    // File input handler
    $scope.handleFileInput = function(files) {
        $scope.recipe.ImageFile = files[0];
    };
});