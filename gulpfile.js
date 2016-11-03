'use strict';

var gulp = require('gulp'),
	path = require('path'),
    del  = require('del'),
    sass = require('gulp-sass'),
    clean = require('gulp-clean'),
    watch = require('gulp-watch'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    concatCss = require('gulp-concat-css'),
    wiredep = require('wiredep').stream,
    replace = require('gulp-replace'),
    sassMap = require('gulp-ruby-sass'),
    plumber = require('gulp-plumber'),
    browserify = require('browserify'),
    sourcemaps = require('gulp-sourcemaps'),
	browserSync = require('browser-sync').create(),
    gulpSequence = require('gulp-sequence'),
    autoprefixer = require('gulp-autoprefixer');

var srcDir = 'app/',
    dstDir = 'dist/',
    tmpDir = '_tmp/';

// Fix the tasks run in parallel
gulp.task('serve', gulpSequence('clean:tmp', ['sass', 'js'], 'html', 'watch'));

// Static Server + watching scss/html files
gulp.task('watch', function() {
    browserSync.init({
        server: {
            baseDir: tmpDir,
            routes:{ //URL匹配,值是文件夹要提供的（相对于当前的工作目录）
                "/_tmp": tmpDir,
                "/app": srcDir,
                "/bower_components": "bower_components"
            }
        },
        //在Chrome浏览器中打开网站
        browser: "chrome",
		scrollProportionally: false   //视口同步到顶部位置,default:true
    });

    gulp.watch(srcDir+"js/**/*.js", ['js-watch']);
    gulp.watch(srcDir+"scss/**/*.scss", ['sass']);
    gulp.watch("bower.json", ['html']);
    gulp.watch(srcDir+"*.html", ['html']);
    // console.log(gulp.watch(srcDir+"*.html", ['html']))
    watch(tmpDir+'*.html').on('change',function(e){
        // console.log('refresh!')
        browserSync.reload();
    })
    // console.log(gulp.watch(tmpDir+'*.html'))
    // gulp.watch(tmpDir+"*.html").on('change', browserSync.reload);
    // gulp.watch(tmpDir+"index.html",function(event){
    //     console.log('tmp'+event.type)
    // });

});

<!-- Begin: sass task-->
// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src(srcDir+"scss/*.scss")
        .pipe(sass({
                // includePaths: [tmpDir],
                outputStyle: 'nested'
            }).on('error',sass.logError))
        .pipe(autoprefixer({
                browsers: ['last 3 versions','Android >= 4.0'],
                cascade: true,
                remove: true
            })
        )
        .pipe(gulp.dest(tmpDir+'css'))
        .pipe(browserSync.reload({stream: true}));
});

// Compile sass into CSS & to publish
gulp.task('sass:dist', function() {
    return gulp.src(srcDir+"scss/*.scss")
        .pipe(autoprefixer({
                browsers: ['last 2 versions','Android >= 4.0'],
                cascade: true,
                remove: true
            })
        )
        .pipe(concatCss('main.css'))
        .pipe(sass({
                outputStyle: 'compressed'
            }).on('error',sass.logError))
        .pipe(rename({
                extname: '.min.css'
            })
        )
        .pipe(gulp.dest(dstDir+"css"));
});
<!-- End: sass task-->

<!-- Begin: js task-->
// copy JS files as temp files.
gulp.task('js', function () {
    return gulp.src(srcDir+'js/**/*.js')
        // .pipe(concat('main.js', {newLine: ';'}))
        .pipe(gulp.dest(tmpDir+'js'));
});

// process JS files and compress its.
gulp.task('js:dist', function(){
    return gulp.src(srcDir+'js/**/*.js')
        // .pipe(browserify())
        .pipe(uglify({
            mangle: true,//类型：Boolean 默认：true 是否修改变量名
            compress: true,//类型：Boolean 默认：true 是否完全压缩
            preserveComments: 'all' //保留所有注释
          })
        )
        .pipe(gulp.dest(dstDir+'js'));
});

// create a task that ensures the `js` task is complete before
// reloading browsers
gulp.task('js-watch', ['js'], function (done) {
    browserSync.reload();
    done();
});
<!-- End: js task-->

// inject bower components
gulp.task('html', function(){
    gulp.src([srcDir+'*.html'])
       .pipe(wiredep({
            optional: 'configuration',
            goes: 'here'
        })
       )
       .pipe(gulp.dest(tmpDir));
});

// Compress the html files
gulp.task('html:dist', function(){
    gulp.src([srcDir+'*.html'])
       // .pipe(wiredep({
       //      optional: 'configuration',
       //      goes: 'here'
       //  })
       // )
       .pipe(gulp.dest(dstDir));
});

// inject bower components
// gulp.task('wiredep', function () {
//     gulp.src(srcDir+'styles/*.scss')
//        .pipe(wiredep())
//        .pipe(gulp.dest(dstDir+'css'));
// });

// Build a deploy version
gulp.task('build', ['clean:dist', 'html:dist', 'sass:dist', 'js:dist'], function(){

});

// Build a deploy version & testing
gulp.task('build:watch', ['build'], function(){

});

// Delete temp & dist files task
gulp.task('clean', function(){
    // del([tmpDir, dstDir], {force: true});
    return gulp.src([tmpDir, dstDir], {read: false})
              .pipe(clean());
});
// Delete temp files task
gulp.task('clean:tmp', function(){
    // del([tmpDir], {dryRun: true, force: true}).then(function(path){
    //     // console.log('Delete:', path.join('\n'));
    // });
    return gulp.src(tmpDir, {read: false})
              .pipe(clean({force:true}));
});
// Delete dist files task
gulp.task('clean:dist', function(){
    // del([dstDir], {force: true});
    return gulp.src(dstDir, {read: false})
              .pipe(clean());
});

// default task
gulp.task('default', ['serve']);
