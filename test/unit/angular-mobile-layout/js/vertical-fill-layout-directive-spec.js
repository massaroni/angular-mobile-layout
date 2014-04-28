'use strict';

describe('Directive: vertical-fill-layout', function () {

  beforeEach(module('mobile.layout', function () {
  }));

  it('should set the body height to fit in between the header and footer.', inject(function ($rootScope, $compile, $document) {
    // make sure the body has at least 100px height
    var jqlBody = $document.find('body');
    var body = jqlBody[0];
    body.style.height = '100px';
    body.style.width = '100px';

    var element = angular.element(
        '<vertical-fill-layout>' +
        '<div style="height:10px" transclude-header>Header</div>' +
        '<div transclude-body>Body</div>' +
        '<div style="height:20px" transclude-footer>Footer<br/>More Footer</div>' +
        '</vertical-fill-layout>');

    // assign height and width, so that we don't have to load our css
    element.css('height', '100px');
    element.css('weight', '100px');

    // a floating element will never get a height dimension,
    // so we have to add it to the document body
    jqlBody.append(element);

    // mock out the scope
    var scope = $rootScope.$new();

    // mock out the Multi Transclude Controller
    var resizeCallback = null;
    var callResizeCallback = function () {
      resizeCallback();
    };
    var setResizeCallback = function (callback) {
      expect(!!callback).toBe(true);
      resizeCallback = callback;
    };

    var mockMultiTranscludeCtrl = {};

    mockMultiTranscludeCtrl.doTranscludePostLink = jasmine.createSpy('doTranscludePostLink').andCallFake(callResizeCallback);
    mockMultiTranscludeCtrl.addTranscludePostLinker = jasmine.createSpy('addTranscludePostLinker').andCallFake(setResizeCallback);

    scope.multiTranscludeCtrl = mockMultiTranscludeCtrl;

    //compile the element into a function to process the view.
    var compiled = $compile(element);

    //run the compiled view.
    compiled(scope);

    // digest the scope
    scope.$digest();
    scope.$apply();

    // verify that the directives called the controller functions
    expect(mockMultiTranscludeCtrl.doTranscludePostLink.callCount).toBe(1);
    expect(mockMultiTranscludeCtrl.addTranscludePostLinker.callCount).toBe(1);

    // verify that vertical-fill-layout calculated the expected body height and assigned it
    var jqlVflBodyContainer = element.$find('div.vfl.vfl-body');
    expect(!!jqlVflBodyContainer).toBe(true);

    var domVflBodyContainer = jqlVflBodyContainer[0];
    expect(!!domVflBodyContainer).toBe(true);

    expect(domVflBodyContainer.offsetHeight).toBe(70);
    expect(domVflBodyContainer.style.height).toBe('70px');
  }));

});