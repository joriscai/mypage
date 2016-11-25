"use strict";

// gulp变量
var gulp = require('gulp'),
    path = require('path'),
    del  = require('del'),
    rev = require('gulp-rev'),
    sass = require('gulp-sass'),
    clean = require('gulp-clean'),
    watch = require('gulp-watch'),
    gulpif = require('gulp-if'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    useref = require('gulp-useref'),
    concatCss = require('gulp-concat-css'),
    wiredep = require('wiredep').stream,
    replace = require('gulp-replace'),
    flatten = require('gulp-flatten'),
    sassMap = require('gulp-ruby-sass'),
    plumber = require('gulp-plumber'),
    cdnizer = require("gulp-cdnizer"),
    browserify = require('browserify'),
    sourcemaps = require('gulp-sourcemaps'),
    replaceAssets = require('gulp-replace-assets'),
    browserSync = require('browser-sync').create(),
    gulpSequence = require('gulp-sequence'),
    revCollector = require('gulp-rev-collector'),
    autoprefixer = require('gulp-autoprefixer');

// 目录变量
var srcDir = 'app/',
    dstDir = 'dist/',
    tmpDir = '_tmp/';

// Fix the tasks run in parallel
gulp.task('serve', gulpSequence('clean:tmp', ['sass', 'js', 'img'], 'html', 'watch'));

// Static Server + watching scss/html files
gulp.task('watch', function () {
    browserSync.init({
        server: {
            baseDir: tmpDir,
            routes: { //URL匹配,值是文件夹要提供的（相对于当前的工作目录）
                "/_tmp": tmpDir,
                "/app": srcDir,
                "/bower_components": "bower_components"
            }
        },
        //在Chrome浏览器中打开网站
        browser: "chrome",
        scrollProportionally: false,   //视口同步到顶部位置,default:true
        injectChanges: false  //不要尝试注入，只是做一个页面刷新，解决CSS注入页面回到顶部
    });

    gulp.watch(srcDir + "js/**/*.js", ['js-watch']);
    gulp.watch(srcDir + "scss/**/*.scss", ['sass']);
    gulp.watch("bower.json", ['html']);
    gulp.watch(srcDir + "*.html", ['html']);
    // console.log(gulp.watch(srcDir+"*.html", ['html']))
    watch(tmpDir + '*.html').on('change', function (e) {
        // console.log('refresh!')
        browserSync.reload();
    })
    // console.log(gulp.watch(tmpDir+'*.html'))
    // gulp.watch(tmpDir+"*.html").on('change', browserSync.reload);
    // gulp.watch(tmpDir+"index.html",function(event){
    //     console.log('tmp'+event.type)
    // });

});

// <!-- Begin: sass task-->
// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function () {
    return gulp.src(srcDir + "scss/*.scss")
        .pipe(sass({
                outputStyle: 'nested'
            }).on('error', sass.logError))
        .pipe(autoprefixer({
                browsers: ['last 3 versions','Android >= 4.0'],
                cascade: true,
                remove: true
            })
        )
        .pipe(gulp.dest(tmpDir + 'css'))
        .pipe(browserSync.reload({stream: true}));
});

// Compile sass into CSS & to publish
gulp.task('sass:dist', function () {
    return gulp.src(srcDir + "scss/*.scss")
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(autoprefixer({
                browsers: ['last 3 versions','Android >= 4.0'],
                cascade: true,
                remove: true
            })
        )
        .pipe(concatCss('main.css'))
        .pipe(rename({
                extname: '.min.css'
            })
        )
        .pipe(gulp.dest(dstDir + "css"))
        .pipe(rev())
        .pipe(rev.manifest())
        .pipe(gulp.dest(tmpDir + 'rev/css'))
});
// <!-- End: sass task-->

// <!-- Begin: js task-->
// copy JS files as temp files.
gulp.task('js', function () {
    return browserify('./app/js/index.js')
        .bundle()
        .pipe(source('index.js')) // gives streaming vinyl file object
        .pipe(buffer()) // <----- convert from streaming to buffered vinyl file object
        // .pipe(uglify())  // now gulp-uglify works
        .pipe(gulp.dest(tmpDir + 'js/'));
});

