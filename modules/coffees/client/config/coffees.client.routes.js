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
