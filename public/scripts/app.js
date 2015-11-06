"use strict";

angular
.module("segein", ["ngStorage","ngRoute","angular-loading-bar"])
.config([
  "$routeProvider",
  "$httpProvider",
  function ($routeProvider, $httpProvider) {
    $.i18n.init({
      saveMissing : true,
      debug       : true,
      resGetPath  : "locales/__lng__/__ns__.json"
    });
    $.i18n.setLng(config.LANGUAGE);

    $routeProvider
      .when("/",          { templateUrl: "views/app/home",          controller: "HomeCtrl" })
      .when("/signin",    { templateUrl: "views/app/signin",        controller: "HomeCtrl" })
      .when("/signup",    { templateUrl: "views/app/signup",        controller: "HomeCtrl" })
      .when("/me",        { templateUrl: "views/app/me",            controller: "HomeCtrl" })
      .when("/registry",  { templateUrl: "views/registry/registry", controller: "HomeCtrl" })
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