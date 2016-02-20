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
