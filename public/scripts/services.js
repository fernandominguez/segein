"use strict";

angular
.module("segein")
.factory(
  "Main",
  ["$http","$localStorage",
  function($http, $localStorage) {
    var baseUrl = "http://segein-fernandominguez.c9.io";

    function changeUser(user) {
      angular.extend(currentUser, user);
    }

    function urlBase64Decode(str) {
      var output = str.replace("-", "+").replace("_", "/");
      switch (output.length % 4) {
        case 0:   break;
        case 2:   output += "=="; break;
        case 3:   output += "=";  break;
        default:  throw $.i18n.t("urlbase64decode");
      }
      return window.atob(output);
    }

    function getUserFromToken() {
      var token = $localStorage.token;
      var user = {};
      if (typeof token !== "undefined") {
        var encoded = token.split(".")[1];
        user = JSON.parse(urlBase64Decode(encoded));
      }
      return user;
    }

    var currentUser = getUserFromToken();

    return {
      signup: function(data, success, error) {
        $http.post(baseUrl+"/signup", data).success(success).error(error);
      },
      signin: function(data, success, error) {
        $http.post(baseUrl+"/signin", data).success(success).error(error);
      },
      me: function(success, error) {
        $http.get(baseUrl+"/me").success(success).error(error);
      },
      registry: function(success, error) {
        $http.get(baseUrl+"/registry").success(success).error(error);
      },
      logout: function(success) {
        changeUser({});
        delete $localStorage.token;
        success();
      }
    };
  }
]);