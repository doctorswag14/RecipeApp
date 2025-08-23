// loaderService.js
app.service('loaderService', function ($rootScope) {
    $rootScope.isLoading = false;

    return {
        showLoader: function () {
            $rootScope.isLoading = true;
        },
        hideLoader: function () {
            $rootScope.isLoading = false;
        }
    };
});