angular.module('img-src-ondemand')
.factory('screenEdgeFn', function($window) {
  return function() {
    return $window.pageYOffset + $window.innerHeight;
  };
});
