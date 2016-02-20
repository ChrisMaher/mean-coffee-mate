'use strict';

/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Post Schema
 */
var PostSchema = new Schema({

    created: {
        type: Date,
        default: Date.now
    },
    details: {
        type: String,
        default: 'NA',
        trim: true
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    userIdStringComment: {
        type: String,
        trim: true
    },
    votes: {
        type: Number,
        default: 0
    },
    voters: [{
        type: Schema.ObjectId,
        ref: 'User'
    }],
    coffeeId: {
        type: String,
        trim: true
    },
    couponId: {
        type: String,
        trim: true
    }

});

mongoose.model('Post', PostSchema);
