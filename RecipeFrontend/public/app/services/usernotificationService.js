app.factory('usernotificationService', function($http, $q) {
    var friendsbaseUrl = 'http://localhost:8080/api/Friends';

    var factory = {};

    factory.getFriendRequestCount = function(friendRequest) {
        let deferred = $q.defer();
        $http.post(friendsbaseUrl + '/friendRequests', friendRequest, {
        }).then(function(response) {
            deferred.resolve(response.data);
        }, function(error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    factory.updateFriendRequestCount = function(friendRequest) {
        let deferred = $q.defer();
        $http.post(friendsbaseUrl + '/updateNotificationCount', friendRequest, {
        }).then(function(response) {
            deferred.resolve(response.data);
        }, function(error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    factory.addFriend = function(friendRequest) {
        let deferred = $q.defer();
        $http.post(friendsbaseUrl + '/addFriend', friendRequest, {
        }).then(function(response) {
            deferred.resolve(response.data);
        }, function(error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    factory.rejectFriend = function(friendRequest) {
        let deferred = $q.defer();
        $http.post(friendsbaseUrl + '/rejectFriend', friendRequest, {
        }).then(function(response) {
            deferred.resolve(response.data);
        }, function(error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    return factory;
});