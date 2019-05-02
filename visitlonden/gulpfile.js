
// Load the dependencies in variables
var gulp = require('gulp'); 
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var browserify = require('gulp-browserify');
var merge = require('merge-stream');
var newer = require('gulp-newer');
var imagemin = require('gulp-imagemin');
var injectPartials = require('gulp-inject-partials');
var minify = require('gulp-minify');
var rename = require('gulp-rename');
var cssmin = require('gulp-cssmin');
var htmlmin = require('gulp-htmlmin');
var browsersync = require('browser-sync');
var reload = browsersync.reload;

var SOURCEPATHS = {
  sassSource: 'src/scss/*.scss',
  htmlSource: 'src/*.html',
  htmlPartialSource: 'src/partial/*.html',
  jsSource: 'src/js/**',
  imgSource: "src/img/**"
};

var APPPATH = {
  root: 'app/',
  css: 'app/css',
  js: 'app/js',
  img: 'app/img'
};

// **************** DEVELOP PROCESSES ***************** //

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
  gulp.watch([SOURCEPATHS.htmlSource, SOURCEPATHS.htmlPartialSource], ['copy-html']);
  gulp.watch([SOURCEPATHS.htmlSource], ['clean-html']);
  gulp.watch([SOURCEPATHS.jsSource], ['copy-scripts']);
  gulp.watch([SOURCEPATHS.jsSource], ['clean-scripts']);
});

// Create gulp task named Sass
// Picks up sccs file from 'src/scss/app/scss' and converts it into css file on destination '/app/css'
gulp.task('copy-sass', function(){
  // fetches bootstrap dependency from node_modules
  var bootstrapCss = gulp.src('./node_modules/bootstrap/dist/css/bootstrap.css');
  // creates css file from the scss-files
  var sassFiles = gulp.src(SOURCEPATHS.sassSource)
    // convers scss to css file. See different outputstyles: https://web-design-weekly.com/2014/06/15/different-sass-output-styles/
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    // Adding browser prefixed back to 4 versions if necessary
    .pipe(autoprefixer('last 4 versions'));

    // return merges bootstrap and scss files into 1 app.css file. The order in the app.css is the same order as the variables
  return merge(bootstrapCss, sassFiles)
    .pipe(concat('app.css'))
    // set file to destination
    .pipe(gulp.dest(APPPATH.css));

});

// Copy html files from source directory to App directory.
gulp.task('copy-html', function() {
  return gulp.src(SOURCEPATHS.htmlSource)
    // Injecting html partials
    .pipe(injectPartials())
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
    // concates all javascript files to one main.js
    .pipe(concat('main.js'))
    // use require-method in javascript files
    .pipe(browserify())
    .pipe(gulp.dest(APPPATH.js));
})

// Delete javascript files from App directory when they are removed from the source directory.
gulp.task('clean-scripts', function(){
  // Read is false because else the content in the files are also monitored. Force need to be true when deleting files.
  return gulp.src(APPPATH.js + '/*.js', {read: false, force: true})
    .pipe(clean());
})

gulp.task('copy-images', function(){
  return gulp.src(SOURCEPATHS.imgSource)
      // checks if new images is added
      .pipe(newer(APPPATH.img))
      .pipe(gulp.dest(APPPATH.img));
});

// Create gulp task named default and executes multiple tasks
gulp.task('default', ['watch', 'serv', 'copy-sass', 'copy-html', 'clean-html', 'copy-scripts', 'clean-scripts', 'copy-images']);

// **************** PRODUCTION PROCESSES ***************** //

// Picks up sccs file from 'src/scss/app/scss' and converts it into css file on destination '/app/css'
gulp.task('copy-sass-prd', function(){
  var bootstrapCss = gulp.src('./node_modules/bootstrap/dist/css/bootstrap.css');
  var sassFiles = gulp.src(SOURCEPATHS.sassSource)
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(autoprefixer('last 4 versions'));

  return merge(bootstrapCss, sassFiles)
    .pipe(concat('app.css'))
    // minify Css and rename file. Add .min 
    .pipe(cssmin()).pipe(rename({suffix:'.min'}))
    .pipe(gulp.dest(APPPATH.css));
});

// Copy javascript files from source directory to App directory
gulp.task('copy-scripts-prd', function() {
  gulp.src(SOURCEPATHS.jsSource)
    .pipe(concat('main.js'))
    .pipe(browserify())
    // Minify javascript file
    .pipe(minify())
    .pipe(gulp.dest(APPPATH.js));
})

// Copy html files from source directory to App directory.
gulp.task('copy-html-prd', function() {
  return gulp.src(SOURCEPATHS.htmlSource)
    .pipe(injectPartials())
    // Minify the html
    .pipe(htmlmin({collapseWhitespace:true}))
    .pipe(gulp.dest(APPPATH.root));
});

gulp.task('copy-images-prd', function(){
  return gulp.src(SOURCEPATHS.imgSource)
      .pipe(newer(APPPATH.img))
      // minifies the images
      .pipe(imagemin())
      .pipe(gulp.dest(APPPATH.img));
});

gulp.task('production', ['copy-sass-prd', 'copy-html-prd', 'copy-scripts-prd', 'copy-images-prd']);