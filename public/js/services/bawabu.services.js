(function(){
    'use strict';

    angular.module('bawabu')
    .factory('AuthService', [
            '$http', '$location', '$cookies', '$mdToast',
            function($http, $location, $cookies, $mdToast){
        var AuthService = {
            isAuthenticated: isAuthenticated,
            authenticate: authenticate,
            getAuthToken: getAuthToken,
            setAuthToken: setAuthToken
        };

        var API = "https://bawabu.herokuapp.com/api/v1/";

        function authenticate(user){
            console.log("Trying logging in with data: ", user);
            return $http.post(API + 'authenticate', {
                username: user.username,
                password: user.password
            })
            .then(function(success){
                AuthService.setAuthToken(success.data);
                console.log("Logged in: ", success);
                $location.path('/');
            }, function(error) {
                console.error("Error loggin in: ", error);
                $mdToast.showSimple("Error logging in.");
            });
        }

        function isAuthenticated(){
            return !!AuthService.getAuthToken();
        }

        function getAuthToken(){
            return $cookies.get('token');
        }

        function setAuthToken(token){
            $cookies.put('token', token);
        }

        return AuthService;
    }]);
})();
