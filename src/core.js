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

  this.$get = function($window, offsetFn, screenEdgeFn, throttleFn) {
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
  };
})
.directive('srcVarOndemand', function($parse, ImgSrcOndemand) {
  return {
    restrict: 'A',
    scope: false,
    link: function(scope, elem, attrs) {
      ImgSrcOndemand.register($parse(attrs.srcVarOndemand)(scope), elem);
    }
  };
})
.directive('srcOndemand', function(ImgSrcOndemand) {
  return {
    restrict: 'A',
    scope: false,
    link: function(scope, elem, attrs) {
      ImgSrcOndemand.register(attrs.srcOndemand, elem);
    }
  };
});
