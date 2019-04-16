
// Load the dependencies in variables
var gulp = require('gulp'); 
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var browsersync = require('browser-sync');
var reload = browsersync.reload;

var SOURCEPATHS = {
  sassSource: 'src/scss/*.scss',
  htmlSource: 'src/*.html',
  jsSource: 'src/js/**'
};

var APPPATH = {
  root: 'app',
  css: 'app/css',
  js: 'app/js'
};

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
  // The paths that should be monitored and the tasks that should be executed when a file changes in the path.
  gulp.watch([SOURCEPATHS.sassSource], ['copy-sass']);
  gulp.watch([SOURCEPATHS.htmlSource], ['copy-html']);
  gulp.watch([SOURCEPATHS.htmlSource], ['clean-html']);
  gulp.watch([SOURCEPATHS.jsSource], ['copy-scripts']);
  gulp.watch([SOURCEPATHS.jsSource], ['clean-scripts']);
});

// Create gulp task named Sass
// Picks up sccs file from 'src/scss/app/scss' and converts it into css file on destination '/app/css'
gulp.task('copy-sass', function(){
  return gulp.src(SOURCEPATHS.sassSource)
     // Adding browser prefixed back to 4 versions if necessary
    .pipe(autoprefixer('last 4 versions'))
    // convers scss to css file. See different outputstyles: https://web-design-weekly.com/2014/06/15/different-sass-output-styles/
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    // set file to destination
    .pipe(gulp.dest(APPPATH.css));
});

// Copy html files from source directory to App directory.
gulp.task('copy-html', function() {
  gulp.src(SOURCEPATHS.htmlSource)
    .pipe(gulp.dest(APPPATH.root));
});


// Delete html files from App directory when they are removed from the source directory.
gulp.task('clean-html', function(){
  // Read is false because else the content in the files are also monitored. Force need to be true when deleting files.
  return gulp.src(APPPATH.root + '/*.html', {read: false, force: true})
    .pipe(clean());
})

// Copy javascript files from source directory to App directory
gulp.task('copy-scripts', function() {
  gulp.src(SOURCEPATHS.jsSource)
    .pipe(concat('main.js'))
    .pipe(gulp.dest(APPPATH.js));
})

// Delete javascript files from App directory when they are removed from the source directory.
gulp.task('clean-scripts', function(){
  // Read is false because else the content in the files are also monitored. Force need to be true when deleting files.
  return gulp.src(APPPATH.js + '/*.js', {read: false, force: true})
    .pipe(clean());
})

// Create gulp task named default and executes multiple tasks
gulp.task('default', ['copy-sass', 'copy-html', 'clean-html', 'copy-scripts', 'clean-scripts', 'watch', 'serv']);
