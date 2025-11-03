app.service('authService', function($window) {
    this.login = function(token) {
        $window.localStorage.setItem('token', token);
    };

    this.setUser = function(data) {
        console.log(data);
        const userObj = {
            FullName: data.fullName,
            Username: data.username,
            ID: data.id
        };
        $window.localStorage.setItem('thomastechuser', JSON.stringify(userObj));
    };

    this.getUser = function() {
        const user = $window.localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    };

    this.logout = function() {
        $window.localStorage.removeItem('token');
        $window.localStorage.removeItem('user');
    };

    this.isAuthenticated = function() {
        return !!$window.localStorage.getItem('token');
    };
});