'use strict';

describe('Directive: vertical-fill-layout', function () {
  var vflCssTag = '<style type="text/css">' +
    '.vfl {' +
    '  width: 100%;' +
    '  display: block;' +
    '  position: relative;' +
    '  overflow: hidden;' +
    '}' +
    '' +
    '.fill {' +
    '  display: block;' +
    '  position: relative;' +
    '  height: 100%;' +
    '  width: 100%;' +
    '  top: 0;' +
    '  bottom: 0;' +
    '  overflow: hidden;' +
    '}' +
    '' +
    '.vfl-container {' +
    '  display: block;' +
    '  position: relative;' +
    '  height: 100%;' +
    '  width: 100%;' +
    '  top: 0;' +
    '  bottom: 0;' +
    '  overflow: hidden;' +
    '' +
    '  .vfl-header {' +
    '    top: 0;' +
    '  }' +
    '}' +
    '</style>';

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
      var callCount = mockMultiTranscludeCtrl.transcludePostLinkComplete.callCount;
      switch (callCount) {
        case 1:
          return;
        case 2:
          resizeCallback();
          return;
        default:
          throw 'Unexpected call count for transcludePostLinkComplete: ' + callCount;
      }
    };
    var setResizeCallback = function (callback) {
      expect(!!callback).toBe(true);
      resizeCallback = callback;
    };

    var mockMultiTranscludeCtrl = {};

    mockMultiTranscludeCtrl.transcludePostLinkComplete = jasmine.createSpy('transcludePostLinkComplete').andCallFake(callResizeCallback);
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
    expect(mockMultiTranscludeCtrl.transcludePostLinkComplete.callCount).toBe(2);
    expect(mockMultiTranscludeCtrl.addTranscludePostLinker.callCount).toBe(1);

    // verify that vertical-fill-layout calculated the expected body height and assigned it
    var jqlVflBodyContainer = element.$find('div.vfl.vfl-body');
    expect(!!jqlVflBodyContainer).toBe(true);

    var domVflBodyContainer = jqlVflBodyContainer[0];
    expect(!!domVflBodyContainer).toBe(true);

    expect(domVflBodyContainer.offsetHeight).toBe(70);
    expect(domVflBodyContainer.style.height).toBe('70px');
  }));


  it('should support nested vfl\'s under the same multi-transclude controller.', inject(function ($rootScope, $compile, $document) {
    // make sure the body has at least 100px height
    var jqlBody = $document.find('body');
    var body = jqlBody[0];
    body.style.height = '100px';
    body.style.width = '100px';

    var element = angular.element(
        vflCssTag +
        '<vertical-fill-layout>' +
        '  <div style="height:10px" transclude-header>Header</div>' +
        '  <vertical-fill-layout transclude-body>' +
        '    <div style="height:11px" transclude-header>Nested Header</div>' +
        '    <div class="nested" transclude-body>Nested Body</div>' +
        '    <div style="height:7px" transclude-footer>Nested Footer</div>' +
        '  </vertical-fill-layout>' +
        '  <div style="height:20px" transclude-footer>Footer<br/>More Footer</div>' +
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
    var topLevelResizeCallback = null;
    var nestedResizeCallback = null;

    var callResizeCallback = function () {
      var callCount = mockMultiTranscludeCtrl.transcludePostLinkComplete.callCount;

      if (callCount < 4) {
        return;
      } else if (callCount === 4) {
        topLevelResizeCallback();
        nestedResizeCallback();
      } else {
        throw 'Unexpected call count for transcludePostLinkComplete: ' + callCount;
      }
    };

    var setResizeCallback = function (callback) {
      expect(!!callback).toBe(true);

      if (!topLevelResizeCallback) {
        topLevelResizeCallback = callback;
      } else if (!nestedResizeCallback) {
        nestedResizeCallback = callback;
      } else {
        throw 'All resize callbacks are already assigned.';
      }
    };

    var mockMultiTranscludeCtrl = {};

    mockMultiTranscludeCtrl.transcludePostLinkComplete = jasmine.createSpy('transcludePostLinkComplete').andCallFake(callResizeCallback);
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
    expect(mockMultiTranscludeCtrl.transcludePostLinkComplete.callCount).toBe(4);
    expect(mockMultiTranscludeCtrl.addTranscludePostLinker.callCount).toBe(2);

    // verify the top level vertical-fill-layout calculated the expected body height and assigned it
    var jqlVflBodyContainerTopLevel = element.$children('div.vfl-body');
    expect(!!jqlVflBodyContainerTopLevel).toBe(true);

    var domVflBodyContainerTopLevel = jqlVflBodyContainerTopLevel[0];
    expect(!!domVflBodyContainerTopLevel).toBe(true);

    expect(domVflBodyContainerTopLevel.offsetHeight).toBe(70);
    expect(domVflBodyContainerTopLevel.style.height).toBe('70px');

    // verify the nested vertical-fill-layout calculated the expected body height and assigned it
    var jqlVflBodyContainerNested = element.$find('div.nested');
    expect(!!jqlVflBodyContainerNested).toBe(true);

    var domVflBodyContainerNested = jqlVflBodyContainerNested[0].parentElement;
    expect(!!domVflBodyContainerNested).toBe(true);

    expect(domVflBodyContainerNested.offsetHeight).toBe(52);
    expect(domVflBodyContainerNested.style.height).toBe('52px');

  }));
});