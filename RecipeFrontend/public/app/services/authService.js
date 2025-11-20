app.service('authService', function($window, $timeout, $http, $location) {
    const ACCESS_TOKEN_KEY = 'token';
    const REFRESH_TOKEN_KEY = 'refreshToken';
    const USER_KEY = 'thomastechuser';
    let refreshTimer = null;    
    var url = "http://localhost:8080/";
    
    // --- TOKEN HELPERS ---
    function decodeToken(token) {
        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch (e) {
            return null;
        }
    }

    function isTokenExpired(token) {
        if (!token) return true;
        const payload = decodeToken(token);
        if (!payload || !payload.exp) return true;
        return Date.now() >= payload.exp * 1000;
    }

    function getTokenTimeLeft(token) {
        const payload = decodeToken(token);
        if (!payload || !payload.exp) return 0;
        return payload.exp * 1000 - Date.now();
    }

    // --- TOKEN REFRESH LOGIC ---
    function scheduleTokenRefresh() {
        const token = $window.localStorage.getItem(ACCESS_TOKEN_KEY);
        if (!token || isTokenExpired(token)) {
            console.log("Token missing or expired → logging out");
            service.logout();
            return;
        }

        const timeLeft = getTokenTimeLeft(token);
        const refreshTime = (24 * 60 * 60 * 1000) - (60 * 1000);

        if (refreshTimer) $timeout.cancel(refreshTimer);

        refreshTimer = $timeout(() => {
            refreshAccessToken();
        }, refreshTime);
    }

    function refreshAccessToken() {
        const refreshToken = $window.localStorage.getItem(REFRESH_TOKEN_KEY);
        if (!refreshToken) {
            service.logout();
            return;
        }

        var data = { RefreshToken: refreshToken };
        $http.post(url + 'api/auth/refresh', data)
            .then(res => {
                const { accessToken, refreshToken: newRefreshToken } = res.data;
                if (!accessToken) throw new Error("Invalid refresh response");

                $window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
                if (newRefreshToken) {
                    $window.localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
                }

                scheduleTokenRefresh(); // reschedule next refresh
            })
            .catch(() => {
                service.logout();
            });
    }

    // --- MAIN SERVICE OBJECT ---
    const service = this;

    service.isTokenExpired = isTokenExpired;
    service.scheduleTokenRefresh = scheduleTokenRefresh;

    service.login = function(token, refreshToken) {
        $window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
        if (refreshToken) {
            $window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        }
        scheduleTokenRefresh(); // Start auto-refresh timer after login
    };

    service.setUser = function(data) {
        const userObj = {
            FullName: data.fullName,
            Username: data.username,
            ID: data.id
        };
        $window.localStorage.setItem(USER_KEY, JSON.stringify(userObj));
    };

    service.getUser = function() {
        const user = $window.localStorage.getItem(USER_KEY);
        return user ? JSON.parse(user) : null;
    };

    service.logout = function() {
        if (refreshTimer) $timeout.cancel(refreshTimer);
        $window.localStorage.removeItem(ACCESS_TOKEN_KEY);
        $window.localStorage.removeItem(REFRESH_TOKEN_KEY);
        $window.localStorage.removeItem(USER_KEY);
        $location.path('/');
    };

    service.isAuthenticated = function() {
        const token = $window.localStorage.getItem(ACCESS_TOKEN_KEY);
        return !!token && !isTokenExpired(token);
    };
});