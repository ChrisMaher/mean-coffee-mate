'use strict';

/**
 * Module dependencies.
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Coffees Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/coffees',
      permissions: '*'
    }, {
      resources: '/api/coffees/:coffeeId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/coffees',
      permissions: ['get', 'post', 'put']
    }, {
      resources: '/api/coffees/:coffeeId',
      permissions: ['get', 'put']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/coffees',
      permissions: ['get']
    }, {
      resources: '/api/coffees/:coffeeId',
      permissions: ['get']
    }, {
      resources: '/api/coffees/:appCoffeeId/:userEmail',
      permissions: ['get', 'put']
    }]
  }]);
};

/**
 * Check If Coffees Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an coffee is being processed and the current user created it then allow any manipulation
  if (req.coffee && req.user && req.coffee.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred.
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
