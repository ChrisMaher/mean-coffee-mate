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

        $scope.showAModal = function() {

            // Just provide a template url, a controller and call 'showModal'.
            ModalService.showModal({
                template: "<div>Fry lives in {{futurama.city}}</div>",
                controller: function() {
                    this.city = "New New York";
                },
                controllerAs : "futurama"
            });

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
