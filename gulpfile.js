var gulp = require('gulp'),
    clean = require('gulp-clean'),
    coffee = require('gulp-coffee'),
    sass = require('gulp-sass'),
    less = require('gulp-less'),
    watch = require('gulp-watch'),
    jade = require('gulp-jade'),
    plumber = require('gulp-plumber'),
    connect = require('gulp-connect'),
    uglify = require('gulp-uglify'),
    s3 = require('gulp-s3'),
    gzip = require('gulp-gzip'),
    aws = require('./config/production.json.example'),
    replace = require('gulp-replace'),
    sources = {
        deployment: ['build/img/*.*', 'build/jquery.donations.*.js', 'build/jquery.donations.*.css'],
        scss: 'src/style.scss',
        clean: ['jhey/css/', 'jhey/js/'],
        coffee: 'src/coffee/**/*.coffee',
        jade: 'src/jade/**/*.jade',
        overwatch: 'build/**/*.*'
    },
    destinations = {
        build: 'build/',
        js: 'jhey/js/',
        html: 'build/',
        docs: 'build'
    },
    options = {
        s3: {
                headers: {
                    'Cache-Control': 'max-age=315360000, no-transform, public'
                }
            }
    };
gulp.task('serve', function(event) {
    connect.server({
		root: destinations.docs,
		port: 1987,
		livereload: true
	});
	// sets up a livereload that watches for any changes in the root
	watch({glob: sources.overwatch})
		.pipe(connect.reload());
});
/** Deploy:S3; gzips sources and deploys to S3.**/
gulp.task('deploy:s3', function(event) {
    return gulp.src(sources.deployment)
        .pipe(plumber())
        .pipe(gzip())
        .pipe(s3(aws, options.s3));
});
/** Clean; cleans out appropriate sources.**/
gulp.task('clean', function(event) {
    return gulp.src(sources.clean)
        .pipe(clean());
});
/** Scss:compile; compiles scss sources**/
gulp.task('scss:compile', function(event) {
    // looks like it has a dependency on sass, minification and clean up.
    // maybe introduce concatenation if needed because can be better to do it that way
    // if there are many style files.
    return gulp.src(sources.scss)
        .pipe(plumber())
        .pipe(sass(
            {
                outputStyle: "compressed"
            }
        ))
        .pipe(gulp.dest(destinations.build));
});
gulp.task('coffee:compile', function(event) {
    return gulp.src(sources.coffee)
        .pipe(plumber())
        .pipe(coffee())
        .pipe(uglify())
        .pipe(gulp.dest(destinations.js));
});
gulp.task('scripts', function(event) {
    // run a coffee build task, then an uglify task, then clean out the scripts folder.
});
gulp.task('jade:compile', function(event) {
    return gulp.src(sources.jade)
        .pipe(plumber())
        .pipe(jade({
            pretty: true
        }))
        .pipe(gulp.dest(destinations.html))
});
gulp.task('build', function(event) {
    // so the build task relies on cleaning out the build first then copying the build?
    // run the stylesheets, scripts, ver, versionread, and replace tasks
    // along with jasmine?
});
gulp.task('dev', ['serve']);
gulp.task('default', ['dev', 'deploy:s3']);
