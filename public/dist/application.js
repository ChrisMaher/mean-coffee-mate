'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function () {
  // Init module configuration options
  var applicationModuleName = 'mean';
  var applicationModuleVendorDependencies = ['ngResource', 'ngAnimate', 'ngMessages', 'ui.router', 'ui.bootstrap', 'ui.utils', 'angularFileUpload', 'angularUtils.directives.dirPagination', 'textAngular','colorpicker.module', 'wysiwyg.module','ngMaterial', 'angularMoment','angulike'];

  // Add a new vertical module
  var registerModule = function (moduleName, dependencies) {
    // Create angular module
    angular.module(moduleName, dependencies || []);

    // Add the module to the AngularJS configuration file
    angular.module(applicationModuleName).requires.push(moduleName);
  };

  return {
    applicationModuleName: applicationModuleName,
    applicationModuleVendorDependencies: applicationModuleVendorDependencies,
    registerModule: registerModule
  };
})();

'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider', '$httpProvider',
  function ($locationProvider, $httpProvider) {
    $locationProvider.html5Mode(true).hashPrefix('!');

    $httpProvider.interceptors.push('authInterceptor');
  }
]);

angular.module(ApplicationConfiguration.applicationModuleName).run(["$rootScope", "$state", "Authentication", function ($rootScope, $state, Authentication) {

  // Check authentication before changing state
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    if (toState.data && toState.data.roles && toState.data.roles.length > 0) {
      var allowed = false;
      toState.data.roles.forEach(function (role) {
        if (Authentication.user.roles !== undefined && Authentication.user.roles.indexOf(role) !== -1) {
          allowed = true;
          return true;
        }
      });

      if (!allowed) {
        event.preventDefault();
        if (Authentication.user !== undefined && typeof Authentication.user === 'object') {
          $state.go('forbidden');
        } else {
          $state.go('authentication.signin');
        }
      }
    }
  });

  // Record previous state
  $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
    if (!fromState.data || !fromState.data.ignoreState) {
      $state.previous = {
        state: fromState,
        params: fromParams,
        href: $state.href(fromState, fromParams)
      };
    }
  });
}]);

