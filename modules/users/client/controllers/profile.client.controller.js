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
