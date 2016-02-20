(function(){
    'use strict';

    angular.module('bawabu', [
        'ngMaterial',
        'ngRoute',
        'ngCookies',
    ])
    .config(function ($httpProvider) {
      $httpProvider.defaults.headers.common = {};
      $httpProvider.defaults.headers.post = {};
      $httpProvider.defaults.headers.put = {};
      $httpProvider.defaults.headers.patch = {};
    })
    .config(function($locationProvider, $routeProvider){
        // Customise the url hash to look like a normal url, else prefix it with a #!
        $locationProvider.html5Mode(true).hashPrefix('!');

        // Configure project routes.
        $routeProvider.when('/', {
            templateUrl: 'partials/home.html',
            controller: 'HomeController',
            controllerAs: 'home',
            resolve: {
                auth: function($location, AuthService){
                    if(AuthService.isAuthenticated()){
                        return true;
                    }
                    $location.path('/login/').replace();
                    return false;
                }
            }
        })
        .when('/login/', {
            templateUrl: 'partials/login.html',
            controller: 'LoginController',
            controllerAs: 'login',
            resolve: {
                auth: function($location, AuthService){
                    if(AuthService.isAuthenticated()){
                        $location.path('/').replace();
                        return false;
                    }
                    return true;
                }
            }
        })
        .when('/test-route/', {
            template: '<h1>Some test route</h1>'
        })
        .otherwise('/');
    });
})();