//Then define the init function for starting up the application
angular.element(document).ready(function () {
  //Fixing facebook bug with redirect
  if (window.location.hash && window.location.hash === '#_=_') {
    if (window.history && history.pushState) {
      window.history.pushState('', document.title, window.location.pathname);
    } else {
      // Prevent scrolling by storing the page's current scroll offset
      var scroll = {
        top: document.body.scrollTop,
        left: document.body.scrollLeft
      };
      window.location.hash = '';
      // Restore the scroll offset, should be flicker free
      document.body.scrollTop = scroll.top;
      document.body.scrollLeft = scroll.left;
    }
  }

  //Then init the app
  angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('coffees');

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
ApplicationConfiguration.registerModule('core.admin', ['core']);
ApplicationConfiguration.registerModule('core.admin.routes', ['ui.router']);

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('posts');

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users', ['core']);
ApplicationConfiguration.registerModule('users.admin', ['core.admin']);
ApplicationConfiguration.registerModule('users.admin.routes', ['core.admin.routes']);

'use strict';

// Configuring the Coffees module
angular.module('coffees').run(['Menus',
  function (Menus) {
    // Add the coffees dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Coffees',
      state: 'coffees',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'coffees', {
      title: 'List Coffees',
      state: 'coffees.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'coffees', {
      title: 'Create Coffees',
      state: 'coffees.create',
      roles: ['user']
    });
  }
]);

'use strict';

// Setting up route
angular.module('coffees').config(['$stateProvider',
  function ($stateProvider) {
    // Coffees state routing
    $stateProvider
      .state('coffees', {
        abstract: true,
        url: '/coffees',
        template: '<ui-view/>'
      })
      // .state('coffees.list', {
      //   url: '',
      //   templateUrl: 'modules/coffees/client/views/list-coffees.client.view.html'
      // })
      .state('coffees.create', {
        url: '/create',
        templateUrl: 'modules/coffees/client/views/create-coffee.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('coffees.view', {
        url: '/:coffeeId',
        templateUrl: 'modules/coffees/client/views/view-coffee.client.view.html'
      })
      .state('coffees.edit', {
        url: '/:coffeeId/edit',
        templateUrl: 'modules/coffees/client/views/edit-coffee.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);

'use strict';

// Coffees controller
angular.module('coffees').controller('CoffeesController', ['$scope', '$http', '$timeout', '$stateParams', '$location', '$window', '$state', 'Authentication', 'Coffees', 'FileUploader', 'Posts', 'Users',
    function ($scope, $http, $timeout, $stateParams, $location, $window, $state, Authentication, Coffees, FileUploader, Posts, Users) {

        $scope.authentication = Authentication;
        $scope.user = Authentication.user;
        //$scope.orderByField = 'votesreal';
        $scope.coffeeImageURL = '/modules/users/client/img/profile/saveme-placeholder.png';
        // $scope.user.imageURL  = '/modules/users/client/img/profile/saveme-placeholder.png';
        $scope.imageURL1 = '';
        $scope.hottestsorted = true;
        $scope.newestsorted = true;
        $scope.weekly = false;
        $scope.monthly = true;
        $scope.disablelist = true;
        $scope.usernamevalue = $stateParams.userId;
        $scope.currency = "Euro (€)";
        $scope.filterUserId = '';
        $scope.brandLogo = '/modules/users/client/img/profile/argos-logo.png';
        $scope.isDisabledUp = false;
        $scope.isDisabledDown = false;
        $scope.yesterdaysDate = new Date();
        $scope.yesterdaysDate.setDate($scope.yesterdaysDate.getDate() - 1);
        $scope.yesterdaysDate = $scope.yesterdaysDate.getMonth() + 1 + '/' + $scope.yesterdaysDate.getDate() + '/' + $scope.yesterdaysDate.getFullYear() + "";
        // alert($scope.yesterdaysDate);

        $scope.coffeeUrl1 = function (coffee) {

            $scope.coffeeLink = 'http://coffeemate.club';
            console.log(coffee);
            return $scope.coffeeLink;

        };
        
        $scope.countryOfOrigin = function(country){
            
         var countryLink = "http://www.google.ie/search?q=" + country;

            return countryLink;

        };

        

        Coffees.query({}, function (resp) {
            //console.log(resp);
            $scope.coffees = resp;
        });

        //$scope.user.imageURL = '';
        $scope.submitFormCoffee = function (isValid) {
            $scope.submitted = true;
        };

        $scope.hottest = function () {

            //alert(123);

            if ($scope.hottestsorted === false) {
                $scope.hottestsorted = true;
            } else {
                $scope.hottestsorted = false;
            }

        };

        $scope.setSort = function (sort) {

            //alert(sort);

            $scope.orderByField = sort;

        };

        $scope.timeFrame = function (classNum) {

            if (classNum === 1) {
                $scope.weekly = true;
                $scope.monthly = false;
            } else if (classNum === 2) {
                $scope.weekly = false;
                $scope.monthly = true;
            }

        };

        $scope.toggleTop = function () {

            //alert("Top");

            if ($scope.top6 === false) {
                $scope.top6 = true;
            } else {
                $scope.top6 = false;
            }

        };

        $scope.setUserImage = function () {

            $scope.user.imageURL = '/modules/users/client/img/profile/saveme-placeholder.png';


        };

        // Create file uploader instance
        $scope.uploaderProductCoffee = new FileUploader({
            url: 'api/coffees/picture'
        });

        // Set file uploader image filter
        $scope.uploaderProductCoffee.filters.push({
            name: 'imageFilter',
            fn: function (item, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });

        // Change product profile picture
        $scope.uploadProductPictureCoffee = function () {

            // Clear messages
            $scope.success = $scope.error = null;

            // Start upload
            $scope.uploaderProductCoffee.uploadAll();


        };

        $scope.$watch('urlimage', function (newVal, oldVal) {

            if (newVal !== undefined) {
                $scope.coffeeImageURL = newVal;

            } else {

                $scope.coffeeImageURL = '/modules/users/client/img/profile/saveme-placeholder.png';
            }

        });

        $scope.$watch('pricesterling', function (newVal, oldVal) {

            if (newVal !== undefined) {
                $scope.price = (newVal / 70) * 100;

            }

        });


        // Called after the user selected a new picture file
        $scope.uploaderProductCoffee.onAfterAddingFile = function (fileItem) {

            if ($window.FileReader) {

                var fileReader = new FileReader();
                fileReader.readAsDataURL(fileItem._file);
                fileReader.onload = function (fileReaderEvent) {
                    $timeout(function () {

                        $scope.coffeeImageURL = fileReaderEvent.target.result;

                    }, 0);
                };
            }

        };

        // Called after the user has successfully uploaded a new picture
        $scope.uploaderProductCoffee.onSuccessItem = function (fileItem, response, status, headers) {

            // Show success message
            $scope.success = true;

            // Populate user object
            $scope.user = Authentication.user = response;

            //// Clear upload buttons
            $scope.cancelProductUploadCoffee();

        };

        // Called after the user has failed to uploaded a new picture
        $scope.uploaderProductCoffee.onErrorItem = function (fileItem, response, status, headers) {

            //alert("Failed." + $scope.user.imageURL);

            // Clear upload buttons
            $scope.cancelProductUploadCoffee();

            // Show error message
            $scope.error = response.message;
        };

        // Cancel the upload process
        $scope.cancelProductUploadCoffee = function () {

            $scope.uploaderProductCoffee.clearQueue();
            $scope.coffeeImageURL = $scope.user.imageURL;

        };

        // Create new Coffee
        $scope.create = function () {
            $scope.error = null;

            var image = '/modules/users/client/img/profile/saveme-placeholder.png';
            if ($scope.user.imageURL === '/modules/users/client/img/profile/saveme-placeholder.png') {
                //alert("equal")
                image = $scope.coffeeImageURL;
            } else {
                //alert("not equal")
                image = $scope.user.imageURL;
                //alert("image " + image)
            }


            if (this.currency === 'Sterling (£)') {

                this.price = Math.round(((this.price / 70) * 100) * 100) / 100;
                this.currency = 'Euro (€)';

            }

            var priceRounded = Math.round(this.price * 100) / 100;

            // Create new Coffee object
            var coffee = new Coffees({

                title: this.title,
                brand: this.brand,
                marketingtext: this.marketingtext,
                price: priceRounded,
                retailer: this.retailer,
                brandlogo: image,
                urlimage: image,
                country: this.country,
                roast: this.roast,
                aroma: this.aroma,
                body: this.body,
                flavour: this.flavour,
                upVoters: $scope.user.email,
                userIdString : $scope.user._id


            });

            // Redirect after save
            coffee.$save(function (response) {

                //alert("1 " + $scope.user.imageURL);
                $scope.user.imageURL = '/modules/users/client/img/profile/saveme-placeholder.png';
                //alert("2 " + $scope.user.imageURL);
                $location.path('coffees/' + response._id);

                // Clear form fields

                $scope.title = '';
                $scope.brand = '';
                $scope.marketingtext = '';
                $scope.price = '';
                $scope.retailer = '';
                $scope.brandlogo = '';
                $scope.urlimage = '';
                $scope.country = '';
                $scope.roast = '';
                $scope.aroma = '';
                $scope.body = '';
                $scope.flavour = '';


            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Coffee
        $scope.removeCoffee = function (coffee) {

            var result = confirm("Are you sure you want to delete?");
            if (result) {

                // Delete the item

                if (coffee) {
                    coffee.$remove();

                    for (var i in $scope.coffees) {
                        if ($scope.coffees[i] === coffee) {
                            $scope.coffees.splice(i, 1);
                        }
                    }
                } else {
                    $scope.coffee.$remove(function () {
                        $location.path('/');
                    });
                }
            }

        };

        // Update existing Coffee
        $scope.updateCoffee = function () {

            var coffee = $scope.coffee;

            //alert($scope.coffee.currency);

            //if($scope.coffee.currency === 'Sterling (£)'){
            //
            //    $scope.coffee.price = Math.round((($scope.coffee.price/70)*100) * 100) / 100 ;
            //    $scope.coffee.currency = 'Euro (&euro;)';
            //    alert($scope.coffee.currency);
            //
            //}

            if ($scope.coffee.currency === 'Sterling (£)') {

                $scope.coffee.price = Math.round((($scope.coffee.price / 70) * 100) * 100) / 100;
                $scope.coffee.currency = 'Euro (€)';


            }


            //alert($scope.coffee.currency);

            coffee.$update(function () {
                $location.path('coffees/' + coffee._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });

        };

        // Find a list of Coffees
        $scope.find = function () {
            $scope.coffees = Coffees.query();
        };

        // Find existing Coffee
        $scope.findOne = function () {
            $scope.coffee = Coffees.get({
                coffeeId: $stateParams.coffeeId
            });
        };

        // Upvote if user hasnt upvoted already

        $scope.upVoteHome = function (coffee) {


            // Check if they have voted with filter
            var hasVoted = coffee.upVoters.filter(function (voter) {

                    return voter === $scope.user.email;

                }).length > 0;

            // If a downvote exists remove it , else do nothing

            if (!hasVoted) {

                coffee.votes++;
                coffee.votesreal++;
                coffee.upVoters.push($scope.user.email);

            }

            // Check if there is a downVote to remove


            var hasVoted3 = coffee.downVoters.filter(function (voter) {

                    return voter === $scope.user.email;

                }).length > 0;

            if (hasVoted3) {

                for (var i = coffee.downVoters.length - 1; i >= 0; i--) {

                    if (coffee.downVoters[i] === $scope.user.email) {
                        coffee.downVoters.splice(i, 1);
                    }
                }
            }


            coffee.$update(function () {
                //$location.path('coffees/' + coffee._id);
            }, function (errorResponse) {
                // rollback votes on fail also
                $scope.error = errorResponse.data.message;
            });

        };

        $scope.downVoteHome = function (coffee) {

            var hasVoted = coffee.downVoters.filter(function (voter) {

                    return voter === $scope.user.email;

                }).length > 0;

            // If a upvote exists remove it , else do nothing

            if (!hasVoted) {

                coffee.votes--;
                coffee.votesreal--;
                coffee.downVoters.push($scope.user.email);


            }

            // Check if there is a upVote to remove


            var hasVoted2 = coffee.upVoters.filter(function (voter) {

                    return voter === $scope.user.email;

                }).length > 0;

            if (hasVoted2) {


                for (var i = coffee.upVoters.length - 1; i >= 0; i--) {

                    if (coffee.upVoters[i] === $scope.user.email) {
                        coffee.upVoters.splice(i, 1);
                    }
                }
            }


            coffee.$update(function () {
                //$location.path('coffees/' + coffee._id);

            }, function (errorResponse) {
                // rollback votes on fail also
                $scope.error = errorResponse.data.message;
            });

        };

        $scope.disableButtonUp = function (coffee) {

            if(coffee !== undefined){

                var hasVotedUp = coffee.upVoters.filter(function (voter) {

                        return voter === $scope.user.email;

                    }).length > 0;

                if (hasVotedUp) {
                    return true;

                } else {
                    return false;
                }

            }



        };

        $scope.disableButtonDown = function (coffee) {

            if(coffee !== undefined){

                var hasVotedUp = coffee.downVoters.filter(function (voter) {

                        return voter === $scope.user.email;

                    }).length > 0;

                if (hasVotedUp) {
                    return true;

                } else {
                    return false;
                }

            }



        };


    }
]);

angular.module('coffees').filter('lessThan', function () {
    return function (items, requirement) {
        var filterKey = Object.keys(requirement)[0];
        var filterVal = requirement[filterKey];

        var filtered = [];

        if (filterVal !== undefined && filterVal !== '') {
            angular.forEach(items, function (item) {
                var today = new Date();
                var date = new Date(item.created);
                var diff = today - date;
                diff = diff / (1000 * 60 * 60);

                if (diff < filterVal) {
                    filtered.push(item);
                }
            });
            return filtered;
        }

        return items;
    };
});

'use strict';

//Coffees service used for communicating with the coffees REST endpoints
angular.module('coffees').factory('Coffees', ['$resource',
  function ($resource) {
    return $resource('api/coffees/:coffeeId', {
      coffeeId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      countCoffees: {
        method: 'GET',
        url: '/coffees/coffeeCount',
        isArray: false
      },
      countCoffeesToday: {
        method: 'GET',
        url: '/coffees/coffeeCountToday',
        isArray: false
      },
      listOf: {
        method: 'GET',
        url: '/api/coffees/of/:userid',
        isArray: true
      },
      usersCoffeesPostedTotal: {
        method: 'GET',
        url: '/coffees/usersCoffeesPostedTotal/:userIdString',
        isArray: true
      },
      removeVotesDaily: {
        method: 'GET',
        url: '/coffees/removeVotesDaily',
        isArray: true
      }
    });
  }
]);

'use strict';

angular.module('core.admin').run(['Menus',
  function (Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Admin',
      state: 'admin',
      type: 'dropdown',
      roles: ['admin']
    });
  }
]);

'use strict';

// Setting up route
angular.module('core.admin.routes').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('admin', {
        abstract: true,
        url: '/admin',
        template: '<ui-view/>',
        data: {
          roles: ['admin']
        }
      });
  }
]);

'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {

    // Redirect to 404 when route not found
    $urlRouterProvider.otherwise(function ($injector, $location) {
      $injector.get('$state').transitionTo('not-found', null, {
        location: false
      });
    });

    // Home state routing
    $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'modules/core/client/views/home.client.view.html'
    })
    .state('not-found', {
      url: '/not-found',
      templateUrl: 'modules/core/client/views/404.client.view.html',
      data: {
        ignoreState: true
      }
    })
    .state('bad-request', {
      url: '/bad-request',
      templateUrl: 'modules/core/client/views/400.client.view.html',
      data: {
        ignoreState: true
      }
    })
    .state('forbidden', {
      url: '/forbidden',
      // templateUrl: 'modules/core/client/views/403.client.view.html',
      templateUrl: 'modules/core/client/views/authentication/signin.client.view.html',
      data: {
        ignoreState: true
      }
    });
  }
]);

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

'use strict';


angular.module('core').controller('HomeController', ['$scope', '$location', 'Authentication', 'Coffees', 'Users', 'Posts',
    function ($scope, $location, Authentication, Coffees, Users, Posts) {


        // This provides Authentication context.
        $scope.authentication = Authentication;
        $scope.user = Authentication.user;

        $scope.orderByField = 'votesreal';
        $scope.orderByFieldCoupon = 'votes';

        $scope.numOfCoffees = Coffees.countCoffees();
        $scope.numOfCoffeesToday = Coffees.countCoffeesToday();

        $scope.numOfUsers = Users.countUsers();
        $scope.numOfUsersToday = Users.countUsersToday();

        $scope.numOfPosts = Posts.countPosts();
        $scope.numOfPostsToday = Posts.countPostsToday();

        $scope.selectedLogo = 'All';
        $scope.activeClass = 2;

        $scope.hottestsorted = true;
        $scope.newestsorted = false;

        $scope.hottestsortedCoupon = true;
        $scope.newestsortedCoupon = false;






        $scope.top6 = true;

        $scope.brandLogo = '/modules/users/client/img/profile/all-logo.png';

        $scope.setUserImage = function () {
            $scope.user.imageURL = '/modules/users/client/img/profile/saveme-placeholder.png';
        };

        $scope.toggleClass = function (classNum) {

            if(classNum === 1){
                $scope.hottestsorted = true;
                $scope.newestsorted = false;
                $scope.orderByField = 'votesreal';
            }else if(classNum === 2){
                $scope.hottestsorted = false;
                $scope.newestsorted = true;
                $scope.orderByField = 'created';
            }

        };

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

        $scope.toggleClassCoupon = function (classNum) {


            if(classNum === 1){
                $scope.hottestsortedCoupon = true;
                $scope.newestsortedCoupon = false;
                $scope.orderByFieldCoupon = 'votes';

            }else if(classNum === 2){
                $scope.hottestsortedCoupon = false;
                $scope.newestsortedCoupon = true;
                $scope.orderByFieldCoupon = 'created';

            }

        };

        $scope.toggleTop = function () {

            if($scope.top6 === false){
                $scope.top6 = true;
            }else{
                $scope.top6 = false;
            }

        };

        $scope.setFilterText = function (name) {

            $scope.selectedLogo = name;

        };

        $scope.setLogo = function (name) {

            if(name === 'All'){
                $scope.brandLogo = name;
            }else if(name === 'Littlewoods'){
                $scope.brandLogo = '/modules/users/client/img/profile/littlewoods-logo.png';
            }else if(name === 'Argos'){
                $scope.brandLogo = '/modules/users/client/img/profile/argos-logo.png';
            }else if(name === 'Screwfix'){
                $scope.brandLogo = '/modules/users/client/img/profile/screwfix-logo.png';
            }else if(name === 'Amazon'){
                $scope.brandLogo = '/modules/users/client/img/profile/amazon-logo.png';
            }else if(name === 'Penneys'){
                $scope.brandLogo = '/modules/users/client/img/profile/penneys-logo.png';
            }else if(name === 'Tesco'){
                $scope.brandLogo = '/modules/users/client/img/profile/tesco-logo.png';
            }else if(name === 'Lidl'){
                $scope.brandLogo = '/modules/users/client/img/profile/lidl-logo.png';
            }else if(name === 'Aldi'){
                $scope.brandLogo = '/modules/users/client/img/profile/aldi-logo.png';
            }else {
                $scope.brandLogo = '/modules/users/client/img/profile/all-logo.png';
            }



        };

        $scope.openModal = function (name) {



        };


    }
]);


/**
 * Created by Chris on 10/04/2016.
 */

"use strict";

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

'use strict';

/**
 * Edits by Ryan Hutchison
 * Credit: https://github.com/paulyoder/angular-bootstrap-show-errors */

angular.module('core')
  .directive('showErrors', ['$timeout', '$interpolate', function ($timeout, $interpolate) {
    var linkFn = function (scope, el, attrs, formCtrl) {
      var inputEl, inputName, inputNgEl, options, showSuccess, toggleClasses,
        initCheck = false,
        showValidationMessages = false,
        blurred = false;

      options = scope.$eval(attrs.showErrors) || {};
      showSuccess = options.showSuccess || false;
      inputEl = el[0].querySelector('.form-control[name]') || el[0].querySelector('[name]');
      inputNgEl = angular.element(inputEl);
      inputName = $interpolate(inputNgEl.attr('name') || '')(scope);

      if (!inputName) {
        throw 'show-errors element has no child input elements with a \'name\' attribute class';
      }

      var reset = function () {
        return $timeout(function () {
          el.removeClass('has-error');
          el.removeClass('has-success');
          showValidationMessages = false;
        }, 0, false);
      };

      scope.$watch(function () {
        return formCtrl[inputName] && formCtrl[inputName].$invalid;
      }, function (invalid) {
        return toggleClasses(invalid);
      });

      scope.$on('show-errors-check-validity', function (event, name) {
        if (angular.isUndefined(name) || formCtrl.$name === name) {
          initCheck = true;
          showValidationMessages = true;

          return toggleClasses(formCtrl[inputName].$invalid);
        }
      });

      scope.$on('show-errors-reset', function (event, name) {
        if (angular.isUndefined(name) || formCtrl.$name === name) {
          return reset();
        }
      });

      toggleClasses = function (invalid) {
        el.toggleClass('has-error', showValidationMessages && invalid);
        if (showSuccess) {
          return el.toggleClass('has-success', showValidationMessages && !invalid);
        }
      };
    };

    return {
      restrict: 'A',
      require: '^form',
      compile: function (elem, attrs) {
        if (attrs.showErrors.indexOf('skipFormGroupCheck') === -1) {
          if (!(elem.hasClass('form-group') || elem.hasClass('input-group'))) {
            throw 'show-errors element does not have the \'form-group\' or \'input-group\' class';
          }
        }
        return linkFn;
      }
    };
}]);

'use strict';

angular.module('core').factory('authInterceptor', ['$q', '$injector',
  function ($q, $injector) {
    return {
      responseError: function(rejection) {
        if (!rejection.config.ignoreAuthModule) {
          switch (rejection.status) {
            case 401:
              $injector.get('$state').transitionTo('authentication.signin');
              break;
            case 403:
              $injector.get('$state').transitionTo('forbidden');
              break;
          }
        }
        // otherwise, default behaviour
        return $q.reject(rejection);
      }
    };
  }
]);

'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [
  function () {
    // Define a set of default roles
    this.defaultRoles = ['user', 'admin'];

    // Define the menus object
    this.menus = {};

    // A private function for rendering decision
    var shouldRender = function (user) {
      if (!!~this.roles.indexOf('*')) {
        return true;
      } else {
        if(!user) {
          return false;
        }
        for (var userRoleIndex in user.roles) {
          for (var roleIndex in this.roles) {
            if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
              return true;
            }
          }
        }
      }

      return false;
    };

    // Validate menu existance
    this.validateMenuExistance = function (menuId) {
      if (menuId && menuId.length) {
        if (this.menus[menuId]) {
          return true;
        } else {
          throw new Error('Menu does not exist');
        }
      } else {
        throw new Error('MenuId was not provided');
      }

      return false;
    };

    // Get the menu object by menu id
    this.getMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Return the menu object
      return this.menus[menuId];
    };

    // Add new menu object by menu id
    this.addMenu = function (menuId, options) {
      options = options || {};

      // Create the new menu
      this.menus[menuId] = {
        roles: options.roles || this.defaultRoles,
        items: options.items || [],
        shouldRender: shouldRender
      };

      // Return the menu object
      return this.menus[menuId];
    };

    // Remove existing menu object by menu id
    this.removeMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Return the menu object
      delete this.menus[menuId];
    };

    // Add menu item object
    this.addMenuItem = function (menuId, options) {
      options = options || {};

      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Push new menu item
      this.menus[menuId].items.push({
        title: options.title || '',
        state: options.state || '',
        type: options.type || 'item',
        class: options.class,
        roles: ((options.roles === null || typeof options.roles === 'undefined') ? this.defaultRoles : options.roles),
        position: options.position || 0,
        items: [],
        shouldRender: shouldRender
      });

      // Add submenu items
      if (options.items) {
        for (var i in options.items) {
          this.addSubMenuItem(menuId, options.state, options.items[i]);
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    // Add submenu item object
    this.addSubMenuItem = function (menuId, parentItemState, options) {
      options = options || {};

      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Search for menu item
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].state === parentItemState) {
          // Push new submenu item
          this.menus[menuId].items[itemIndex].items.push({
            title: options.title || '',
            state: options.state || '',
            roles: ((options.roles === null || typeof options.roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : options.roles),
            position: options.position || 0,
            shouldRender: shouldRender
          });
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    // Remove existing menu object by menu id
    this.removeMenuItem = function (menuId, menuItemState) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].state === menuItemState) {
          this.menus[menuId].items.splice(itemIndex, 1);
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    // Remove existing menu object by menu id
    this.removeSubMenuItem = function (menuId, submenuItemState) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
          if (this.menus[menuId].items[itemIndex].items[subitemIndex].state === submenuItemState) {
            this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
          }
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    //Adding the topbar menu
    this.addMenu('topbar', {
      roles: ['*']
    });
  }
]);

