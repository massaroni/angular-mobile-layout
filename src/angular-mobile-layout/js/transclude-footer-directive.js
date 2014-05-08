'use strict';

/**
 * This directive notifies the multi-transclude controller that it's done post-linking. The multi-transclude
 * controller will set the body div size, when both the header and footer are done post-linking.
 *
 * This directive has a really low priority (high priority number), so that it's the last directive angular links.
 * This directive can get bolted onto an element that already has its own directive, and transclude-footer must be
 * the last directive angular links. The original directive's linker should compile the footer height that this
 * directive needs, to derive the fixed body height.
 */
angular.module('mobile.layout')
  .directive('transcludeFooter', [function TranscludeFooter() {

    return {
      restrict: 'A',
      replace: false,
      terminal: false,
      priority: 10000,

      link: function($scope) {
        Preconditions.checkState(!!($scope.multiTranscludeCtrl), 'Missing required multi-transclude controller object.');
        $scope.multiTranscludeCtrl.transcludePostLinkComplete();
      }

    };
  }]);
