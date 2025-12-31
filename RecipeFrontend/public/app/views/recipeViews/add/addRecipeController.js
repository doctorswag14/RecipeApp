app.controller('addRecipeController', function($scope, $routeParams, $location, recipeService, notificationService, loaderService, authService, $window) {

    function checkAuth() {
        const token = $window.localStorage.getItem('token');

        if (!token || authService.isTokenExpired(token)) {
            authService.logout();
            return false;
        } else {
            authService.scheduleTokenRefresh();
            return true;
        }
    }

    if (!checkAuth()) return;

    if ($routeParams.id) {
        loaderService.showLoader();
        recipeService.get($routeParams.id)
            .then(function(response) {
                $scope.recipe = response;
            })
            .catch((error) => {
                console.error(error);
                notificationService.fail("Could not get Recipe — please tell husband!");
            })
            .finally(() => {
                loaderService.hideLoader();
            });
    } else {
        $scope.recipe = {}; // Initialize for new recipe
    }

    $scope.$on('$routeChangeSuccess', function() {
        var path = $location.path();
        $scope.showBackButton = (path === '/add' || path === '/edit' || path === '/view');
    });

    $scope.goHome = function() {
        $location.path('/home');
    };

    $scope.addRecipe = function() {
        if (!checkAuth()) return;

        var fd = new FormData();
        loaderService.showLoader();

        fd.append('Title', $scope.recipe.Title);
        fd.append('Ingredients', $scope.recipe.Ingredients);
        fd.append('Directions', $scope.recipe.Directions);
        if ($scope.recipe.ImageFile) {
            fd.append('ImageFile', $scope.recipe.ImageFile);
        }

        recipeService.create(fd)
            .then(function() {
                notificationService.success("Recipe added successfully!");
                $location.path('/home');
            })
            .catch((error) => {
                console.error(error);
                notificationService.fail("Could not add recipe — please tell husband!");
            })
            .finally(() => {
                loaderService.hideLoader();
            });
    };

    $scope.handleFileSelect = function(element) {
        $scope.$apply(function() {
            $scope.recipe.ImageFile = element.files[0];
        });
    };

    $scope.handleFileInput = function(files) {
        $scope.recipe.ImageFile = files[0];
    };
});