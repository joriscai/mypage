'use strict';

var gulp = require('gulp'),
	path = require('path'),
	sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    replace = require('gulp-replace'),
    sassMap = require('gulp-ruby-sass'),
    browserify = require('browserify'),
    sourcemaps = require('gulp-sourcemaps'),
	browserSync = require('browser-sync').create();

// Static Server + watching scss/html files
gulp.task('serve', ['sass', 'html', 'js'], function() {

    browserSync.init({
        server: {
            baseDir: "./app",
            routes:{ //URL匹配,值是文件夹要提供的（相对于当前的工作目录）
                "/.tmp": ".tmp",
                "/bower_components": "bower_components"
            }
        }
    });

    gulp.watch("app/js/**/*.js", ['js-watch']);
    gulp.watch("app/scss/**/*.scss", ['sass']);
    gulp.watch("app/*.html").on('change', browserSync.reload);
});

<!-- Begin: sass task-->
// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src("app/scss/*.scss")
        .pipe(sass().on('error',sass.logError))
        .pipe(gulp.dest(".tmp/css"))
        .pipe(browserSync.reload({stream: true}));
});

// Compile sass into CSS & to publish
gulp.task('sass:dist', function() {
    return gulp.src("app/scss/*.scss")
        .pipe(sass().on('error',sass.logError))
        .pipe(gulp.dest("dist/css"));
});
<!-- End: sass task-->

<!-- Begin: js task-->
// process JS files and return the stream.
gulp.task('js', function () {
    return gulp.src('app/js/**/*.js')
        // .pipe(uglify())
        .pipe(gulp.dest('.tmp/js'));
});

// 
gulp.task('js:dist', function(){
    return gulp.src('js/**/*.js')
        .pipe(browserify())
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

// create a task that ensures the `js` task is complete before
// reloading browsers
gulp.task('js-watch', ['js'], function (done) {
    browserSync.reload();
    done();
});
<!-- End: js task-->

// 
gulp.task('html', function(){
    gulp.src(['app/*.html'])
       .pipe(replace('./css','./.tmp/css'));
});

// Compress the html files
gulp.task('html:dist', function(){

});

// inject bower components
gulp.task('wiredep', function () {
  var wiredep = require('wiredep').stream;

  gulp.src('app/styles/*.scss')
    .pipe(wiredep())
    .pipe(gulp.dest('dist/css'));
});

// Build a publishable version
gulp.task('build',['wiredep', 'html', 'sass:dist', 'js:dist'],function(){

});

// Delete all temp files task
gulp.task('clean', require('del').bind(null, ['.tmp', 'dist']));

// default task
gulp.task('default', ['serve']);