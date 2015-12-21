var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var sass = require('gulp-sass');
var connect = require('gulp-connect');
var babelify = require('babelify');
var mochaPhantomJS = require('gulp-mocha-phantomjs');
var babel = require('gulp-babel');
var gulpif = require('gulp-if');
var del = require('del');

gulp.task('clean', function(cb) {
    del(['lib', 'build', 'test/build'])
});

gulp.task('lib', function() {
    return gulp.src('src/**')
        .pipe(gulpif(/[.]js$/, babel({
            presets: ["react"]
        })))
        .pipe(gulp.dest('lib'));
});

// XXX lib and browserify should use the same babel procedure
// consider using webpack here instead?
gulp.task('browserify', function() {
    return browserify('src/index.js', {
        standalone: 'JuttleViz'
    })
        .transform(babelify, { presets: ["react"] })
        .bundle()
        //Pass desired output filename to vinyl-source-stream
        .pipe(source('juttle-viz.js'))
        // Start piping stream to tasks!
        .pipe(gulp.dest('./build/'));
});

gulp.task('styles', function() {
    gulp.src('styles/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./build/'));
});

gulp.task('watch', function() {
    gulp.watch(['index.js','lib/**/*.js', 'juttle/**/*.js', 'views/**/*.js'], ['browserify']);
    gulp.watch('styles/**/*scss', ['styles']);
});

gulp.task('example-serve', ['browserify', 'styles', 'watch'], function() {
    connect.server({
        port: 8888,
        root: ['examples', 'build', 'node_modules']
    });
});

gulp.task("tests-browserify", function() {
    return browserify("./test/tests")
        .bundle()
        .on("error", function (err) {
            console.log(err.toString());
            this.emit("end");
        })
        .pipe(source("tests.js"))
        .pipe(gulp.dest("test/build/"));
});

gulp.task("test", ['tests-browserify'], function () {
    return gulp.src("./test/test-runner.html")
        .pipe(mochaPhantomJS());
});

gulp.task('default', ['browserify', 'styles', 'lib']);
