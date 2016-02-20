'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Coffee Schema
 */
var CoffeeSchema = new Schema({

  title: {
    type: String,
    required: 'We need the title of the Coffee.',
    trim: true
  },
  brand: {
    type: String,
    required: 'We need the brand of the Coffee.',
    trim: true
  },
  marketingtext: {
    type: String,
    required: 'We need the marketing text of the Coffee.',
    trim: true
  },
  price: {
    type: Number,
    required: 'We need a price for the Coffee.',
    trim: true,
    min: 0,
    max: 1000000
  },
  retailer: {
    type: String,
    required: 'We need the retailer of the Coffee.',
    trim: true
  },
  brandlogo: {
    type: String,
    required: 'We need the brandlogo of the Coffee.',
    trim: true
  },
  urlimage: {
    type: String,
    required: 'We need the brandlogo of the Coffee.',
    trim: true
  },
  country: {
    type: String,
    required: 'We need the country of the Coffee.',
    trim: true
  },
  roast: {
    type: Number,
    required: 'We need a roast rating for the Coffee.',
    default: 0,
    trim: true,
    min: 0,
    max: 10
  },
  aroma: {
    type: Number,
    required: 'We need an aroma rating for the Coffee.',
    trim: true,
    default: 0,
    min: 0,
    max: 10
  },
  body: {
    type: Number,
    required: 'We need a body rating for the Coffee.',
    default: 0,
    trim: true,
    min: 0,
    max: 10
  },
  flavour: {
    type: Number,
    required: 'We need a flavour rating for the Coffee.',
    default: 0,
    trim: true,
    min: 0,
    max: 10
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  userIdString: {
    type: String,
    required: 'We need the user of the Coffee.',
    default: 'NA',
    trim: true
  },
  upVoters: [{
    type: String,
    default: 'NA',
    trim: true
  }],
  votes: {
    type: Number,
    required: '',
    default: 100,
    trim: true
  },
  downVoters: [{
    type: String,
    default: 'NA',
    trim: true
  }],
  created: {
    type: Date,
    default: Date.now
  }

});

mongoose.model('Coffee', CoffeeSchema);
