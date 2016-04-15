'use strict';

angular.module('users').controller('ChangePasswordController', ['$location','$window', '$state', '$scope', '$http', 'Authentication',
  function ($location, $window, $state, $scope, $http, Authentication) {
    $scope.user = Authentication.user;
    $scope.authentication = Authentication;

    //be sure to inject $scope and $location
    $scope.changeLocation = function (url, forceReload) {
      $scope = $scope || angular.element(document).scope();
      if (forceReload || $scope.$$phase) {
        window.location = url;
      }
      else {
        //only use this if you want to replace the history stack
        //$location.path(url).replace();

        //this this if you want to change the URL and add it to the history stack
        $location.path(url);
        $scope.$apply();
      }
    };


    // Change user password
    $scope.changeUserPassword = function (isValid) {
      $scope.success = $scope.error = null;


      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'passwordForm');

        return false;
      }

      $http.post('/api/users/password', $scope.passwordDetails).success(function (response) {

        $scope.changeLocation('/settings/picture');
        // If successful show success message and clear form
        $scope.$broadcast('show-errors-reset', 'passwordForm');
        $scope.success = true;
        $scope.passwordDetails = null;
        // And redirect to the previous or home page

      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);
