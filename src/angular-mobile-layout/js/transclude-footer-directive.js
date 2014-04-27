'use strict';

/**
 * This directive calls the multi-transclude post-linker, indicating the completion of all transcluded content's
 * post-linking, so you want your transclude-footer directive to be the last transcluded element.
 */
angular.module('mobile.layout')
  .directive('transcludeFooter', [function TranscludeFooter() {

    return {
      restrict: 'A',
      replace: false,

      link: function($scope) {
        Preconditions.checkState(!!($scope.multiTranscludeCtrl), 'Missing required multi-transclude controller object.');
        $scope.multiTranscludeCtrl.doTranscludePostLink();
      }

    };
  }]);
