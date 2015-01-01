var gulp = require('gulp');

var concat = require('gulp-concat');

gulp.task('concat', function() {
  return gulp.src('src/**/*.js')
    .pipe(concat('img-src-ondemand.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
  gulp.watch('src/**/*.js', ['concat']);
});

gulp.task('default', ['concat']);