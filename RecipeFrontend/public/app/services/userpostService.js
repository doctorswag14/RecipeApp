app.factory('userpostService', function($http, $q) {
    var baseUrl = 'http://localhost:8080/api/userposts';

    //var baseUrl = 'http://thomashometech.local/api/homerecipes';
    var factory = {}; // Create an object to hold the methods

    factory.AddUserPost = function(data) {
        let deferred = $q.defer();
        let formData = new FormData();
        formData.append("Post", data.Post);
        formData.append("Username", data.Username);
        $http.post(baseUrl + "/AddUserPost", formData, {
            headers: { 'Content-Type': undefined },
            transformRequest: angular.identity
        }).then(function(response) {
            deferred.resolve(response.data);
        }, function(error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    factory.AddUserPostComments = function(data) {
        let deferred = $q.defer();
        let formData = new FormData();
        formData.append("Content", data.Content);
        formData.append("Username", data.Username);
        formData.append("PostID", data.PostID);
        formData.append("PostType", data.PostType);
        formData.append("ParentCommentId", data.ParentCommentId);
        $http.post(baseUrl + "/AddUserPostComments", formData, {
            headers: { 'Content-Type': undefined },
            transformRequest: angular.identity
        }).then(function(response) {
            deferred.resolve(response.data);
        }, function(error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    return factory;
});