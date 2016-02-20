(function(){
    'use strict';

    angular.module('bawabu')

    .controller('HomeController', ['$scope', 'UserService', 'AuthService',
     function($scope, UserService, AuthService){
        
        $scope.search = search;
        $scope.selectedItem = null;
        $scope.searchText = null;

        $scope.users = [
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

        var currentUser = AuthService.getCurrentUser();

        var search = function (query){
            var results = query ? $scope.users.filter(createFilterFor(query)) : $scope.users;
            return results;
        }

        var createFilterFor = function (query){
            var lowercaseQuery = query.toLowerCase();

            return function filterFn(user){
                return (user._lowername.indexOf(lowercaseQuery) >= 0);
            };
        }

        function activate(){
            $scope.users.map(function(user){
                user._lowername = user.name.toLowerCase();
                return user;
            });
        }

        activate();
    }])


    .controller('LoginController', ['AuthService', function(AuthService){
        var $scope = this;

        $scope.login = function(){
            AuthService.authenticate($scope.user);
        };
    }]);
})();
