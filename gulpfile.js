
// Load the dependencies in variables
var gulp = require('gulp'); 
var sass = require('gulp-sass');

// Create gulp task named Sass
// Picks up sccs file from 'src/scss/app/scss' and converts it into css file on destination '/app/css'
gulp.task('sass', function(){
  return gulp.src('src/scss/app.scss')
  .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
  .pipe(gulp.dest('app/css'));
})

// Create gulp task named default and executes 'sass' task
gulp.task('default', ['sass']);
