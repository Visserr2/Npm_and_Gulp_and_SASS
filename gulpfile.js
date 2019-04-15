
// Load the dependencies in variables
var gulp = require('gulp'); 
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

var SOURCEPATHS = {
  sassSource: 'src/scss/*.scss'
}

var APPPATH = {
  root: 'app',
  css: 'app/css',
  js: 'app/js'
}

// Create gulp task named Sass
// Picks up sccs file from 'src/scss/app/scss' and converts it into css file on destination '/app/css'
gulp.task('sass', function(){
  return gulp.src(SOURCEPATHS.sassSource)
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(gulp.dest(APPPATH.css));
})

gulp.task('serv', ['sass'], function(){
   browserSync.init([APPPATH.css + '/*.css', APPPATH.root + '/*.html', APPPATH.js + '/*.js'], {
     server: {
       baseDir: APPPATH.root
     }
   })
});

// Create gulp task named default and executes 'sass' task
gulp.task('default', ['serv']);