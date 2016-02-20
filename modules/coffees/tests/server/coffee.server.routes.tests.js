'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Coffee = mongoose.model('Coffee'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, coffee;

/**
 * Coffee routes tests
 */
describe('Coffee CRUD tests', function () {
  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'password'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new coffee
    user.save(function () {
      coffee = {
        title: 'Coffee Title',
        content: 'Coffee Content'
      };

      done();
    });
  });

  it('should be able to save an coffee if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new coffee
        agent.post('/api/coffees')
          .send(coffee)
          .expect(200)
          .end(function (coffeeSaveErr, coffeeSaveRes) {
            // Handle coffee save error
            if (coffeeSaveErr) {
              return done(coffeeSaveErr);
            }

            // Get a list of coffees
            agent.get('/api/coffees')
              .end(function (coffeesGetErr, coffeesGetRes) {
                // Handle coffee save error
                if (coffeesGetErr) {
                  return done(coffeesGetErr);
                }

                // Get coffees list
                var coffees = coffeesGetRes.body;

                // Set assertions
                (coffees[0].user._id).should.equal(userId);
                (coffees[0].title).should.match('Coffee Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an coffee if not logged in', function (done) {
    agent.post('/api/coffees')
      .send(coffee)
      .expect(403)
      .end(function (coffeeSaveErr, coffeeSaveRes) {
        // Call the assertion callback
        done(coffeeSaveErr);
      });
  });

  it('should not be able to save an coffee if no title is provided', function (done) {
    // Invalidate title field
    coffee.title = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new coffee
        agent.post('/api/coffees')
          .send(coffee)
          .expect(400)
          .end(function (coffeeSaveErr, coffeeSaveRes) {
            // Set message assertion
            (coffeeSaveRes.body.message).should.match('Title cannot be blank');

            // Handle coffee save error
            done(coffeeSaveErr);
          });
      });
  });

  it('should be able to update an coffee if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new coffee
        agent.post('/api/coffees')
          .send(coffee)
          .expect(200)
          .end(function (coffeeSaveErr, coffeeSaveRes) {
            // Handle coffee save error
            if (coffeeSaveErr) {
              return done(coffeeSaveErr);
            }

            // Update coffee title
            coffee.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing coffee
            agent.put('/api/coffees/' + coffeeSaveRes.body._id)
              .send(coffee)
              .expect(200)
              .end(function (coffeeUpdateErr, coffeeUpdateRes) {
                // Handle coffee update error
                if (coffeeUpdateErr) {
                  return done(coffeeUpdateErr);
                }

                // Set assertions
                (coffeeUpdateRes.body._id).should.equal(coffeeSaveRes.body._id);
                (coffeeUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of coffees if not signed in', function (done) {
    // Create new coffee model instance
    var coffeeObj = new Coffee(coffee);

    // Save the coffee
    coffeeObj.save(function () {
      // Request coffees
      request(app).get('/api/coffees')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single coffee if not signed in', function (done) {
    // Create new coffee model instance
    var coffeeObj = new Coffee(coffee);

    // Save the coffee
    coffeeObj.save(function () {
      request(app).get('/api/coffees/' + coffeeObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', coffee.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single coffee with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/coffees/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Coffee is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single coffee which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent coffee
    request(app).get('/api/coffees/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No coffee with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an coffee if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new coffee
        agent.post('/api/coffees')
          .send(coffee)
          .expect(200)
          .end(function (coffeeSaveErr, coffeeSaveRes) {
            // Handle coffee save error
            if (coffeeSaveErr) {
              return done(coffeeSaveErr);
            }

            // Delete an existing coffee
            agent.delete('/api/coffees/' + coffeeSaveRes.body._id)
              .send(coffee)
              .expect(200)
              .end(function (coffeeDeleteErr, coffeeDeleteRes) {
                // Handle coffee error error
                if (coffeeDeleteErr) {
                  return done(coffeeDeleteErr);
                }

                // Set assertions
                (coffeeDeleteRes.body._id).should.equal(coffeeSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an coffee if not signed in', function (done) {
    // Set coffee user
    coffee.user = user;

    // Create new coffee model instance
    var coffeeObj = new Coffee(coffee);

    // Save the coffee
    coffeeObj.save(function () {
      // Try deleting coffee
      request(app).delete('/api/coffees/' + coffeeObj._id)
        .expect(403)
        .end(function (coffeeDeleteErr, coffeeDeleteRes) {
          // Set message assertion
          (coffeeDeleteRes.body.message).should.match('User is not authorized');

          // Handle coffee error error
          done(coffeeDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Coffee.remove().exec(done);
    });
  });
});
