'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    fs = require('fs'),
    mongoose = require('mongoose'),
    Coffee = mongoose.model('Coffee'),
    User = mongoose.model('User'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    _ = require('lodash');

/**
 * Create a coffee
 */
exports.create = function (req, res) {
    var coffee = new Coffee(req.body);
    coffee.user = req.user;

    coffee.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(coffee);
        }
    });
};

/**
 * Show the current coffee
 */
exports.read = function (req, res) {
    res.json(req.coffee);
};

/**
 * Update a coffee
 */
exports.update = function (req, res) {

    var coffee = req.coffee;

    //coffee.title  = req.body.title;
    //coffee.retailer  = req.body.retailer;
    //coffee.price  = req.body.price;
    //coffee.image  = req.body.image;
    //coffee.votes = req.body.votes;
    //coffee.votesreal = req.body.votesreal;
    //coffee.urlimage  = req.body.urlimage;
    //coffee.tags  = req.body.tags;
    //coffee.upVoters  = req.body.upVoters;
    //coffee.downVoters  = req.body.downVoters;
    //coffee.link  = req.body.link;
    //coffee.details  = req.body.details;
    //coffee.currency  = req.body.currency;

    coffee = _.extend(coffee, req.body);

    coffee.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(coffee);
        }
    });
};

/**
 * Delete an coffee
 */
exports.delete = function (req, res) {
    var coffee = req.coffee;

    coffee.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(coffee);
        }
    });
};

/**
 * List of Coffees
 */
exports.list = function (req, res) {
    Coffee.find().sort('-created').populate('user').exec(function (err, coffees) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(coffees);
        }
    });
};

/**
 * Coffee middleware
 */
exports.coffeeByID = function (req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Coffee is invalid'
        });
    }

    Coffee.findById(id).populate('user').exec(function (err, coffee) {
        if (err) {
            return next(err);
        } else if (!coffee) {
            return res.status(404).send({
                message: 'No coffee with that identifier has been found'
            });
        }
        req.coffee = coffee;
        next();
    });
};

/**
 * Count of Coffees
 */
exports.countCoffees = function (req, res) {
    Coffee.count({},

        function (err, coffeesCount) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)

                });
            } else {
                var data = {};
                data.count = coffeesCount;
                res.jsonp(data);
            }
        });
};

///**
// * Count of Coffees by User
// */
//exports.usersCoffeesPostedTotal = function (req, res) {
//
//    Coffee.count({
//
//            $where: function () {
//                return this.userIdString === req.params.userIdString;
//            }
//
//    },
//
//        function (err, coffeesCount) {
//            if (err) {
//                return res.status(400).send({
//
//                    message: errorHandler.getErrorMessage(err)
//
//                });
//            } else {
//                var data = {};
//                data.count = coffeesCount;
//                res.jsonp(data);
//            }
//        });
//};

exports.usersCoffeesPostedTotal = function(req, res) {

    Coffee.find( {

        userIdString: req.params.userIdString }).sort('-created').populate('_id').exec(function (err, coffees) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(coffees);
        }
    });
};

// Count Upvotes by a user

exports.usersUpvotesTotal = function(req, res) {

    Coffee.find( {

        upVoters: req.params.userIdString }).sort('-created').populate('_id').exec(function (err, coffees) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(coffees);
        }
    });
};

// Count Upvotes by a user

/**
 * List of Coffees
 */
exports.removeVotesDaily = function (req, res) {

    Coffee.find().sort('created').populate('votes').exec(function (err, coffees) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {

            for (var i = 0; i < coffees.length; i++) {

                if(coffees[i].votes > 100){

                    coffees[i].votes = coffees[i].votes - (coffees[i].votes / 5);
                    coffees[i].update();
                    console.log("removed votes");

                }else{
                    coffees[i].votes = 100;
                    console.log("changed to 100");
                }


            }


            res.json(coffees);
        }
    });

};

// Upvote a Coffee
exports.appUpvoteCoffee = function (req, res, next) {

    Coffee.find({

        _id: req.params.appCoffeeId

    }).populate('user').exec(function (err, coffee) {
        if (err) {
            return next(err);
        } else if (!coffee) {
            return res.status(404).send({
                message: 'No coffee with that identifier has been found'
            });
        }
        req.coffee = coffee;
        next();
    });

};


exports.listOf = function(req, res) {

    Coffee.find( {

        user: req.params.userid }).sort('-created').exec(function(err, posts) {

    if (err) {
        return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
        });
    } else {
        //console.log(req.params.userid);
        res.jsonp(posts);
    }
});
};

/**
 * Count of Coffees Today
 */
exports.countCoffeesToday = function (req, res) {
    Coffee.count({

        $where: function () {
            return Date.now() - this._id.getTimestamp() < (24 * 60 * 60 * 1000);
        }

        },

        function (err, coffeesCount) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                var data = {};
                data.count = coffeesCount;
                res.jsonp(data);
            }
        });
};

/**
 * Update product picture
 */
exports.changeProductPictureCoffee = function (req, res) {

    var user = req.user;
    var message = null;

    if (user) {
        fs.writeFile('./modules/coffees/client/img/uploads/' + req.files.file.name, req.files.file.buffer, function (uploadError) {
            if (uploadError) {
                return res.status(400).send({
                    message: 'Error occurred while uploading profile picture'
                });
            } else {

                user.imageURL = './modules/coffees/client/img/uploads/' + req.files.file.name;

                user.save(function (saveError) {
                    if (saveError) {
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(saveError)
                        });
                    } else {
                        req.login(user, function (err) {
                            if (err) {
                                res.status(400).send(err);
                            } else {
                                res.json(user);
                            }
                        });
                    }
                });
            }
        });
    } else {
        res.status(400).send({
            message: 'User is not signed in'
        });
    }
};
