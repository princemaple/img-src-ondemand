var gulp = require('gulp');

var concat = require('gulp-concat');
var ngAnnotate = require('gulp-ng-annotate');

gulp.task('compile', function() {
  return gulp.src('src/**/*.js')
    .pipe(ngAnnotate())
    .pipe(concat('img-src-ondemand.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
  gulp.watch('src/**/*.js', ['compile']);
});

gulp.task('default', ['compile']);
