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
