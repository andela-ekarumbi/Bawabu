(function(){
    'use strict';

    angular.module('bawabu', [
        'ngMaterial',
        'ngRoute',
    ])
    .config(function($routeProvider){
        $routeProvider.otherwise('/');
    });
})();
