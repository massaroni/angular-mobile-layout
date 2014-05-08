'use strict';

describe('Directives: transclude-footer, transclude-header', function () {

  // testing priority linking, with both the default priority and an explicit priority 0, so that
  // we can verify that they act the same way

  angular.module('mobile.layout')
    .directive('priorityZero', [function () {
      return {
        restrict: 'E',
        replace: true,
        priority: 0,
        link: function ($scope) {
          $scope.inPriorityZeroLinker();
        }
      };
    }]);

  angular.module('mobile.layout')
    .directive('defaultPriority', [function () {
      return {
        restrict: 'E',
        replace: true,
        link: function ($scope) {
          $scope.inDefaultPriorityLinker();
        }
      };
    }]);

  beforeEach(module('mobile.layout', function () {
  }));

  var registerPriority0Test = function (annotationName) {
    it('(priority 0) (' + annotationName + ') should always run its post linker after the original directive\'s post linker, so that the element\'s compiled height is available for the body height calculation.',
      inject(function ($rootScope, $compile, $document) {

        var element = angular.element('<priority-zero ' + annotationName + '></priority-zero>');

        // mock out the scope
        var scope = $rootScope.$new();

        var eventLog = [];

        // mock out the Multi Transclude Controller
        scope.multiTranscludeCtrl = {
          transcludePostLinkComplete: function () {
            eventLog.push('footer linker');
          }
        };

        scope.inPriorityZeroLinker = function () {
          eventLog.push('priority zero linker');
        };

        //compile the element into a function to process the view.
        var compiled = $compile(element);

        //run the compiled view.
        compiled(scope);

        // digest the scope
        scope.$digest();
        scope.$apply();

        // verify that the directives linked in the expected order
        expect(eventLog[0]).toBe('priority zero linker');
        expect(eventLog[1]).toBe('footer linker');
        expect(eventLog.length).toBe(2);
      }));
  };
  registerPriority0Test('transclude-footer');
  registerPriority0Test('transclude-header');

  var registerDefaultPriorityTest = function (annotationName) {
    it('(default priority) (' + annotationName + ') should always run its post linker after the original directive\'s post linker, so that the element\'s compiled height is available for the body height calculation.',
      inject(function ($rootScope, $compile, $document) {

        var element = angular.element('<default-priority ' + annotationName + '></default-priority>');

        // mock out the scope
        var scope = $rootScope.$new();

        var eventLog = [];

        // mock out the Multi Transclude Controller
        scope.multiTranscludeCtrl = {
          transcludePostLinkComplete: function () {
            eventLog.push('footer linker');
          }
        };

        scope.inDefaultPriorityLinker = function () {
          eventLog.push('default priority linker');
        };

        //compile the element into a function to process the view.
        var compiled = $compile(element);

        //run the compiled view.
        compiled(scope);

        // digest the scope
        scope.$digest();
        scope.$apply();

        // verify that the directives linked in the expected order
        expect(eventLog[0]).toBe('default priority linker');
        expect(eventLog[1]).toBe('footer linker');
        expect(eventLog.length).toBe(2);
      }));
  };
  registerDefaultPriorityTest('transclude-header');
  registerDefaultPriorityTest('transclude-footer');

});