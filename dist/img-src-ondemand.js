angular.module('img-src-ondemand', [])
.provider('ImgSrcOndemand', function() {
  var offset = 0;

  this.offset = function(customOffset) {
    if (angular.isUndefined(customOffset)) {
      return offset;
    } else if (angular.isNumber(customOffset)) {
      offset = customOffset;
    }
  };

  this.$get = ["$window", "offsetFn", "screenEdgeFn", "throttleFn", function($window, offsetFn, screenEdgeFn, throttleFn) {
    var initialScreenEdge = screenEdgeFn();

    var service = {
      buffer: {},
      listening: false,

      listen: function() {
        if (this.listening) { return; }

        angular.element($window).on('scroll', this.listener);
        this.listening = true;
      },

      update: function() {
        var screenEdge = screenEdgeFn() + offset;

        angular.forEach(service.buffer, function(elems, url, buffer){
          var seen = false;

          angular.forEach(elems, function(elem) {
            if (offsetFn(elem[0]).top < screenEdge) {
              seen = true;
            }
          });

          if (!seen) { return; }

          angular.forEach(elems, function(elem) {
            elem.attr('src', url);
          });

          delete buffer[url];
        });

        if (!Object.keys(service.buffer).length) {
          angular.element($window).off('scroll');
          service.listening = false;
        }
      },

      register: function(url, elem) {
        var elemTop = offsetFn(elem[0]).top,
            elems;

        if (elemTop < initialScreenEdge + offset) {
          return elem.attr('src', url);
        }

        elems = this.buffer[url];
        if (elems) {
          elems.push(elem);
        } else {
          this.buffer[url] = [elem];
        }
        this.listen();
      }
    };

    service.listener = throttleFn(service.update, 120);

    return service;
  }];
})
.directive('srcVarOndemand', ["$parse", "ImgSrcOndemand", function($parse, ImgSrcOndemand) {
  return {
    restrict: 'A',
    scope: false,
    link: function(scope, elem, attrs) {
      ImgSrcOndemand.register($parse(attrs.srcVarOndemand)(scope), elem);
    }
  };
}])
.directive('srcOndemand', ["ImgSrcOndemand", function(ImgSrcOndemand) {
  return {
    restrict: 'A',
    scope: false,
    link: function(scope, elem, attrs) {
      ImgSrcOndemand.register(attrs.srcOndemand, elem);
    }
  };
}]);

angular.module('img-src-ondemand')
.factory('offsetFn', ["$window", function($window) {
  return function(rawElem) {
    var top = 0, left = 0;
    do {
      top += rawElem.offsetTop  || 0;
      left += rawElem.offsetLeft || 0;
      rawElem = rawElem.offsetParent;
    } while(rawElem);

    return {
      top: top,
      left: left
    };
  };
}]);

angular.module('img-src-ondemand')
.factory('screenEdgeFn', ["$window", function($window) {
  return function() {
    return $window.pageYOffset + $window.innerHeight;
  };
}]);

angular.module('img-src-ondemand')
.factory('throttleFn', ["$timeout", function($timeout) {
  return function(fn, delay) {
    var job, last = 0;

    return function() {
      var args = arguments,
          self = this,
          time = +(new Date()),
          func = function() {
            last = time;
            fn.apply(self, args);
          };

      $timeout.cancel(job);

      if (time >= last + delay) {
        func();
      } else {
        job = $timeout(func, delay, false);
      }
    };
  };
}]);
