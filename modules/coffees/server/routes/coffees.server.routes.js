'use strict';

/**
 * Module dependencies.
 */
var coffeesPolicy = require('../policies/coffees.server.policy'),
    coffees = require('../controllers/coffees.server.controller');

module.exports = function (app) {

    app.route('/api/coffees/picture')
        .post(coffees.changeProductPictureCoffee);

    // Coffees collection routes
    app.route('/api/coffees').all(coffeesPolicy.isAllowed)
        .get(coffees.list)
        .post(coffees.create);

    // Coffees collection routes
    app.route('/app/coffees').all(coffeesPolicy.isAllowed)
        .get(coffees.list);


    // Single coffee routes
    app.route('/api/coffees/:coffeeId').all(coffeesPolicy.isAllowed)
        .get(coffees.read)
        .put(coffees.update)
        .delete(coffees.delete);

    // Single coffee routes
    app.route('/api/coffees/app/:appCoffeeId/:userEmail').all()
        .post(coffees.appUpvoteCoffee);

    app.route('/coffees/coffeeCount').all()
        .get(coffees.countCoffees);

    app.route('/coffees/coffeeCountToday').all()
        .get(coffees.countCoffeesToday);

    //app.route('/coffees/usersCoffeesPostedTotal').all()
    //    .get(coffees.usersCoffeesPostedTotal);

    app.route('/api/coffees/of/:userid')
        .get(coffees.listOf);

    app.route('/api/coffees/of/:username')
        .get(coffees.listOf);

    app.route('/coffees/usersCoffeesPostedTotal/:userIdString')
        .get(coffees.usersCoffeesPostedTotal);

    app.route('/coffees/usersUpvotesTotal/:userIdString')
        .get(coffees.usersUpvotesTotal);

    app.route('/coffees/removeVotesDaily')
        .get(coffees.removeVotesDaily);

    // Finish by binding the coffee middleware
    app.param('coffeeId', coffees.coffeeByID);
    app.param('userid', coffees.listOf);
    app.param('userIdString', coffees.usersCoffeesPostedTotal);
    app.param('userIdString', coffees.usersUpvotesTotal);
    app.param('appCoffeeId', coffees.appUpvoteCoffee);
    app.param('userEmail', coffees.appUpvoteCoffee);

};
