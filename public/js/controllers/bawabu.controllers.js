(function(){
    'use strict';

    angular.module('bawabu')
    .controller('HomeController', ['$scope', 'User' function($scope){
        var vm = this;
        vm.search = search;
        self.selectedItem = null;
        self.searchText = null;

        vm.users = 

        var search = function (query){
            var results = query ? vm.users.filter(createFilterFor(query)) : [];
            return results;
        }

        var createFilterFor = function (query){
            var lowercaseQuery = query.toLowerCase();

            return function filterFn(user){
                return user._lowername.indexOf(lowercaseQuery) === 0;
            };
        }

        function activate(){
            vm.users.map(function(user){
                user._lowername = user.name.toLowerCase();
                return user;
            });
        }

        activate();
        console.log(vm.users);
    }])


    .controller('LoginController', ['AuthService', function(AuthService){
        var self = this;

        self.login = function(){
            AuthService.authenticate(self.user);
        };
    }]);
})();
