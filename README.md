# AngularJS directives for mobile layouts.

Make a mobile layout with a header/body/footer template, with just one directive. The ```<vertical-fill-layout>``` directive positions
3 transcluded elements into a header/body/footer template, so that the height of the body consumes all available space
between the header and footer, on any screen size.  It's all done in simple javascript, so that it's backward
compatible with old iPhones and Androids, and it fits all screen sizes without any extra configuration. The body height
is fixed, making it a great container for a scrollable ```<ion-content>``` ([Ionic Framework](http://ionicframework.com/docs/api/directive/ionContent/))
or an ```ng-iscroll``` div ([ng-iScroll](https://github.com/ibspoof/ng-iScroll)).

## Dependencies
See `bower.json` for a full list / more details.

## Install
1. download the files
	1. Bower
		1. add `"angular-mobile-layout": "latest"` to your `bower.json` file then run `bower install` OR run `bower install angular-mobile-layout`
2. include the files in your app
	1. `angular-mobile-layout.min.js` OR `angular-mobile-layout.js`
	2. `angular-mobile-layout.min.css` OR `angular-mobile-layout.css`
3. include the module in angular (i.e. in `app.js`) - `mobile.layout`

    ex:
>
```javascript
angular.module('myCordovaApp', ['mobile.layout'])
```

## Documentation

### vertical-fill-layout directive

This is a layout container that fills a space with a header/body/footer template.  The header and footer heights
are determined by their contents, and the body container, in between, fills the remaining available height, between the
header and footer. The size of the header and footer are determined by their contents, and the body div in the middle
stretches vertically, to fill the space between them.

I use this in other projects for framing scrollable content inside the body container, because one of the biggest
challenges with setting up a scrollable div is fixing the size of the top level "viewport" div, and that challenge gets
harder when you have to support all device's screen sizes, and when you want to decouple your header/footer layout from
this body-size problem, and the problem gets harder when you want full backward compatibility with old devices, so you
can't rely on the newest css3 features.

This implementation has a few advantages over the current popular ways to do this: The layout is totally encapsulated in
one directive, so you don't have to build markup outside your ng-view, like in angular-mobile-frame, so you can build
everything within the angularjs world. This is browser backward compatible because it uses javascript dom manipulation
to programmatically set the body div's height, so you're not limited to browsers that support the newest css3 flex
layout feature.


This version calculates its size after all its transcluded contents have completed their post-linking, and it does
not support dynamic resizing, when the browser window or containing div resizes itself.

See comments in `angular-mobile-layout.js` for more details.
https://github.com/massaroni/angular-mobile-layout/blob/master/release/angular-mobile-layout.js

Requirements:

**(1)** Transclude 3 elements.  They can be primitive html or your own angular directives. They must be siblings,
nested directly under the <vertical-fill-layout> tag. Do not encapsulate them within a div of their own.

**(2)** Annotate your header element with the **transclude-header** attribute.

**(3)** Annotate your body element with the **transclude-body** attribute.

**(4)** Annotate your footer element with the **transclude-footer** attribute.

**(5)** Provide the **multiTransclude** controller to vertical-fill-layout. Angular links the wrapped transcluded directives after linking the transcludable wrapper directive, and their scopes are siblings, so the multiTransclude controller provides for communication between them.

Here's an example of a directive's template that uses vertical-fill-layout:

>
```html
<div class="my-example-directive">
    <div class="fill" ng-controller="multiTransclude">
        <vertical-fill-layout>
            <div transclude-header>
                <h2>Transcluded elements can be divs or primitive html elements.</h2>
            </div>
            <my-scrollable-directive transclude-body></my-scrollable-directive>
            <my-footer-directive transclude-footer>Transcluded elements could also be angular directives.</my-footer-directive>
        </vertical-fill-layout>
    </div>
</div>
```

