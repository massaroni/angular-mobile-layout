'use strict';

describe('Provider: JqLiteExtender', function () {

  // load the service's module
  beforeEach(module('mobile.layout'));

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

  it('should support $children() access, with selectors', function () {
    var jqlElement = angular.element('<top><mid><bottom></bottom></mid></top><side><side-mid></side-mid></side>');

    var allChildren = jqlElement.children();
    expect(allChildren.length).toBe(2);
    expect(allChildren[0].localName).toBe('mid');
    expect(allChildren[1].localName).toBe('side-mid');

    var filteredChildren = jqlElement.$children('mid');
    expect(filteredChildren.length).toBe(1);
    expect(filteredChildren[0].localName).toBe('mid');
  });

  it('should support access to nested $children(), without requiring you to instantiate another angular.element()', function () {
    var jqlElement = angular.element('<top><mid><bottom></bottom></mid></top><side><side-mid></side-mid></side>');

    var mid = jqlElement.$children('mid');
    var bottom = mid.$children('bottom');

    expect(mid[0].localName).toBe('mid');
    expect(bottom[0].localName).toBe('bottom');
  });

  it('$children() should only search 1 level deep', function () {
    var jqlElement = angular.element('<top><mid><mid><mid></mid></mid></mid></top>');

    var mid = jqlElement.$children('mid');
    expect(mid.length).toBe(1);
    expect(mid[0].localName).toBe('mid');
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