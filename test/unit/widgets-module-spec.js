'use strict';

describe('Module: mass.widgets', function () {

  // load the service's module
  beforeEach(module('mass.widgets'));

  it('should load the module and inject JqLiteExtender', inject(function (JqLiteExtender) {
    expect(!!JqLiteExtender).toBe(true);
  }));

});