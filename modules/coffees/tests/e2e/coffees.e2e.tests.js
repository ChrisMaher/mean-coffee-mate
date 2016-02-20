'use strict';

describe('Coffees E2E Tests:', function () {
  describe('Test coffees page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3000/coffees');
      expect(element.all(by.repeater('coffee in coffees')).count()).toEqual(0);
    });
  });
});
