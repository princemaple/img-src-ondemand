angular.module('img-src-ondemand', [])
.factory('ImgSrcOndemand', ['$window', function($window) {
  var service = {
    buffer: {},
    listening: false,

    listen: function() {
      if (this.listening) { return; }

      angular.element($window).on('scroll', this.listener);
      this.listening = true;
    },

    listener: _.throttle(function() {
      var screenEdge = service.screenEdge();

      angular.forEach(service.buffer, function(elems, url, buffer){
        var seen = false;
        angular.forEach(elems, function(elem) {
          if (elem.offset().top < screenEdge || seen) {
            elem.attr('src', url);
            seen = true;
          }
        });

        if (seen) {
          delete buffer[url];
        }
      });

      if (_.isEmpty(service.buffer)) {
        angular.element($window).off('scroll');
        service.listening = false;
      }
    }, 120),

    screenEdge: function() {
      return $window.pageYOffset + $window.innerHeight;
    },

    register: function(url, elem) {
      var elemTop = elem.offset().top,
          screenEdge = service.screenEdge();

      if (elemTop < screenEdge) {
        return (elem.attr('src', url));
      }

      var elems = this.buffer[url];
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
.directive('srcVarOndemand', ['$parse', 'ImgSrcOndemand', function($parse, ImgSrcOndemand) {
  return {
    restrict: 'A',
    scope: false,
    link: function(scope, elem, attrs) {
      ImgSrcOndemand.register($parse(attrs.srcVarOndemand)(scope), elem);
    }
  };
}])
.directive('srcOndemand', ['ImgSrcOndemand', function(ImgSrcOndemand) {
  return {
    restrict: 'A',
    scope: false,
    link: function(scope, elem, attrs) {
      ImgSrcOndemand.register(attrs.srcOndemand, elem);
    }
  };
}]);
