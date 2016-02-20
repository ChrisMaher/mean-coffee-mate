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
