'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$location', '$state', 'Authentication', 'Menus',
  function ($scope, $location, $state, Authentication, Menus) {

    var isMobile = {

      Android: function() {
        return navigator.userAgent.match(/Android/i);
      },
      BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
      },
      iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
      },
      Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
      },
      Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
      },
      any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
      }

    };


    if ( isMobile.Android() ) {
      document.location.href = "https://play.google.com/store/apps/details?id=coffeemate.chris.app.coffeemateclub";
    }
    else if(isMobile.iOS())
    {
      document.location.href = "https://itunes.apple.com/us/app/coffeemate.club/id1101814054?ls=1&mt=8";
    }
    else if(isMobile.BlackBerry())
    {
      document.location.href = "https://www.microsoft.com/en-gb/store/apps/coffeemate/9nblggh4m5b1";
    }else if(isMobile.Windows())
    {
      document.location.href = "https://www.microsoft.com/en-gb/store/apps/coffeemate/9nblggh4m5b1";
    }


    // Expose view variables
    $scope.$state = $state;
    $scope.authentication = Authentication;

    // Get the topbar menu
    $scope.menu = Menus.getMenu('topbar');

    // Toggle the menu items
    $scope.isCollapsed = false;
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };

    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });

    //be sure to inject $scope and $location
    $scope.changeLocation = function(url, forceReload) {
      $scope = $scope || angular.element(document).scope();
      if(forceReload || $scope.$$phase) {
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
  }
]);
