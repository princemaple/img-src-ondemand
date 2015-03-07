angular.module('demo', ['img-src-ondemand'])
.run(function($document) {
  for (var i = 20; i > 0; --i) {
    var m = Math.random() * 500 >> 0,
        n = Math.random() * 500 >> 0;
    var img = document.createElement('img');
    img.setAttribute('src-ondemand', 'http://lorempixel.com/g/' + m + '/' + n);
    $document[0].body.appendChild(img);
  }
});
