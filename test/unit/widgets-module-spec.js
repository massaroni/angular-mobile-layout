'use strict';

describe('Module: mobile.layout', function () {

  // load the service's module
  beforeEach(module('mobile.layout'));

  it('should load the module and inject JqLiteExtender', inject(function (JqLiteExtender) {
    expect(!!JqLiteExtender).toBe(true);
  }));

});