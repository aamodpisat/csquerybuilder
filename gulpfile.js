/**
 * Created by Aamod Pisat on 03-10-2016.
 */
var gulp        = require('gulp');
var gutil      = require('gulp-util');
var browserify  = require('browserify');
var source      = require('vinyl-source-stream');
var buffer      = require('vinyl-buffer');
var rename       = require('gulp-rename');
var plugins     = require('gulp-load-plugins')();
var runSequence = require('run-sequence');

gulp.task('webserver', function(){
    gulp.src('./')
        .pipe(plugins.webserver({
            fallback   : 'index.html',
            host       : 'localhost',
            livereload : true,
            open       : true,
            port       : process.env.PORT || 8000
        }))
});

gulp.task('browserify',function(cb) {
    return browserify({
        transform: ['html2js-browserify', 'browserify-css'],
        entries: ['./public/js/index.js']
    })
        .bundle()
        .on('error', function (err) {
            gutil.log(err);
            this.emit('end');
        })
        .pipe(source('bundle.js'))
        .pipe(buffer())
        //.pipe(plugins.addSrc('index.html'))
        .pipe(gulp.dest('./'))
});

gulp.task('build', function() {
    runSequence(
        ['browserify'],['webserver']
    );
});
