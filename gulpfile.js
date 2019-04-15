
// Load the dependencies in variables
var gulp = require('gulp'); 
var sass = require('gulp-sass');
var browsersync = require('browser-sync');
var reload = browsersync.reload;
var autoprefixer = require('gulp-autoprefixer');

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
     // Adding browser prefixed back to 4 versions if necessary
    .pipe(autoprefixer('last 4 versions'))
    // convers scss to css file. See different outputstyles: https://web-design-weekly.com/2014/06/15/different-sass-output-styles/
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    // set file to destination
    .pipe(gulp.dest(APPPATH.css));
})

gulp.task('serv', ['sass'], function(){
   browsersync.init([APPPATH.css + '/*.css', APPPATH.root + '/*.html', APPPATH.js + '/*.js'], {
     server: {
       baseDir: APPPATH.root
     }
   })
});

gulp.task('watch', ['serv'], function(){
  gulp.watch([SOURCEPATHS.sassSource], ['sass']);
})

// Create gulp task named default and executes 'sass' task
gulp.task('default', ['watch']);
