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
