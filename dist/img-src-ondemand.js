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
      var screenTop = service.screenTop();
      _(service.buffer).each(function(elem, url, buffer){
        if (elem.offsetTop < screenTop) {
          elem.src = url;
          delete buffer[url];
        }
      });
      if (_.isEmpty(service.buffer)) {
        $timeout(function() { $($window).off('scroll'); });
      }
    }, 120),
    screenTop: function() {
      return $window.pageYOffset + $window.innerHeight;
    },
    register: function(url, elem) {
      var screenTop = service.screenTop();
      if (elem.offsetTop < screenTop) {
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
      ImgSrcOndemand.register(attrs.srcOndemand, elem[0]);
    }
  };
});
