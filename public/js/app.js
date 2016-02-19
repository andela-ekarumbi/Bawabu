(function(){
    'use strict';

    angular.module('bawabu', [
        'ngMaterial',
        'ngRoute',
    ]);

    angular.config(function($routeProvider){
        $routeProvider.otherwise('/');
    });
})();
