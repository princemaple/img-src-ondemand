# img-src-ondemand

## :warning: I wrote a replacement for this module some time ago, [Scroll Trigger](https://github.com/princemaple/scroll-trigger), the new one not only covers all the functionality `img-src-ondemand` provides, it also gives you way more. Hence, this module is no longer maintained, please migrate to `scroll-trigger` (easy, see [this test]( https://github.com/princemaple/scroll-trigger/blob/master/test/test_img_src_ondemand.html))

Angular module that delays image loading to when it is about to appear on the screen.

To be more specific, it sets the `src` attribute on `img` tags just before you scroll
down to make it appear on the screen.

[View demo](http://plnkr.co/edit/jUswgyfUneWdnFVQjo4q?p=preview)


## Contents list

<!-- MarkdownTOC depth=0 -->

- [Changelog](#changelog)
    - [Dependency](#dependency)
- [Usage](#usage)
    - [Include module](#include-module)
    - [Use it](#use-it)
- [About listeners](#about-listeners)
- [Data prefixes](#data-prefixes)
- [Angular 1.3+](#angular-13)

<!-- /MarkdownTOC -->

## Changelog

* 1.5 extracted the factory into a provider, so you can set an offset to preload images

```js
app.config(['ImgSrcOndemandProvider', function(ImgSrcOndemandProvider) {
  ImgSrcOndemandProvider.offset(500);
}]);
```

More details can be found at [#1](https://github.com/princemaple/img-src-ondemand/issues/1)

* 1.4 added `.update` onto the service so image status check can be called programmatically

### Dependency

Starting from 1.3, `angular` is the only dependency of this package.
It used to require `jQuery` and `lodash` in `<1.3`.
I do plan to have them as optional dependency though, to allow IE8 support.

## Usage

### Include module

```js
angular.module('your-module', ['img-src-ondemand']);
```

### Use it

```html
<img src-ondemand="/abc.png" alt="plain text">
<img src-ondemand="{{myImage.url}}" alt="interpolation">

<ul>
  <li ng-repeat="image in images">
    <img src-ondemand="{{image.url}}" alt="within ng-repeat">
  </li>
<ul>
```

**or**

```html
<ul>
  <li ng-repeat="image in images">
    <img src-var-ondemand="image.url" alt="with a variable">
  </li>
</ul>
```

## About listeners

> Even though angular mutates the attribute value when `image.url` changes,
the `src` attribute on the image will not change. This module was purely written
for loading images ondemand.

## Data prefixes

You can prefix the attribute with `data-` (i.e. `data-src-ondemand`) if you think
you will change to use another framework and ditch Angular in the future. Chances
are you will not use the same API, but if you do, you can look for this data attribute.

## Angular 1.3+

*The followings are legit when using AngularJS 1.3+*

```html
<img src-ondemand="{{::image.url}}" alt="interpolate once">
<img src-var-ondemand="::image.url" alt="bind once">
```