'use strict';

// Create the Socket.io wrapper service
angular.module('core').service('Socket', ['Authentication', '$state', '$timeout',
  function (Authentication, $state, $timeout) {
    // Connect to Socket.io server
    this.connect = function () {
      // Connect only when authenticated
      if (Authentication.user) {
        this.socket = io();
      }
    };
    this.connect();

    // Wrap the Socket.io 'on' method
    this.on = function (eventName, callback) {
      if (this.socket) {
        this.socket.on(eventName, function (data) {
          $timeout(function () {
            callback(data);
          });
        });
      }
    };

    // Wrap the Socket.io 'emit' method
    this.emit = function (eventName, data) {
      if (this.socket) {
        this.socket.emit(eventName, data);
      }
    };

    // Wrap the Socket.io 'removeListener' method
    this.removeListener = function (eventName) {
      if (this.socket) {
        this.socket.removeListener(eventName);
      }
    };
  }
]);

'use strict';

// Configuring the Posts module
angular.module('posts').run(['Menus',
  function (Menus) {
    // Add the posts dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Posts',
      state: 'posts',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'posts', {
      title: 'List Posts',
      state: 'posts.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'posts', {
      title: 'Create Posts',
      state: 'posts.create',
      roles: ['user']
    });
  }
]);

'use strict';

