
// Load the dependencies in variables
var gulp = require('gulp'); 
var sass = require('gulp-sass');
var browsersync = require('browser-sync');
var reload = browsersync.reload;
var autoprefixer = require('gulp-autoprefixer');

var SOURCEPATHS = {
  sassSource: 'src/scss/*.scss',
  htmlSource: 'src/*.html'
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

// Browser Sync
gulp.task('serv', function(){
  // The paths that should be monitored. If file changes then browser reloads
   browsersync.init([APPPATH.css + '/*.css', APPPATH.root + '/*.html', APPPATH.js + '/*.js'], {
     // init the server
     server: {
       baseDir: APPPATH.root
     }
   })
});

// Watch changed files in source directory and execute task if that happens
gulp.task('watch', function(){
  // The path that should be monitored and the task that should be executed when a file changes in the path.
  gulp.watch([SOURCEPATHS.sassSource], ['sass']);
  gulp.watch([SOURCEPATHS.htmlSource], ['copy']);
})

// Copy files from source directory to App directory.
gulp.task('copy', function() {
  gulp.src(SOURCEPATHS.htmlSource)
    .pipe(gulp.dest(APPPATH.root));
})

// Create gulp task named default and executes multiple tasks
gulp.task('default', ['sass', 'serv', 'copy', 'watch']);
