"use strict";

/* Controllers */
angular
.module("segein")
.controller(
  "HomeCtrl",
  ["$rootScope","$scope","$location","$localStorage","Main",
  function($rootScope, $scope, $location, $localStorage, Main) {
    $scope.signin = function() {
      var formData = {
        email     : $scope.email,
        password  : $scope.password
      }

      Main.signin(
        formData,
        function(res) {
          if (res.type == false) { alert(res.data); }
          else {
            $localStorage.token = res.data.token;
            window.location = "/";
          }
        },
        function() { $rootScope.error = $.i18n.t("err.signin"); }
      )
    };

    $scope.signup = function() {
      var formData = {
        email     : $scope.email,
        password  : $scope.password
      }
      Main.signup(
        formData,
        function(res) {
          if (res.type == false) { alert(res.data) }
          else {
            $localStorage.token = res.data.token;
            window.location = "/";
          }
        },
        function() { $rootScope.error = $.i18n.t("err.signup"); }
      )
    };

    $scope.me = function() {
      Main.me(function(res) { $scope.user = res; },
              function() { $rootScope.error = $.i18n.t("err.me"); }
      )
    };

    $scope.registry = function() {
      Main.registry(function(res) { $scope.user = res; },
              function() { $rootScope.error = $.i18n.t("err.registry"); }
      )
    };

    $scope.logout = function() {
      Main.logout(function() { window.location = "/"; },
                  function() { alert($.i18n.t("err.logout")); }
      );
    };

    $scope.token = $localStorage.token;
  }
])

.controller(
  "MeCtrl",
  ["$rootScope","$scope","$location","Main",
  function($rootScope, $scope, $location, Main) {
    Main.me(function(res) { $scope.user = res; },
            function() { $rootScope.error = $.i18n.t("err.me");; }
    );
  }
]);