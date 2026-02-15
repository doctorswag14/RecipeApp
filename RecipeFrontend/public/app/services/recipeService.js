app.factory('recipeService', function($http, $q) {
    var baseUrl = 'http://localhost:8080/api/homerecipes';

    //var baseUrl = 'http://thomashometech.local/api/homerecipes';
    var factory = {}; // Create an object to hold the methods

    factory.getPage = function(page, pageSize, user) {
        let deferred = $q.defer();
        $http.get(baseUrl + "?page=" + page + "&pageSize=" + pageSize + "&userName=" + user.Username).then(function(response) {
            deferred.resolve(response.data);
        }, function(error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    factory.getRecipeForTheWeek = function() {
        let deferred = $q.defer();
        $http.get(baseUrl + "/ForTheWeek").then(function(response) {
            deferred.resolve(response.data);
        }, function(error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    factory.get = function(id) {
        let deferred = $q.defer();
        $http.get(baseUrl + '/' + id).then(function(response) {
            deferred.resolve(response.data);
        }, function(error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    factory.create = function(recipe) {
        let deferred = $q.defer();
        $http.post(baseUrl, recipe, {
            headers: { 'Content-Type': undefined },
            transformRequest: angular.identity
        }).then(function(response) {
            deferred.resolve(response.data);
        }, function(error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    factory.AddUserPost = function(userPost) {
        let deferred = $q.defer();
        $http.post(baseUrl + "/UserPost", userPost, {
            headers: { 'Content-Type': undefined },
            transformRequest: angular.identity
        }).then(function(response) {
            deferred.resolve(response.data);
        }, function(error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    factory.update = function(id, recipe) {
        let deferred = $q.defer();
        $http.put(baseUrl + '/' + id, recipe, {
            headers: { 'Content-Type': undefined },
            transformRequest: angular.identity
        }).then(function(response) {
            deferred.resolve(response.data);
        }, function(error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    factory.SetRecipeForWeek = function(id) {
        let deferred = $q.defer();
        $http.put(baseUrl + '/' + "AddRecipeForWeek/" + id, {
            headers: { 'Content-Type': undefined },
            transformRequest: angular.identity
        }).then(function(response) {
            deferred.resolve(response.data);
        }, function(error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    factory.RemoveRecipeForWeek = function(id) {
        let deferred = $q.defer();
        $http.put(baseUrl + '/' + "RemoveRecipeForWeek/" + id, {
            headers: { 'Content-Type': undefined },
            transformRequest: angular.identity
        }).then(function(response) {
            deferred.resolve(response.data);
        }, function(error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    factory.delete = function(id) {
        let deferred = $q.defer();
        $http.delete(baseUrl + '/' + id).then(function(response) {
            deferred.resolve(response.data);
        }, function(error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    return factory; // Return the factory object with all methods
});