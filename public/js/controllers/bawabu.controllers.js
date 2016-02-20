(function(){
    'use strict';

    angular.module('bawabu')
    .controller('HomeController', ['$scope', function($scope){
        var vm = this;
        vm.search = search;
        self.selectedItem = null;
        self.searchText = null;

        vm.users = [
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

        function search(query){
            var results = query ? vm.users.filter(createFilterFor(query)) : [];
            return results;
        }

        function createFilterFor(query){
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
