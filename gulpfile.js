"use strict";
// C:\Users\Administrator\AppData\Roaming\npm\node_modules
process.env.NODE_PATH = 'C:\\Users\\Administrator\\AppData\\Roaming\\npm\\node_modules';
require('module').Module._initPaths();
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
    htmlmin = require('gulp-htmlmin'),
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
        open: "external",   //打开外部URL -必须在网上
        scrollProportionally: false,   //视口同步到顶部位置,default:true
        injectChanges: false  //不要尝试注入，只是做一个页面刷新，解决CSS注入页面回到顶部
    });

    gulp.watch(srcDir + "js/**/*.js", ['js-watch']);
    gulp.watch(srcDir + "scss/**/*.scss", ['sass']);
    gulp.watch(srcDir + "images/**/*", ['img']);
    gulp.watch("bower.json", ['html']);
    gulp.watch(srcDir + "*.html", ['html']);
    watch(tmpDir + '*.html').on('change', function (e) {
        browserSync.reload();
    })
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
gulp.task('sass:dist', ['sass'], function () {
    return gulp.src(tmpDir + "css/**/*.css")
        .pipe(concatCss('main.css'))
        .pipe(rename({
                extname: '.min.css'
            })
        )
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
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
        .pipe(gulp.dest(tmpDir + 'js/'));
});
// process JS files and compress its.
gulp.task('js:dist', ['js'], function () {
    return gulp.src(tmpDir + '**/*.js')
        .pipe(uglify({
            mangle: true,//类型：Boolean 默认：true 是否修改变量名
            compress: true,//类型：Boolean 默认：true 是否完全压缩
            preserveComments: 'license' //保留所有注释
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


// <!-- Begin: Html task-->
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
    "../bower_components/echarts/dist/echarts.min.js": "//cdn.bootcss.com/echarts/3.3.1/echarts.min.js",
    "../bower_components/bootstrap/dist/css/bootstrap.min.css": "//cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.min.css",
    "../bower_components/font-awesome/css/font-awesome.min.css": "//cdn.bootcss.com/font-awesome/4.7.0/css/font-awesome.min.css"
};
// handle the build path and introduce file version to html file
gulp.task('html:dist', ['js:dist', 'sass:dist', 'html'], function () {
    return gulp.src([tmpDir + 'rev/**/*.json', tmpDir + '*.html'])
        .pipe(replace('main.css', 'main.min.css'))
        .pipe(revCollector())
        .pipe(replace('../_tmp', '.'))
        // cdn
        .pipe(replaceAssets(replaceThis))
        .pipe(htmlmin({
            ignoreCustomComments: [/<!--(\[|<)[\s\S]*?-->/],
            removeComments: true,//清除HTML注释
            collapseWhitespace: true,//压缩HTML
            collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
            removeEmptyAttributes: true //删除所有空格作属性值 <input id="" /> ==> <input />
        })
        )
        .pipe(gulp.dest(dstDir));
});
// <!-- End: Html task-->

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
gulp.task('build', gulpSequence('clean', ['img:dist', 'html:dist']));
// Build a deploy version & testing
gulp.task('build:watch', ['build'], function () {
    browserSync.init({
        server: {
            baseDir: dstDir,
            routes: { //URL匹配,值是文件夹要提供的（相对于当前的工作目录）
                "./": dstDir
            }
        },
        //在Chrome浏览器中打开网站
        browser: "chrome"
    });
});


// Delete temp & dist files task
gulp.task('clean', ['clean:tmp', 'clean:dist']);
// Delete temp files task
gulp.task('clean:tmp', function () {
    return gulp.src(tmpDir, {read: false})
              .pipe(clean({force: true}));
});
// Delete dist files task
gulp.task('clean:dist', function () {
    return gulp.src(dstDir, {read: false})
              .pipe(clean({force: true}));
});

// default task
gulp.task('default', ['serve']);
