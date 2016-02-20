(function(){
    'use strict';

    var bawabu = angular.module('bawabu');

    bawabu.factory('AuthService', [
            '$http', '$location', '$cookies', '$mdToast',
            function($http, $location, $cookies, $mdToast){

        var AuthService = {
            isAuthenticated: isAuthenticated,
            authenticate: authenticate,
            getAuthToken: getAuthToken,
            setAuthToken: setAuthToken,
            getCurrentUser: getCurrentUser,
            setCurrentUser: setCurrentUser
        };

        var API = "https://bawabu.herokuapp.com/api/v1/";

        function authenticate(user){
            console.log("Trying logging in with data: ", user);
            return $http.post(API + 'authenticate', {
                username: user.username,
                password: user.password
            })
            .then(function(success){
                AuthService.setAuthToken(success.token);
                AuthService.setCurrentUser(success.user);
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

        function setCurrentUser(user) {
            sessionStorage.currentUser = user;
        };

        function getCurrentUser() {
            return sessionStorage.currentUser;
        };

        return AuthService;
    }]);

    bawabu.factory('UserService', ['$http', function ($http) {

        // Get all users

        var getAllUsers = function () {
            return [
                {
                    id: 1,
                    name: 'JACK'
                },
                {
                    id: 2,
                    name: 'JAMES'
                },
                {
                    id: 3,
                    name: 'AUSTIN'
                },
                {
                    id: 4,
                    name: 'ESTON'
                }
            ];
        };

        var UserService = {

        };

        return UserService;
    }]);

})();
