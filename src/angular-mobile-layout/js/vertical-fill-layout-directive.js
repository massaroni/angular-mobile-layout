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
  .directive('verticalFillLayout', ['$timeout', function VerticalFillLayout($timeout) {

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
          $timeout(function () {
            var mountPoints = getJQLMountPoints($element);
            var domBody = mountPoints.body[0];

            var rootHeight = mountPoints.container.length > 0 ? mountPoints.container[0].offsetHeight : 0;
            var headerHeight = mountPoints.header.length > 0 ? mountPoints.header[0].offsetHeight : 0;
            var footerHeight = mountPoints.footer.length > 0 ? mountPoints.footer[0].offsetHeight : 0;

            var bodyHeight = rootHeight - (headerHeight + footerHeight);

            domBody.style.height = bodyHeight.toString() + 'px';
          }, 0);
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

          if (Js.isSomething(headerContent[0])) {
            headerContainer.append(headerContent);
            multiTranscludeCtrl.notifyOfExistence();
          }
          if (Js.isSomething(footerContent[0])) {
            footerContainer.append(footerContent);
            multiTranscludeCtrl.notifyOfExistence();
          }
          if (Js.isSomething(bodyContent[0])) {
            bodyContainer.append(bodyContent);
          }
        });
      }]

    };
  }]);
