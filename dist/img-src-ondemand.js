angular.module('img-src-ondemand', [])
.factory('ImgSrcOndemand', function($window, $timeout) {
  var service = {
    buffer: {},
    listen: function() {
      if (this.listening) { return; }

      $($window).on('scroll', this.listener);
      this.listening = true;
    },
    listening: false,
    listener: _.throttle(function() {
      var screenEdge = service.screenEdge();
      _(service.buffer).each(function(elem, url, buffer){
        if (elem.offset().top < screenEdge) {
          elem.attr('src', url);
          delete buffer[url];
        }
      });
      if (_.isEmpty(service.buffer)) {
        $timeout(function() { $($window).off('scroll'); });
      }
    }, 120),
    screenEdge: function() {
      return $window.pageYOffset + $window.innerHeight;
    },
    register: function(url, elem) {
      var screenEdge = service.screenEdge();
      if (elem.offset().top < screenEdge) {
        return (elem.src = url);
      }

      this.buffer[url] = elem;
      this.listen();
    }
  };

  return service;
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
