'use strict';

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

      var parseTagSelector = function (tagSelector) {
        var selectors = tagSelector.split('[');

        if (selectors.length === 1) {
          return {tag: selectors[0]};
        }

        Preconditions.checkArgument(selectors.length === 2, 'Expected 1 attr and 1 tag selector, but was: %s', selectors);

        var attributeSelector = selectors[1];
        Preconditions.checkArgument(attributeSelector[attributeSelector.length - 1] === ']', 'Malformed attribute selector.');

        var cleanAttrSelector = attributeSelector.substring(0, attributeSelector.length - 1);

        return {tag: selectors[0], attr: cleanAttrSelector};
      };

      var isEmptyJQL = function (jql) {
        if (!jql) {
          return true;
        }

        return jql.length < 1;
      };

      var Selector = function Selector(selector) {
        Preconditions.checkArgument(Js.isString(selector), 'Not a selector: %s', selector);

        var selectors = selector.split('.');
        Preconditions.checkArgument(selectors.length >= 1, 'Invalid selector: %s', selector);

        var tagName = selectors.shift();
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

          for (var i = 0; i < requiredClasses.length; i++) {
            if (!(classList.contains(requiredClasses[i]))) {
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
