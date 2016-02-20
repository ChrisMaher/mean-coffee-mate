'use strict';

(function () {
  // Coffees Controller Spec
  describe('Coffees Controller Tests', function () {
    // Initialize global variables
    var CoffeesController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Coffees,
      mockCoffee;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Coffees_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Coffees = _Coffees_;

      // create mock coffee
      mockCoffee = new Coffees({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Coffee about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Coffees controller.
      CoffeesController = $controller('CoffeesController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one coffee object fetched from XHR', inject(function (Coffees) {
      // Create a sample coffees array that includes the new coffee
      var sampleCoffees = [mockCoffee];

      // Set GET response
      $httpBackend.expectGET('api/coffees').respond(sampleCoffees);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.coffees).toEqualData(sampleCoffees);
    }));

    it('$scope.findOne() should create an array with one coffee object fetched from XHR using a coffeeId URL parameter', inject(function (Coffees) {
      // Set the URL parameter
      $stateParams.coffeeId = mockCoffee._id;

      // Set GET response
      $httpBackend.expectGET(/api\/coffees\/([0-9a-fA-F]{24})$/).respond(mockCoffee);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.coffee).toEqualData(mockCoffee);
    }));

    describe('$scope.create()', function () {
      var sampleCoffeePostData;

      beforeEach(function () {
        // Create a sample coffee object
        sampleCoffeePostData = new Coffees({
          title: 'An Coffee about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Coffee about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Coffees) {
        // Set POST response
        $httpBackend.expectPOST('api/coffees', sampleCoffeePostData).respond(mockCoffee);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the coffee was created
        expect($location.path.calls.mostRecent().args[0]).toBe('coffees/' + mockCoffee._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/coffees', sampleCoffeePostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock coffee in scope
        scope.coffee = mockCoffee;
      });

      it('should update a valid coffee', inject(function (Coffees) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/coffees\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/coffees/' + mockCoffee._id);
      }));

      it('should set scope.error to error response message', inject(function (Coffees) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/coffees\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(coffee)', function () {
      beforeEach(function () {
        // Create new coffees array and include the coffee
        scope.coffees = [mockCoffee, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/coffees\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockCoffee);
      });

      it('should send a DELETE request with a valid coffeeId and remove the coffee from the scope', inject(function (Coffees) {
        expect(scope.coffees.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.coffee = mockCoffee;

        $httpBackend.expectDELETE(/api\/coffees\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to coffees', function () {
        expect($location.path).toHaveBeenCalledWith('coffees');
      });
    });
  });
}());
