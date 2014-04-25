'use strict';

/**
 * This is a layout container that fills a space with a header/body/footer template.  The header and footer heights
 * are determined by their contents, and the body container, in between, fills the remaining the available height.
 * The size of the header and footer are determined by their contents, and the body div in the middle stretches to
 * fill the space between them. This is browser backward compatible because it uses javascript dom manipulation to
 * set the body height.  This version calculates its size after all its transcluded contents have completed their
 * post-linking, and it does not support dynamic resizing.
 */
angular.module('mass.widgets')
  .directive('verticalFillLayout', [function VerticalFillLayout() {

    return {
      template: '<div class="vfl vfl-container"><div class="vfl vfl-header"></div><div class="vfl vfl-body"></div><div class="vfl vfl-footer"></div></div>',
      restrict: 'E',
      replace: true,
      transclude: true,

      /**
       * This controller transcludes multiple divs.
       */
      controller: ['$scope', '$element', '$transclude', function ($scope, $element, $transclude) {
        $transclude(function(clone) {
          var headerContainer = $element.$find('div.vfl.vfl-header');
          var bodyContainer = $element.$find('div.vfl.vfl-body');
          var footerContainer = $element.$find('div.vfl.vfl-footer');

          var headerContent = clone.$contents('*[transclude-header]');
          var bodyContent = clone.$contents('*[transclude-body]');
          var footerContent = clone.$contents('*[transclude-footer]');

          Preconditions.checkArgument(headerContent.length === 1, 'Expected 1 transclude-header element, but found %s', headerContent.length);
          Preconditions.checkArgument(bodyContent.length === 1, 'Expected 1 transclude-body element, but found %s', bodyContent.length);
          Preconditions.checkArgument(footerContent.length === 1, 'Expected 1 transclude-footer element, but found %s', footerContent.length);

          headerContainer.append(headerContent);
          footerContainer.append(footerContent);
          bodyContainer.append(bodyContent);
        });
      }],

      link: function($scope, $element, $attr, $multiTranscludeCtrl) {
        Preconditions.checkArgument(!!$multiTranscludeCtrl, 'Missing multi-transclude controller.');
        var multiTranscludeCtrl = $scope.multiTranscludeCtrl;
        Preconditions.checkArgument(!!multiTranscludeCtrl, 'Missing multi-transclude controller object.');

        var resize = function () {
          var rootContainer = $element.$contents('div.vfl.vfl-container')[0];
          var headerContainer = $element.$find('div.vfl.vfl-header')[0];
          var bodyContainer = $element.$find('div.vfl.vfl-body')[0];
          var footerContainer = $element.$find('div.vfl.vfl-footer')[0];

          var rootHeight = rootContainer.offsetHeight;
          var headerHeight = headerContainer.offsetHeight;
          var footerHeight = footerContainer.offsetHeight;

          var bodyHeight = rootHeight - (headerHeight + footerHeight);

          bodyContainer.style.height = bodyHeight.toString() + 'px';
        };

        $scope.multiTranscludeCtrl.addTranscludePostLinker(resize);
      }

    };
  }]);
