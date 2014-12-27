angular.module('img-src-ondemand', [])
.factory('ImgSrcOndemand', function($window, $timeout) {
  var service = {
    buffer: {},
    listening: false,

    listen: function() {
      if (this.listening) { return; }

      $($window).on('scroll', this.listener);
      this.listening = true;
    },

    listener: _.throttle(function() {
      var screenEdge = service.screenEdge();

      _(service.buffer).each(function(elems, url, buffer){
        _(elems).each(function(elem, index, array) {
          if (!elem) { return; }

          if (elem.offset().top < screenEdge) {
            elem.attr('src', url);
            array[index] = null;
          }
        });

        buffer[url] = _.compact(buffer[url]);

        if (_.isEmpty(buffer[url])) {
          delete buffer[url];
        }
      });

      if (_.isEmpty(service.buffer)) {
        $($window).off('scroll');
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
