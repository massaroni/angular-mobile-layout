'use strict';

describe('Provider: JqLiteExtender', function () {

  // load the service's module
  beforeEach(module('mass.widgets'));

  beforeEach(inject(function (JqLiteExtender){
    JqLiteExtender.extendPrototype();
  }));

  it('should filter contents by tag name div', function () {
    var jql = angular.element('<div></div><foo></foo>');
    var filtered = jql.$contents('div');

    expect(filtered.length).toBe(1);
    expect(filtered[0].localName).toBe('div');
  });

  it('should filter contents by tag name *', function () {
    var jql = angular.element('<div></div><foo></foo>');
    var filtered = jql.$contents('*');

    expect(filtered.length).toBe(2);
    expect(filtered[0].localName).toBe('div');
    expect(filtered[1].localName).toBe('foo');
  });

  it('should filter contents by attribute marker', function () {
    var jql = angular.element('<div not-marker> </div> <foo marker></foo> ');
    var filtered = jql.$contents('*[marker]');

    expect(filtered.length).toBe(1);
    expect(filtered[0].localName).toBe('foo');
  });

  it('should find deep nodes by attribute marker', function () {
    var jql = angular.element('<div><div not-marker></div><foo marker></foo></div>');
    var filtered = jql.$find('*[marker]');

    expect(filtered.length).toBe(1);
    expect(filtered[0].localName).toBe('foo');
  });
});