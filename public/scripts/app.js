"use strict";

angular
.module("segeinRegistry", ["ngStorage","ngRoute","angular-loading-bar"])
.config([
  "$routeProvider",
  "$httpProvider",
  function ($routeProvider, $httpProvider) {
    $routeProvider
      .when("/",        { templateUrl: "views/body-home",    controller: "HomeCtrl" })
      .when("/signin",  { templateUrl: "views/body-signin",  controller: "HomeCtrl" })
      .when("/signup",  { templateUrl: "views/body-signup",  controller: "HomeCtrl" })
      .when("/me",      { templateUrl: "views/body-me",      controller: "HomeCtrl" })
      .otherwise({ redirectTo: "/" });

    $httpProvider
      .interceptors.push([
        "$q",
        "$location",
        "$localStorage",
        function($q, $location, $localStorage) {
          return {
            "request": function (config) {
              config.headers = config.headers || {};
              if($localStorage.token) { config.headers.authorization = "Owner "+$localStorage.token; }
              return config;
            },
            "responseError": function(res) {
              if(res.status === 401 || res.status === 403) { $location.path("/signin"); }
              return $q.reject(res);
            }
          };
        }
      ]);
  }
]);