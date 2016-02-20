'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    Post = mongoose.model('Post'),
    _ = require('lodash');

/**
 * Create a Post
 */
exports.create = function (req, res) {
    var post = new Post(req.body);
    post.user = req.user;

    post.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(post);
        }
    });
};

/**
 * Show the current Post
 */
exports.read = function (req, res) {
    res.jsonp(req.post);
};

/**
 * Update a Post
 */
exports.update = function (req, res) {
    var post = req.post;

    post = _.extend(post, req.body);

    post.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(post);
        }
    });
};

/**
 * Delete an Post
 */
exports.delete = function (req, res) {
    var post = req.post;

    post.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(post);
        }
    });
};

/**
 * List of Posts
 */

exports.list = function (req, res) {

    var id = req.postId;
    console.log('Log - ' + id);
    Post.find( )
        .sort('-created')
        .populate('user')
        .exec(function (err, posts) {

            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp(posts);
            }
        });
};

/**
 * Count of Posts
 */
exports.countPosts = function (req, res) {
    Post.count({},

        function (err, postsCount) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                var data = {};
                data.count = postsCount;
                res.jsonp(data);
            }
        });
};

/**
 * Count of Posts
 */
exports.usersCommentsPostedTotal = function(req, res) {

    Post.find( {

        userIdStringComment: req.params.userIdStringComment }).sort('-created').populate('_id').exec(function (err, posts) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(posts);
        }
    });
};


/**
 * Count of Posts Today
 */
exports.countPostsToday = function (req, res) {
    Post.count({

            $where: function () {
                return Date.now() - this._id.getTimestamp() < (24 * 60 * 60 * 1000);
            }

        },

        function (err, postsCount) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                var data = {};
                data.count = postsCount;
                res.jsonp(data);
            }
        });
};

/**
 * Count of Customers
 */
exports.custCountCoffee = function(req, res) {
    Post.count({},
        function(err, customerCount) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                var data = {};
                data.count = customerCount;
                res.json(data);
            }
        });
};


/**
 * Count of Customers
 */
exports.custCountCoupon = function(req, res) {
    Post.count({},
        function(err, customerCount) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                var data = {};
                data.count = customerCount;
                res.json(data);
            }
        });
};

exports.listOf = function(req, res) { Post.find( { user: req.params.userid }).sort('-created').exec(function(err, posts) {
    if (err) {
        return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
        });
    } else {
        res.jsonp(posts);
    }
});
};

/**
 * Post middleware
 */
exports.postByID = function (req, res, next, id) {
    Post.findById(id).populate('user').exec(function (err, post) {
        if (err) return next(err);
        if (!post) return next(new Error('Failed to load Post ' + id));
        req.post = post;
        next();
    });
};

/**
 * Post authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
    if (req.post.user.id !== req.user.id) {
        return res.status(403).send('User is not authorized');
    }
    next();
};
