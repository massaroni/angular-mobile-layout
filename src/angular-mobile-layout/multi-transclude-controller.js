'use strict';

angular.module('mass.widgets')
  .controller('multiTransclude', ['$scope', '$exceptionHandler', function ($scope, $exceptionHandler) {
    var transcludePostLinkers = [];

    $scope.multiTranscludeCtrl = {
      addTranscludePostLinker: function (callback) {
        Preconditions.checkArgument(_.isFunction(callback), 'Expected callback function, but was %s', callback);
        transcludePostLinkers.push(callback);
      },

      doTranscludePostLink: function () {

        for (var i = 0; i < transcludePostLinkers.length; i++) {
          var postlinker = transcludePostLinkers[i];

          try {
            postlinker();
          } catch (e) {
            $exceptionHandler(e);
          }
        }

      }
    };

  }])
;
