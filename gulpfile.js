var gulp = require('gulp');
var inject = require('gulp-inject');
var webserver = require('gulp-webserver');
var htmlclean = require('gulp-htmlclean');
var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var del = require('del');
var sass = require('gulp-sass');
var paths = {
    src: 'src/**/*',
    srcHTML: 'src/**/*.html',
    srcCSS: 'src/**/*.scss',
    srcJS: 'src/**/*.js',
    srcIMG: 'src/**/*.png',
    srcVendorJS: 'src/js/vendor/*.js',
    srcAppJS: 'src/js/app.js',
    tmp: 'tmp',
    tmpIndex: 'tmp/index.html',
    tmpCSS: 'tmp/**/*.css',
    tmpJS: 'tmp/js/app.js',
    tmpVendorJs: 'tmp/js/vendor/*.js',
    dist: 'dist',
    distStyle: 'dist/css',
    distScript: 'dist/js',
    distIndex: 'dist/index.html',
    distCSS: 'dist/**/*.css',
    distJS: 'dist/**/*.js'
};

gulp.task('html', function () {
    return gulp.src(paths.srcHTML).pipe(gulp.dest(paths.tmp));
});

gulp.task('css', function () {
    return gulp.src(paths.srcCSS)
    .pipe(sass())
    .pipe(gulp.dest(paths.tmp));
});

gulp.task('js', function () {
    return gulp.src(paths.srcJS).pipe(gulp.dest(paths.tmp));
});

gulp.task('images', function () {
    return gulp.src(paths.srcIMG).pipe(gulp.dest(paths.tmp));
});

gulp.task('copy', ['html', 'css', 'js', 'images']);

gulp.task('inject', ['copy'], function () {
    var css = gulp.src(paths.tmpCSS);
    var js = gulp.src([paths.tmpVendorJs, paths.tmpJS]);
    return gulp.src(paths.tmpIndex)
      .pipe(inject( css, { relative:true } ))
      .pipe(inject( js, { relative:true } ))
      .pipe(gulp.dest(paths.tmp));
});

gulp.task('serve', ['inject'], function () {
    return gulp.src(paths.tmp)
      .pipe(webserver({
        port: 3000,
        livereload: true
      }));
});

gulp.task('watch', ['serve'], function () {
    gulp.watch(paths.src, ['inject']);
});

gulp.task('default', ['watch']);

gulp.task('html:dist', function () {
    return gulp.src(paths.srcHTML)
        .pipe(htmlclean())
        .pipe(gulp.dest(paths.dist));
});

gulp.task('css:dist', function () {
    return gulp.src(paths.srcCSS)
        .pipe(sass())
        .pipe(concat('style.min.css'))
        .pipe(cleanCSS())
        .pipe(gulp.dest(paths.distStyle));
});

gulp.task('js:dist', function () {
    return gulp.src([paths.srcVendorJS, paths.srcAppJS])
        .pipe(concat('app.min.js'))
        //.pipe(uglify())
        .pipe(gulp.dest(paths.distScript));
});

gulp.task('images:dist', function () {
    return gulp.src(paths.srcIMG)
        .pipe(gulp.dest(paths.dist));
});

gulp.task('copy:dist', ['html:dist', 'css:dist', 'js:dist', 'images:dist']);

gulp.task('inject:dist', ['copy:dist'], function () {
    var css = gulp.src(paths.distCSS);
    var js = gulp.src(paths.distJS);
    return gulp.src(paths.distIndex)
        .pipe(inject( css, { relative:true } ))
        .pipe(inject( js, { relative:true } ))
        .pipe(htmlclean())
        .pipe(gulp.dest(paths.dist));
});

gulp.task('build', ['inject:dist']);

gulp.task('clean', function () {
    del([paths.tmp, paths.dist]);
});
