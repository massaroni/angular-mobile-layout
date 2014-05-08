'use strict';

/**
 * This is a layout container that fills a space with a header/body/footer template.  The header and footer heights
 * are determined by their contents, and the body container, in between, fills the remaining the available height.
 * The size of the header and footer are determined by their contents, and the body div in the middle stretches to
 * fill the space between them. This is browser backward compatible because it uses javascript dom manipulation to
 * set the body height.  This version calculates its size after all its transcluded contents have completed their
 * post-linking, and it does not support dynamic resizing.
 */
angular.module('mobile.layout')
  .directive('verticalFillLayout', [function VerticalFillLayout() {

    var getJQLMountPoints = function (element) {
      var jqlContainer = element.$contents('div.vfl.vfl-container');
      var mountPoints = jqlContainer.children();

      var jqlHeader = mountPoints.$contents('div.vfl.vfl-header');
      var jqlBody = mountPoints.$contents('div.vfl.vfl-body');
      var jqlFooter = mountPoints.$contents('div.vfl.vfl-footer');

      return {container: jqlContainer, header: jqlHeader, body: jqlBody, footer: jqlFooter};
    };

    return {
      template: '<div class="vfl vfl-container"><div class="vfl vfl-header"></div><div class="vfl vfl-body"></div><div class="vfl vfl-footer"></div></div>',
      restrict: 'E',
      replace: true,
      transclude: true,

      /**
       * This controller transcludes multiple divs.
       */
      controller: ['$scope', '$element', '$transclude', function ($scope, $element, $transclude) {
        var multiTranscludeCtrl = $scope.multiTranscludeCtrl;
        Preconditions.checkArgument(!!multiTranscludeCtrl, 'Missing multi-transclude controller object.');

        var resize = function () {
          var mountPoints = getJQLMountPoints($element);
          var domContainer = mountPoints.container[0];
          var domHeader = mountPoints.header[0];
          var domBody = mountPoints.body[0];
          var domFooter = mountPoints.footer[0];

          var rootHeight = domContainer.offsetHeight;
          var headerHeight = domHeader.offsetHeight;
          var footerHeight = domFooter.offsetHeight;

          var bodyHeight = rootHeight - (headerHeight + footerHeight);

          domBody.style.height = bodyHeight.toString() + 'px';
        };

        multiTranscludeCtrl.addTranscludePostLinker(resize);

        $transclude(function (clone) {
          var mountPoints = getJQLMountPoints($element);

          var headerContainer = mountPoints.header;
          var bodyContainer = mountPoints.body;
          var footerContainer = mountPoints.footer;

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
      }]

    };
  }]);
