# img-src-ondemand

Angular module that delays image loading to when it is about to appear on the screen.

To be more specific, it sets the `src` attribute on `img` tags just before you scroll
down to make it appear on the screen.


## Contents list

<!-- MarkdownTOC depth=0 -->

- [Usage](#usage)
    - [Include module](#include-module)
    - [Use it](#use-it)
- [About listeners](#about-listeners)
- [Data prefixes](#data-prefixes)
- [Angular 1.3+](#angular-13)

<!-- /MarkdownTOC -->


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
