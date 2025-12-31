app.factory('profileService', function($http, $q) {
    var baseUrl = 'http://localhost:8080/api/Profile';
    var friendsbaseUrl = 'http://localhost:8080/api/Friends';

    //var baseUrl = 'http://thomashometech.local/api/homerecipes';
    var factory = {};

    factory.getProfile = function(username) {
        let deferred = $q.defer();
        $http.get(baseUrl + '/' + username)
        .then(function(response) {
            deferred.resolve(response.data);
        }, function(error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    factory.sendFriendRequest = function(friendRequest) {
        let deferred = $q.defer();
        $http.post(friendsbaseUrl + '/sendFriendRequest', friendRequest, {
        }).then(function(response) {
            deferred.resolve(response.data);
        }, function(error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    return factory;
});