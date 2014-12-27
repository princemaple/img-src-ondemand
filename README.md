# img-src-ondemand

Angular module that delays image loading to when it is about to appear on the screen

## Usage

### include module

```js
angular.module('your-module', ['img-src-ondemand']);
```

### use it

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
