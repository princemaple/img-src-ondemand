var gulp = require('gulp');

var concat = require('gulp-concat'),
    jshint = require('gulp-jshint'),
    ngAnnotate = require('gulp-ng-annotate');

gulp.task('lint', function() {
  return gulp.src('src/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('compile', function() {
  return gulp.src('src/**/*.js')
    .pipe(ngAnnotate())
    .pipe(concat('img-src-ondemand.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
  gulp.watch('src/**/*.js', ['lint', 'compile']);
});

gulp.task('default', ['lint', 'compile']);