// process JS files and compress its.
gulp.task('js:dist', ['js'], function () {
    return gulp.src(tmpDir + '**/*.js')
        .pipe(uglify({
            mangle: true,//类型：Boolean 默认：true 是否修改变量名
            compress: true,//类型：Boolean 默认：true 是否完全压缩
            preserveComments: 'all' //保留所有注释
        })
        )
        .pipe(gulp.dest(dstDir))
        .pipe(rev())
        .pipe(rev.manifest())
        .pipe(gulp.dest(tmpDir + 'rev/js'))
});

// create a task that ensures the `js` task is complete before
// reloading browsers
gulp.task('js-watch', ['js'], function (done) {
    browserSync.reload();
    done();
});
// <!-- End: js task-->

// inject bower components
gulp.task('html', function () {
    gulp.src([srcDir + '*.html'])
       .pipe(wiredep({
            optional: 'configuration',
            goes: 'here'
        })
       )
       .pipe(gulp.dest(tmpDir));
});

var replaceThis = {
    "../bower_components/echarts/dist/echarts.min.js": "http://cdn.bootcss.com/echarts/3.3.1/echarts.min.js",
    "../bower_components/bootstrap/dist/css/bootstrap.min.css": "http://cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.min.css",
    "../bower_components/font-awesome/css/font-awesome.min.css": "http://cdn.bootcss.com/font-awesome/4.7.0/css/font-awesome.min.css"
};

// handle the build path and introduce file version to html file
gulp.task('html:dist', ['js:dist', 'sass:dist', 'html'], function () {
    return gulp.src([tmpDir + 'rev/**/*.json', tmpDir + '*.html'])
        .pipe(replace('main.css', 'main.min.css'))
        .pipe(revCollector())
        .pipe(replace('../_tmp', '.'))
        // cdn
        .pipe(replaceAssets(replaceThis))
        .pipe(gulp.dest(dstDir));
});



// copy the bower dependencies to the build path
gulp.task('bower-css', function () {
    return gulp.src(['bower_components/**/*.min.css'])
        .pipe(flatten())
        .pipe(gulp.dest('dist/css'));
})
gulp.task('bower-js', function () {
    return gulp.src(['bower_components/**/echarts.min.js'])
        .pipe(flatten())
        .pipe(gulp.dest('dist/js'));
})
gulp.task('bower', ['bower-css', 'bower-js'])

// // Compress the html files
// gulp.task('html:dist', function () {
//     gulp.src([srcDir + '*.html'])
//        // .pipe(wiredep({
//        //      optional: 'configuration',
//        //      goes: 'here'
//        //  })
//        // )
//        .pipe(gulp.dest(dstDir));
// });

// inject bower components
// gulp.task('wiredep', function () {
//     gulp.src(srcDir+'styles/*.scss')
//        .pipe(wiredep())
//        .pipe(gulp.dest(dstDir+'css'));
// });

// process Image
gulp.task('img', function () {
    gulp.src([srcDir + 'images/**/*'])
       .pipe(gulp.dest(tmpDir + 'images/'));
});

// Compress images
gulp.task('img:dist', function () {
    gulp.src([srcDir + 'images/**/*'])
       .pipe(gulp.dest(dstDir + 'images/'));
});

// Build a deploy version
gulp.task('build', gulpSequence('clean', ['img:dist'], 'html:dist'));
// gulp.task('build', ['clean:dist', 'html:dist', 'sass:dist', 'js:dist'], function () {
//
// });

// Build a deploy version & testing
gulp.task('build:watch', ['build'], function () {

});

// Delete temp & dist files task
gulp.task('clean', function () {
    // del([tmpDir, dstDir], {force: true});
    return gulp.src([tmpDir, dstDir], {read: false})
              .pipe(clean());
});
// Delete temp files task
gulp.task('clean:tmp', function () {
    // del([tmpDir], {dryRun: true, force: true}).then(function(path){
    //     // console.log('Delete:', path.join('\n'));
    // });
    return gulp.src(tmpDir, {read: false})
              .pipe(clean({force: true}));
});
// Delete dist files task
gulp.task('clean:dist', function () {
    // del([dstDir], {force: true});
    return gulp.src(dstDir, {read: false})
              .pipe(clean());
});

// default task
gulp.task('default', ['serve']);
