/**
 * @file gulp file
 * @author dongshaoyang(dongshaoyang@baidu.com)
 * @time 2018-09-06
 */

// 从node_module中加载相应的包
var gulp = require('gulp');

gulp.task('hello', function () { console.log('Hello World');
});

// 错误处理的包
var plumber = require('gulp-plumber');

// 自动更新的包
var browserSync = require('browser-sync');
var httpProxy = require('http-proxy-middleware')



function customPlumber() {
    return plumber({
        errorHandler: function (err) {
            // Logs error in console
            console.log(err.stack);
            // Ends the current pipe, so Gulp watch doesn't break
            this.emit('end');
        }
    });
}

const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const cssnano = require('gulp-cssnano');
const concat = require('gulp-concat');
const browserify = require('browserify');
const source = require('vinyl-source-stream');

// 编译并压缩js
gulp.task('convertJS', function () {
    return gulp.src(['app/js/*.js'])
        .pipe(customPlumber())
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

// 合并并压缩css
gulp.task('convertCSS', function () {
    return gulp.src('app/css/*.css')
        .pipe(concat('app.css'))
        .pipe(cssnano())
        .pipe(rename(function (path) {
            path.basename += '.min';
        }))
        .pipe(gulp.dest('dist/css'));
});

// browserify
gulp.task('browserify', function () {
    var b = browserify({
        entries: 'dist/js/app.js'
    });

    return b.bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('dist/js'));
});

// 加载 gulp-sass plugin
var sass = require('gulp-sass');
gulp.task('sass', function () {
    return gulp.src('app/scss/**/*.scss')
        // Checks for errors all plugins
        .pipe(plumber())
        .pipe(sass({
            precision: 2 // Set precision to 2
        }))
        // Output style.css in app/scss
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// 引入proxy 代理，映射成本地接口，解决跨越问题
var jsonProxy = httpProxy('/api/', {
    target: 'https://canvasjs.com',
    changeOrigin: true,
    pathRewrite: {
        '/api': ''
    },
    logLevel: 'debug'
});

gulp.task('browserSync', function () {
    browserSync({
        server: {
            baseDir: './'
        },
        routes: {
                '/app': './app'
            },
        middleware: [jsonProxy]

    });
});

// 重新加载所有的页面
gulp.task('bs-reload', function () {
    browserSync.reload();
});

// 在执行watch之前，'browserSync','sass'
gulp.task('watch', ['browserSync', 'sass'], function () {
    gulp.watch('app/scss/**/*.scss', ['sass']); // Other watchers
    gulp.watch('app/css/*.css', ['convertCSS']);
    gulp.watch('app/js/*.js', ['convertJS', 'browserify', 'bs-reload']);
    gulp.watch([
        'app/**/*.html',
        'app/css/*.css'], ['bs-reload']);
// gulp.watch(...)
});