// Setting up route
angular.module('posts').config(['$stateProvider',
  function ($stateProvider) {
    // Posts state routing
    $stateProvider
      .state('posts', {
        abstract: true,
        url: '/posts',
        template: '<ui-view/>'
      })
      .state('posts.list', {
        url: '',
        templateUrl: 'modules/posts/client/views/list-posts.client.view.html'
      })
      .state('posts.create', {
        url: '/create',
        templateUrl: 'modules/posts/client/views/create-post.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('posts.view', {
        url: '/:postId',
        templateUrl: 'modules/posts/client/views/view-post.client.view.html'
      })
      .state('posts.edit', {
        url: '/:postId/edit',
        templateUrl: 'modules/posts/client/views/edit-post.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);

'use strict';

// Comments controller
angular.module('posts').controller('PostsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Posts',
    function ($scope, $stateParams, $location, Authentication, Posts) {

        $scope.authentication = Authentication;
        $scope.user = Authentication.user;

        $scope.numOfPosts = Posts.countPosts();
        $scope.numOfPostsToday = Posts.countPostsToday();

        $scope.comments = false;

        $scope.numOfCommentsCoffee = Posts.countCustomersCoffee();
        $scope.numOfCommentsCoupon = Posts.countCustomersCoupon();


            // Create new Comment
        $scope.create = function () {
            // Create new Comment object

            var post = new Posts({

                details: this.details,
                userIdStringComment: $scope.authentication.user._id,
                coffeeId: $scope.coffee._id

            });

            // Redirect after save
            post.$save(function (response) {

                // Clear form fields
                $scope.details = '';

            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Create new Comment
        $scope.createCouponComment = function () {
            // Create new Comment object

            var post = new Posts({

                details: this.details,
                userIdStringComment: $scope.authentication.user._id,
                couponId: $scope.coupon._id

            });

            // Redirect after save
            post.$save(function (response) {

                // Clear form fields
                $scope.details = '';

            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.reload = function () {
            location.reload();
        };

        // Remove existing Comment
        $scope.remove = function (post) {
            if (post) {
                post.$remove();

                for (var i in $scope.posts) {
                    if ($scope.posts [i] === post) {
                        $scope.posts.splice(i, 1);
                    }
                }
            } else {
                $scope.post.$remove(function () {
                    $location.path('posts');
                });
            }
        };

        // Update existing Comment
        $scope.update = function () {
            var post = $scope.post;

            post.$update(function () {
                $location.path('posts/' + post._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Comments
        $scope.find = function () {

            $scope.posts = Posts.query();

        };

        // Find existing Comment
        $scope.findOne = function () {
            $scope.post = Posts.get({
                postId: $stateParams.postId
            });
        };

        $scope.voteCommentUp = function(post) {



            var hasVoted5 = post.voters.filter(function (voters) {

                    return voters === $scope.user._id;

                }).length > 0;

            // If a downvote exists remove it , else do nothing

            if (!hasVoted5) {

                post.votes++;
                //alert(coffee.votes);
                post.voters.push($scope.user);

            }else{

                alert("Already Voted");

            }

            post.$update(function () {
                //$location.path('coffees/' + coffee._id);
            }, function (errorResponse) {
                // rollback votes on fail also
                $scope.error = errorResponse.data.message;
            });

        };



    }
]);

'use strict';

//Posts service used for communicating with the posts REST endpoints
angular.module('posts').factory('Posts', ['$resource',
  function ($resource) {
    return $resource('posts/:postId', {
      postId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      countPosts: {
        method: 'GET',
        url: '/posts/postCount',
        isArray: false
      },
      countPostsToday: {
        method: 'GET',
        url: '/posts/postCountToday',
        isArray: false
      },
      countCustomersCoffee: {
        method: 'GET',
        url: '/posts/custCountCoffee',
        isArray: false
      },
      countCustomersCoupon: {
        method: 'GET',
        url: '/posts/custCountCoupon',
        isArray: false
      },
      usersPostsPostedTotal: {
        method: 'GET',
        url: '/posts/usersCommentsPostedTotal/:userIdStringComments',
        isArray: true
      }
    });
  }
]);

'use strict';

// Configuring the Articles module
angular.module('users.admin').run(['Menus',
  function (Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Users',
      state: 'admin.users'
    });
  }
]);

'use strict';

// Setting up route
angular.module('users.admin.routes').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('admin.users', {
        url: '/users',
        templateUrl: 'modules/users/client/views/admin/list-users.client.view.html',
        controller: 'UserListController'
      })
      .state('admin.user', {
        url: '/users/:userId',
        templateUrl: 'modules/users/client/views/admin/view-user.client.view.html',
        controller: 'UserController',
        resolve: {
          userResolve: ['$stateParams', 'Admin', function ($stateParams, Admin) {
            return Admin.get({
              userId: $stateParams.userId
            });
          }]
        }
      })
      .state('admin.user-edit', {
        url: '/users/:userId/edit',
        templateUrl: 'modules/users/client/views/admin/edit-user.client.view.html',
        controller: 'UserController',
        resolve: {
          userResolve: ['$stateParams', 'Admin', function ($stateParams, Admin) {
            return Admin.get({
              userId: $stateParams.userId
            });
          }]
        }
      });
  }
]);

'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
  function ($httpProvider) {
    // Set the httpProvider "not authorized" interceptor
    $httpProvider.interceptors.push(['$q', '$location', 'Authentication',
      function ($q, $location, Authentication) {
        return {
          responseError: function (rejection) {
            switch (rejection.status) {
              case 401:
                // Deauthenticate the global user
                Authentication.user = null;

                // Redirect to signin page
                $location.path('signin');
                break;
              case 403:
                // Add unauthorized behaviour
                break;
            }

            return $q.reject(rejection);
          }
        };
      }
    ]);
  }
]);

'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
    function ($stateProvider) {
        // Users state routing
        $stateProvider
            .state('settings', {
                abstract: true,
                url: '/settings',
                templateUrl: 'modules/users/client/views/settings/settings.client.view.html',
                data: {
                    roles: ['user', 'admin']
                }
            })
            .state('settings.profile', {
                url: '/profile',
                templateUrl: 'modules/users/client/views/settings/edit-profile.client.view.html'
            })
            .state('settings.password', {
                url: '/password',
                templateUrl: 'modules/users/client/views/settings/change-password.client.view.html'
            })
            .state('settings.accounts', {
                url: '/accounts',
                templateUrl: 'modules/users/client/views/settings/manage-social-accounts.client.view.html'
            })
            .state('settings.picture', {
                url: '/picture',
                templateUrl: 'modules/users/client/views/settings/change-profile-picture.client.view.html'
            })
            .state('authentication', {
                abstract: true,
                url: '/authentication',
                templateUrl: 'modules/users/client/views/authentication/authentication.client.view.html'
            })
            .state('authentication.signup', {
                url: '/signup',
                templateUrl: 'modules/users/client/views/authentication/signup.client.view.html'
            })
            .state('authentication.signin', {
                url: '/signin?err',
                templateUrl: 'modules/users/client/views/authentication/signin.client.view.html'
            })
            .state('password', {
                abstract: true,
                url: '/password',
                template: '<ui-view/>'
            })
            .state('password.forgot', {
                url: '/forgot',
                templateUrl: 'modules/users/client/views/password/forgot-password.client.view.html'
            })
            .state('password.reset', {
                abstract: true,
                url: '/reset',
                template: '<ui-view/>'
            })
            .state('password.reset.invalid', {
                url: '/invalid',
                templateUrl: 'modules/users/client/views/password/reset-password-invalid.client.view.html'
            })
            .state('password.reset.success', {
                url: '/success',
                templateUrl: 'modules/users/client/views/password/reset-password-success.client.view.html'
            })
            .state('users', {
            url: '/users/:userId',
            templateUrl: 'modules/users/client/views/view-profile.client.view.html'
               })
            
            .state('members', {
                url: '/members',
                templateUrl: 'modules/users/client/views/list-users.client.view.html'
            })
            .state('password.reset.form', {
                url: '/:token',
                templateUrl: 'modules/users/client/views/password/reset-password.client.view.html'
            });
    }
]);

'use strict';

angular.module('users.admin').controller('UserListController', ['$scope', '$filter', 'Admin',
  function ($scope, $filter, Admin) {
    Admin.query(function (data) {
      $scope.users = data;
      $scope.buildPager();
    });

    $scope.searchTab = false;

    $scope.toggleSearch = function(){

      if($scope.searchTab === true){
        $scope.searchTab = false;
      }else if($scope.searchTab === false){
        $scope.searchTab = true;
      }

    };

    $scope.buildPager = function () {
      $scope.pagedItems = [];
      $scope.itemsPerPage = 15;
      $scope.currentPage = 1;
      $scope.figureOutItemsToDisplay();
    };

    $scope.figureOutItemsToDisplay = function () {
      $scope.filteredItems = $filter('filter')($scope.users, {
        $: $scope.search
      });
      $scope.filterLength = $scope.filteredItems.length;
      var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
      var end = begin + $scope.itemsPerPage;
      $scope.pagedItems = $scope.filteredItems.slice(begin, end);
    };

    $scope.pageChanged = function () {
      $scope.figureOutItemsToDisplay();
    };
  }
]);

'use strict';

angular.module('users.admin').controller('UserController', ['$scope', '$state', 'Authentication', 'userResolve',
  function ($scope, $state, Authentication, userResolve) {
    $scope.authentication = Authentication;
    $scope.user = userResolve;

    $scope.remove = function (user) {
      if (confirm('Are you sure you want to delete this user?')) {
        if (user) {
          user.$remove();

          $scope.users.splice($scope.users.indexOf(user), 1);
        } else {
          $scope.user.$remove(function () {
            $state.go('admin.users');
          });
        }
      }
    };

    $scope.update = function (isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      var user = $scope.user;

      user.$update(function () {
        $state.go('admin.user', {
          userId: user._id
        });
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$state', '$http', '$location', '$window', 'Authentication',
  function ($scope, $state, $http, $location, $window, Authentication) {
    $scope.authentication = Authentication;

    // Get an eventual error defined in the URL query string:
    $scope.error = $location.search().err;

    //// If user is signed in then redirect back homep
    //if ($scope.authentication.user) {
    //  $location.path('/');
    //}

    $scope.signup = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      $http.post('/api/auth/signup', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;

        // And redirect to the previous or home page
        $state.go($state.previous.state.name || 'home', $state.previous.params);
      }).error(function (response) {
        $scope.error = response.message;
      });
    };

    $scope.signin = function (isValid) {
      $scope.error = null;



      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      $http.post('/api/auth/signin', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;

          $scope.authentication.user.imageURL  = '/modules/users/client/img/profile/saveme-placeholder.png';

        // And redirect to the previous or home page
        $state.go($state.previous.state.name || 'home', $state.previous.params);
      }).error(function (response) {
        $scope.error = response.message;
      });
    };

    // OAuth provider request
    $scope.callOauthProvider = function (url) {
      if ($state.previous && $state.previous.href) {
        url += '?redirect_to=' + encodeURIComponent($state.previous.href);
      }

      // Effectively call OAuth authentication route:
      $window.location.href = url;
    };
  }
]);

'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
  function ($scope, $stateParams, $http, $location, Authentication) {
    $scope.authentication = Authentication;

    //If user is signed in then redirect back home
    if ($scope.authentication.user) {
      $location.path('/');
    }

    // Submit forgotten password account id
    $scope.askForPasswordReset = function () {
      $scope.success = $scope.error = null;

      $http.post('/api/auth/forgot', $scope.credentials).success(function (response) {
        // Show user success message and clear form
        $scope.credentials = null;
        $scope.success = response.message;

      }).error(function (response) {
        // Show user error message and clear form
        $scope.credentials = null;
        $scope.error = response.message;
      });
    };

    // Change user password
    $scope.resetUserPassword = function () {
      $scope.success = $scope.error = null;

      $http.post('/api/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.passwordDetails = null;

        // Attach user profile
        Authentication.user = response;

        // And redirect to the index page
        $location.path('/password/reset/success');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('ViewProfileController', ['$scope', '$http', '$resource', '$location', 'Users', 'Authentication', '$stateParams', 'Coffees', 'Posts',
    function ($scope, $http, $resource, $location, Users, Authentication, $stateParams, Coffees, Posts) {

        $scope.authentication = Authentication;
        $scope.user = Authentication.user;

        $http.get('api/users/' + $stateParams.userId).success(function (data) {
            $scope.profile = data;
        });

        $http.get('coffees/usersCoffeesPostedTotal/' + $stateParams.userId).success(function (data1) {
            $scope.coffeesByUser = data1;

            $scope.totalUpvotes = 0;
            $scope.totalDownvotes = 0;

            for (var i = 0; i < $scope.coffeesByUser.length; i++) {

                $scope.totalUpvotes = $scope.totalUpvotes + $scope.coffeesByUser[i].upVoters.length;
            }

            for (var x = 0; x < $scope.coffeesByUser.length; x++) {

                $scope.totalDownvotes = $scope.totalDownvotes + $scope.coffeesByUser[x].downVoters.length;
            }

        });

        $http.get('coffees/usersUpvotesTotal/' + $stateParams.userId).success(function (data4) {
            $scope.upvotesToUser = data4;
        });
        

        $http.get('posts/usersCommentsPostedTotal/' + $stateParams.userId).success(function (data3) {
            $scope.commentsByUser = data3;
        });


        $scope.capatilize = function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        };

        $scope.myPage = false;
        if ($stateParams.userId === $scope.authentication.user._id) {
            $scope.myPage = true;
        }



    }
]);

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

'use strict';

angular.module('users').controller('ChangeProfilePictureController', ['$scope', '$timeout', '$location', '$window', 'Authentication', 'FileUploader', 'Users',
    function ($scope, $timeout, $window, $location, Authentication, FileUploader, Users) {

        $scope.user = Authentication.user;
        $scope.imageURL = $scope.user.profileImageURL;
        $scope.avatarSelected = false;


        if ($scope.user.provider === 'google') {

            var full = $scope.user.providerData.image.url;
            full = full.substring(0, full.length - 2);

            $scope.changedAvatar = full + '120';

        }


        $scope.randomAvatar1 = '../modules/users/client/img/profile/avatars/2/' + Math.floor((Math.random() * 90) + 1) + '.png';
        $scope.randomAvatar2 = '../modules/users/client/img/profile/avatars/2/' + Math.floor((Math.random() * 90) + 1) + '.png';
        $scope.randomAvatar3 = '../modules/users/client/img/profile/avatars/2/' + Math.floor((Math.random() * 90) + 1) + '.png';
        $scope.randomAvatar4 = '../modules/users/client/img/profile/avatars/2/' + Math.floor((Math.random() * 90) + 1) + '.png';
        $scope.randomAvatar5 = '../modules/users/client/img/profile/avatars/2/' + Math.floor((Math.random() * 90) + 1) + '.png';
        $scope.randomAvatar6 = '../modules/users/client/img/profile/avatars/2/' + Math.floor((Math.random() * 90) + 1) + '.png';
        $scope.randomAvatar7 = '../modules/users/client/img/profile/avatars/2/' + Math.floor((Math.random() * 90) + 1) + '.png';
        $scope.randomAvatar8 = '../modules/users/client/img/profile/avatars/2/' + Math.floor((Math.random() * 90) + 1) + '.png';
        $scope.randomAvatar9 = '../modules/users/client/img/profile/avatars/2/' + Math.floor((Math.random() * 90) + 1) + '.png';
        $scope.randomAvatar10 = '../modules/users/client/img/profile/avatars/2/' + Math.floor((Math.random() * 90) + 1) + '.png';
        $scope.randomAvatar11 = '../modules/users/client/img/profile/avatars/2/' + Math.floor((Math.random() * 90) + 1) + '.png';
        $scope.randomAvatar12 = '../modules/users/client/img/profile/avatars/2/' + Math.floor((Math.random() * 90) + 1) + '.png';
        $scope.randomAvatar13 = '../modules/users/client/img/profile/avatars/2/' + Math.floor((Math.random() * 90) + 1) + '.png';
        $scope.randomAvatar14 = '../modules/users/client/img/profile/avatars/2/' + Math.floor((Math.random() * 90) + 1) + '.png';
        $scope.randomAvatar15 = '../modules/users/client/img/profile/avatars/2/' + Math.floor((Math.random() * 90) + 1) + '.png';
        $scope.randomAvatar16 = '../modules/users/client/img/profile/avatars/2/' + Math.floor((Math.random() * 90) + 1) + '.png';
        $scope.randomAvatarFB = '../modules/users/client/img/profile/avatars/2/' + Math.floor((Math.random() * 90) + 1) + '.png';
        $scope.randomAvatarG = '../modules/users/client/img/profile/avatars/2/' + Math.floor((Math.random() * 90) + 1) + '.png';


        // Create file uploader instance
        $scope.uploader = new FileUploader({
            url: 'api/users/picture'
        });

        // Check if provider is already in use with current user
        $scope.isConnectedSocialAccountProfile = function (provider) {

            return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
        };

        $scope.selectAvatar = function (imageURLIn) {

            $scope.imageURL = imageURLIn;
            $scope.avatarSelected = true;

        };


        $scope.randomiseAvatars = function () {

            $scope.randomAvatar1 = '../modules/users/client/img/profile/avatars/2/' + Math.floor((Math.random() * 90) + 1) + '.png';
            $scope.randomAvatar2 = '../modules/users/client/img/profile/avatars/2/' + Math.floor((Math.random() * 90) + 1) + '.png';
            $scope.randomAvatar3 = '../modules/users/client/img/profile/avatars/2/' + Math.floor((Math.random() * 90) + 1) + '.png';
            $scope.randomAvatar4 = '../modules/users/client/img/profile/avatars/2/' + Math.floor((Math.random() * 90) + 1) + '.png';
            $scope.randomAvatar5 = '../modules/users/client/img/profile/avatars/2/' + Math.floor((Math.random() * 90) + 1) + '.png';
            $scope.randomAvatar6 = '../modules/users/client/img/profile/avatars/2/' + Math.floor((Math.random() * 90) + 1) + '.png';
            $scope.randomAvatar7 = '../modules/users/client/img/profile/avatars/2/' + Math.floor((Math.random() * 90) + 1) + '.png';
            $scope.randomAvatar8 = '../modules/users/client/img/profile/avatars/2/' + Math.floor((Math.random() * 90) + 1) + '.png';
            $scope.randomAvatar9 = '../modules/users/client/img/profile/avatars/2/' + Math.floor((Math.random() * 90) + 1) + '.png';
            $scope.randomAvatar10 = '../modules/users/client/img/profile/avatars/2/' + Math.floor((Math.random() * 90) + 1) + '.png';
            $scope.randomAvatar11 = '../modules/users/client/img/profile/avatars/2/' + Math.floor((Math.random() * 90) + 1) + '.png';
            $scope.randomAvatar12 = '../modules/users/client/img/profile/avatars/2/' + Math.floor((Math.random() * 90) + 1) + '.png';
            $scope.randomAvatar13 = '../modules/users/client/img/profile/avatars/2/' + Math.floor((Math.random() * 90) + 1) + '.png';
            $scope.randomAvatar14 = '../modules/users/client/img/profile/avatars/2/' + Math.floor((Math.random() * 90) + 1) + '.png';
            $scope.randomAvatar15 = '../modules/users/client/img/profile/avatars/2/' + Math.floor((Math.random() * 90) + 1) + '.png';
            $scope.randomAvatar16 = '../modules/users/client/img/profile/avatars/2/' + Math.floor((Math.random() * 90) + 1) + '.png';
            $scope.randomAvatarFB = '../modules/users/client/img/profile/avatars/2/' + Math.floor((Math.random() * 90) + 1) + '.png';
            $scope.randomAvatarG = '../modules/users/client/img/profile/avatars/2/' + Math.floor((Math.random() * 90) + 1) + '.png';


        };

        // Set file uploader image filter
        $scope.uploader.filters.push({
            name: 'imageFilter',
            fn: function (item, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });

        // Called after the user selected a new picture file
        $scope.uploader.onAfterAddingFile = function (fileItem) {
            if ($window.FileReader) {
                var fileReader = new FileReader();
                fileReader.readAsDataURL(fileItem._file);

                fileReader.onload = function (fileReaderEvent) {
                    $timeout(function () {
                        $scope.imageURL = fileReaderEvent.target.result;
                    }, 0);
                };
            }
        };

        // Called after the user has successfully uploaded a new picture
        $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
            // Show success message
            $scope.success = true;

            // Populate user object
            $scope.user = Authentication.user = response;

            // Clear upload buttons
            $scope.cancelUpload();
        };

        // Called after the user has failed to uploaded a new picture
        $scope.uploader.onErrorItem = function (fileItem, response, status, headers) {
            // Clear upload buttons
            $scope.cancelUpload();

            // Show error message
            $scope.error = response.message;
        };

        // Change user profile picture
        $scope.uploadProfilePicture = function () {
            // Clear messages
            $scope.success = $scope.error = null;

            // Start upload
            $scope.uploader.uploadAll();

        };

        // Change user profile picture
        $scope.uploadProfilePictureAvatar = function () {

            // Clear messages
            $scope.success = $scope.error = null;

            var user = new Users($scope.user);

            user.profileImageURL = $scope.imageURL;

            user.$update(function (response) {

                $scope.success = true;
                Authentication.user = response;


            }, function (response) {
                $scope.error = response.data.message;
            });


        };

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

        // Cancel the upload process
        $scope.cancelUpload = function () {
            $scope.uploader.clearQueue();
            $scope.imageURL = $scope.user.profileImageURL;
        };


    }
]);

'use strict';

angular.module('users').controller('EditProfileController', ['$scope', '$http', '$location', 'Users', 'Authentication',
  function ($scope, $http, $location, Users, Authentication) {
    $scope.user = Authentication.user;

    // Update a user profile
    $scope.updateUserProfile = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      var user = new Users($scope.user);

      user.$update(function (response) {
        $scope.$broadcast('show-errors-reset', 'userForm');

        $scope.success = true;
        Authentication.user = response;
      }, function (response) {
        $scope.error = response.data.message;
      });


    };
  }
]);

'use strict';

angular.module('users').controller('SocialAccountsController', ['$scope', '$http', 'Authentication',
  function ($scope, $http, Authentication) {
    $scope.user = Authentication.user;

    // Check if there are additional accounts
    $scope.hasConnectedAdditionalSocialAccounts = function (provider) {
      for (var i in $scope.user.additionalProvidersData) {
        return true;
      }

      return false;
    };

    // Check if provider is already in use with current user
    $scope.isConnectedSocialAccount = function (provider) {



      return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
    };

    // Remove a user social account
    $scope.removeUserSocialAccount = function (provider) {
      $scope.success = $scope.error = null;

      $http.delete('/api/users/accounts', {
        params: {
          provider: provider
        }
      }).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.user = Authentication.user = response;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('SettingsController', ['$scope', 'Authentication',
  function ($scope, Authentication) {
    $scope.user = Authentication.user;
  }
]);

'use strict';

// Users directive used to force lowercase input
angular.module('users').directive('lowercase', function () {
  return {
    require: 'ngModel',
    link: function (scope, element, attrs, modelCtrl) {
      modelCtrl.$parsers.push(function (input) {
        return input ? input.toLowerCase() : '';
      });
      element.css('text-transform', 'lowercase');
    }
  };
});

'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', ['$window',
  function ($window) {
    var auth = {
      user: $window.user
    };

    return auth;
  }
]);

'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
  function ($resource) {
    return $resource('api/users', {}, {
      update: {
        method: 'PUT'
      },
      countUsers: {
        method: 'GET',
        url: '/users/userCount',
        isArray: false
      },
      countUsersToday: {
        method: 'GET',
        url: '/users/userCountToday',
        isArray: false
      }
    });
  }
]);

//TODO this should be Users service
angular.module('users.admin').factory('Admin', ['$resource',
  function ($resource) {
    return $resource('api/users/:userId', {
      userId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
