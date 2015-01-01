angular.module('img-src-ondemand', [])
.factory('ImgSrcOndemand', ["$window", "offsetFn", "screenEdgeFn", "throttleFn", function($window, offsetFn, screenEdgeFn, throttleFn) {
  var service = {
    buffer: {},
    listening: false,

    listen: function() {
      if (this.listening) { return; }

      angular.element($window).on('scroll', this.listener);
      this.listening = true;
    },

    listener: throttleFn(function() {
      var screenEdge = screenEdgeFn();

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
    }, 120),

    register: function(url, elem) {
      var elemTop = offsetFn(elem[0]).top,
          elems;

      if (elemTop < screenEdgeFn()) {
        return (elem.attr('src', url));
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

  return service;
}])
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
.factory('throttleFn', function() {
  return function throttleFn(func, delay){
    var last = 0;

    return function(){
      var args = arguments,
          self = this,
          now  = +(new Date());

      if (now >= last + delay) {
        last = now;
        func.apply(self, args);
      }
    };
  };
});
