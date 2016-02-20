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
