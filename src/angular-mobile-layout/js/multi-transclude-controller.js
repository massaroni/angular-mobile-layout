'use strict';

angular.module('mobile.layout')
  .controller('multiTransclude', ['$scope', '$exceptionHandler', function ($scope, $exceptionHandler) {
    var transcludePostLinkers = [];
    var completedPostLinks = 0;

    var doPostLinking = function () {
      for (var i = 0; i < transcludePostLinkers.length; i++) {
        var postlinker = transcludePostLinkers[i];

        try {
          postlinker();
        } catch (e) {
          $exceptionHandler(e);
        }
      }
    };

    $scope.multiTranscludeCtrl = {
      addTranscludePostLinker: function (callback) {
        Preconditions.checkArgument(_.isFunction(callback), 'Expected callback function, but was %s', callback);
        transcludePostLinkers.push(callback);
      },

      transcludePostLinkComplete: function () {
        completedPostLinks++;

        if (completedPostLinks >= transcludePostLinkers.length * 2) {
          doPostLinking();
        }
      }
    };

  }])
;
