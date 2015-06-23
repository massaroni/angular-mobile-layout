// Source: src/release.prefix
(function (window, document) {
  'use strict';

// Source: src/release.suffix
})(window, document);  // Source: src/utils/utils.js
  var Js = {};
  
  /**
   * shorthand for "is null or undefined"
   * @param x
   */
  Js.isNothing = function (x) {
    return x === undefined || x === null;
  };
  
  /**
   * shorthand for "is not nothing"
   * @param x
   * @returns {boolean}
   */
  Js.isSomething = function (x) {
    return !Js.isNothing(x);
  };
  
  Js.isArray = function (x) {
    return x instanceof Array;
  };
  
  Js.isObject = function (o) {
    return o !== null && typeof o === 'object' && !(o instanceof Array);
  };
  
  Js.isNumber = function (n) {
    return typeof n === 'number' && !isNaN(n) && isFinite(n);
  };
  
  /**
   * Check that a string or number is an integer.
   * Note that you can't necessarily to math with all integers.
   * String integers and number integers have different + operators (concat vs add).
   * We have many integer ids, so this is useful to check for valid ids.
   *
   * @param n
   * @returns {boolean} true if n is a string or number representing an integer.
   * strings with dots and letters evaluate to false, and objects are false.
   */
  Js.isInteger = function (n) {
    if (n === null) {
      return false;
    }
  
    if (isNaN(n)) {
      return false;
    }
  
    return parseInt(n, 10) === parseFloat(n);
  };
  
  /**
   * Check that a number is an integer. This will reject strings.
   * Note that you can't necessarily do math with all integers.
   * String integers and number integers have different + operators (concat vs add).
   * We have many integer ids, so this is useful to check for valid ids.
   *
   * @param n
   * @returns {boolean} true if n is a string or number representing an integer.
   */
  Js.isIntegerNumber = function (n) {
    if ((typeof n) !== 'number') {
      return false;
    }
  
    return Js.isInteger(n);
  };
  
  /**
   * Check that a string or number is an integer, and it's > 0.
   * Note that you can't necessarily to math with all integers.
   * String integers and number integers have different + operators (concat vs add).
   * We have many integer ids, so this is useful to check for valid ids.
   *
   * @param n
   * @returns {boolean} true if n is a string or number representing an integer.
   * strings with dots and letters evaluate to false, and objects are false.
   */
  Js.isPositiveInteger = function (n) {
    if (!Js.isInteger(n)) {
      return false;
    }
  
    return n > 0;
  };
  
  /**
   * Inspired by angular.isBoolean(), which is inaccessible.
   *
   * @param b
   * @returns {boolean}
   */
  Js.isBoolean = function (b) {
    return typeof b === 'boolean';
  };
  
  Js.isString = function (s) {
    if (s === null) {
      return false;
    }
  
    if (s === undefined) {
      return false;
    }
  
    return typeof s === 'string';
  };
  
  Js.isFunction = function (f) {
    return typeof f === 'function';
  };
  
  Js.isEmptyString = function(s) {
    return !Js.isString(s) || s.length === 0;
  };
  
  Js.formatString = function () {
    var str = arguments[0];
  
    if (!Js.isString(str)) {
      throw 'Expected first argument to be the string format, but was ' + str;
    }
  
    for (var i = 1; i < arguments.length; i++) {
      var arg = arguments[i];
      str = str.replace('%s', arg);
    }
  
    return str;
  };
  
  Js.printException = function (ex) {
    if (!(ex instanceof Error)) {
      return 'Expected an Error, but was ' + ex;
    }
  
    return ex.message + '\n' + ex.stack;
  };
  
  
  var Preconditions = {};
  
  /**
   * Throw an error if a condition evaluates to false, like in Guava.
   * The first argument is the condition. The second argument is the error message. All other arguments are used in formatting the error message argument.
   * The error message can be templated, according to Js.formatString(), so this function takes any number of trailing arguments.
   *
   * usage: Preconditions.checkArgument(x === y, 'Bad argument %s x should be y.', 'because')
   */
  Preconditions.check = function (isGood, checkTypeMsg, errorMsg, errorMsgArgs) {
    if (!!isGood || isGood === 0) {
      return;
    }
  
    if (!errorMsg) {
      throw new Error(checkTypeMsg);
    }
  
    if (!Js.isString(errorMsg)) {
      console.error('Expected a string as the second argument, but was ' + errorMsg);
      return;
    }
  
    if (!checkTypeMsg) {
      checkTypeMsg = 'Error: ';
    }
  
    var formattedErrorMsg = Js.formatString.apply(null, errorMsgArgs);
    throw new Error(checkTypeMsg + formattedErrorMsg);
  };
  
  Preconditions.checkArgument = function (isGood, errorMsg) {
    var args = Array.prototype.slice.call(arguments);
    var errorMsgArgs = args.slice(1, args.length);
  
    Preconditions.check(isGood, 'Illegal Argument: ', errorMsg, errorMsgArgs);
  };
  
  Preconditions.checkState = function (isGood, errorMsg) {
    var args = Array.prototype.slice.call(arguments);
    var errorMsgArgs = args.slice(1, args.length);
  
    Preconditions.check(isGood, 'Illegal State: ', errorMsg, errorMsgArgs);
  };
    // Source: src/angular-mobile-layout/js/mobile-layout-module.js
  angular.module('mobile.layout', [])
  
    .provider('JqLiteExtender', function JqLiteExtender() {
      var extender = this;
  
      this.extendPrototype = function () {
  
        angular.element.prototype.$forEach = function (callback) {
          for (var i = 0; i < this.length; i++) {
            callback(this[i]);
          }
        };
  
        angular.element.prototype.$filter = function (predicate) {
          var matches = [];
  
          this.$forEach(function (node) {
            if (!!(predicate(node))) {
              matches.push(node);
            }
          });
  
          return new angular.element(matches);
        };
  
        var attributeSelectorPattern = /\[([\w\-])*\]/g;
        var tagNamePattern = /([\w\-]|\*)+/g;
  
        /**
         * Get the attribute name out of the [wrapped] attribute selector string.
         *
         * @param selector
         * @returns {string}
         */
        var unwrapAttributeSelector = function (selector) {
          Preconditions.checkArgument(selector.length > 2, 'Invalid attribute selector: %s', selector);
          return selector.substring(1, selector.length - 1);
        };
  
        var parseTagSelector = function (tagSelector) {
          var tagName;
  
          if (tagSelector.charAt(0) === '[') {
            tagName = '*';
          } else {
            var words = tagSelector.match(tagNamePattern);
            if (!!words) {
              tagName = words[0];
            } else {
              tagName = '*';
            }
          }
  
          var selectors = tagSelector.match(attributeSelectorPattern);
  
          var attributeSelector;
  
          if (!!selectors) {
            Preconditions.checkArgument(selectors.length === 1, 'At most 1 attribute selector supported, but found %s selectors in %s', selectors.length, tagSelector);
            attributeSelector = unwrapAttributeSelector(selectors[0]);
          }
  
          return {tag: tagName, attr: attributeSelector};
        };
  
        var isEmptyJQL = function (jql) {
          if (!jql) {
            return true;
          }
  
          return jql.length < 1;
        };
  
        var Selector = function Selector(selector) {
          Preconditions.checkArgument(Js.isString(selector), 'Not a selector: %s', selector);
  
          var clean = selector.trim();
          var selectors = clean.split('.');
          Preconditions.checkArgument(selectors.length >= 1, 'Invalid selector: %s', selector);
  
          var tagName = selectors.shift();
  
          if (Js.isEmptyString(tagName)) {
            tagName = '*';
          }
  
          this.tagSelector = parseTagSelector(tagName);
          this.classNames = selectors;
        };
  
        Selector.prototype = {};
        Selector.prototype.getTagName = function () {
          return this.tagSelector.tag;
        };
  
        Selector.prototype.filterByTagName = function (jql) {
          if (isEmptyJQL(jql)) {
            return jql;
          }
  
          var tagName = this.tagSelector.tag;
  
          if (tagName === '*') {
            return jql;
          }
  
          return jql.$filter(function (node) {
            return node.localName === tagName;
          });
        };
  
        Selector.prototype.filterByClass = function (jql) {
          if (isEmptyJQL(jql)) {
            return jql;
          }
  
          var requiredClasses = this.classNames;
          if (requiredClasses.length < 1) {
            return jql;
          }
  
          var hasClasses = function (node) {
            var classList = node.classList;
  
            if(!classList) {
                classList = classNames.split(' ');
            }
  
            for (var i = 0; i < requiredClasses.length; i++) {
              if (classList.contains && !classList.contains(requiredClasses[i]) ||
                  classList.some && !classList.some(requiredClasses[i])) {
                return false;
              }
            }
  
            return true;
          };
  
          return jql.$filter(hasClasses);
        };
  
        Selector.prototype.filterByAttribute = function (jql) {
          if (isEmptyJQL(jql)) {
            return jql;
          }
  
          var tagSelector = this.tagSelector;
          if (!(tagSelector.attr)) {
            return jql;
          }
  
          var hasAttribute = function (node) {
            return node.nodeType === 1 && node.hasAttribute(tagSelector.attr);
          };
  
          return jql.$filter(hasAttribute);
        };
  
        /**
         * Supports more css selector syntax than the default JQLite.
         * This supports dot-class selectors and at most 1 attribute selector.
         *
         * @param selectorString - ex:  div[foo-attribute].class-1.class-2
         * @returns {*}
         */
        angular.element.prototype.$find = function (selectorString) {
          var selector = new Selector(selectorString);
  
          var nodes = this.find(selector.getTagName());
  
          if (isEmptyJQL(nodes)) {
            return nodes;
          }
  
          var classFiltered = selector.filterByClass(nodes);
          var attrFiltered = selector.filterByAttribute(classFiltered);
  
          return attrFiltered;
        };
  
        /**
         * Supports expanded selector syntax, like $find(). This provides a
         * better performance profile than find(), if you're only searching
         * through top level nodes, because filter is recursive and
         *
         * @param selectorString
         * @returns {*}
         */
        angular.element.prototype.$contents = function (selectorString) {
          var selector = new Selector(selectorString);
  
          var nodes = selector.filterByTagName(this);
  
          if (isEmptyJQL(nodes)) {
            return nodes;
          }
  
          var classFiltered = selector.filterByClass(nodes);
          var attrFiltered = selector.filterByAttribute(classFiltered);
  
          return attrFiltered;
        };
  
        angular.element.prototype.$children = function (selectorString) {
          var children = this.children();
  
          if (isEmptyJQL(children)) {
            return children;
          }
  
          return children.$contents(selectorString);
        };
  
      };
  
      this.$get = [function JqLiteExtenderFactory() {
        return extender;
      }];
    })
  
    .config(['JqLiteExtenderProvider', function (JqLiteExtender) {
      JqLiteExtender.extendPrototype();
    }]);
    // Source: src/angular-mobile-layout/js/multi-transclude-controller.js
  angular.module('mobile.layout')
    .controller('multiTransclude', ['$scope', '$exceptionHandler', function ($scope, $exceptionHandler) {
      var transcludePostLinkers = [];
      var completedPostLinks = 0, transcludeElements = 0;
  
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
  
          if (completedPostLinks >= transcludeElements) {
            doPostLinking();
          }
        },
        
        notifyOfExistence: function() {
          transcludeElements++;
        }
      };
  
    }])
  ;
    // Source: src/angular-mobile-layout/js/transclude-footer-directive.js
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
    // Source: src/angular-mobile-layout/js/transclude-header-directive.js
  /**
   * This directive notifies the multi-transclude controller that it's done post-linking. The multi-transclude
   * controller will set the body div size, when both the header and footer are done post-linking.
   */
  angular.module('mobile.layout')
    .directive('transcludeHeader', [function TranscludeHeader() {
  
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
    // Source: src/angular-mobile-layout/js/vertical-fill-layout-directive.js
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
              var domBody = mountPoints.body[0];
              var rootHeight = 0, headerHeight = 0, footerHeight = 0;
  
              try {
                rootHeight = mountPoints.container[0].offsetHeight;
              } catch (e) {}
              try {
                headerHeight = mountPoints.header[0].offsetHeight;
              } catch (e) {}
              try {
                footerHeight = mountPoints.footer[0].offsetHeight;
              } catch (e) {}
  
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
  
            if(Js.isSomething(headerContent[0])) {
              headerContainer.append(headerContent);
              multiTranscludeCtrl.notifyOfExistence();
            }
            if(Js.isSomething(footerContent[0])) {
              footerContainer.append(footerContent);
              multiTranscludeCtrl.notifyOfExistence();
            }
            if(Js.isSomething(bodyContent[0])) {
              bodyContainer.append(bodyContent);
            }
          });
        }]
  
      };
    }]);
  