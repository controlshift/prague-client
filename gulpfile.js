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
    concat = require('gulp-concat'),
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
        overwatch: 'build/**/*.*',
        asset_scripts: [
            'vendor/form2js/src/form2js.js',
            'vendor/jasmine/lib/jasmine-2.0.0/**/*.js',
            'vendor/jquery/dist/jquery.min.js',
            'vendor/jquery.payment/lib/jquery.payment.js',
            'vendor/knockout-validation/Dist/knockout.validation.min.js',
            'vendor/knockout/index.js'
        ],
        asset_styles: [
            'vendor/jasmine/lib/jasmine-2.0.0/**/*.css'
        ],
        asset_images: [
            'vendor/jasmine/lib/jasmine-2.0.0/**/*.png'
        ]
    },
    destinations = {
        images: 'build/img',
        build: 'build/',
        html: 'build/',
        docs: 'build/',
        js: 'build/js/',
        css: 'build/css/'
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
    return gulp.src(sources.scss)
        .pipe(plumber())
        .pipe(sass(
            // {
            //     outputStyle: "compressed"
            // }
        ))
        .pipe(gulp.dest(destinations.build));
});
gulp.task('coffee:compile', function(event) {
    return gulp.src('src/coffee/test/*.coffee')
        .pipe(plumber())
        .pipe(coffee())
        .pipe(gulp.dest(destinations.build + 'test/'));

});
// gulp.task('scripts', function(event) {
//     gulp.src('src/coffee/test/*.coffee')
//         .pipe(plumber())
//         .pipe(coffee())
//         .pipe(gulp.dest(destinations.build));
//     return
// });
gulp.task('jade:compile', function(event) {
    return gulp.src(sources.jade)
        .pipe(plumber())
        .pipe(jade({
            pretty: true
        }))
        .pipe(gulp.dest(destinations.html))
});
gulp.task('image-assets:load', function(event) {
    return gulp.src(sources.asset_images, {base: "./"})
        .pipe(gulp.dest(destinations.images));
});
gulp.task('script-assets:load', function(event) {
    return gulp.src(sources.asset_scripts, {base: "./"})
        .pipe(gulp.dest(destinations.js));
});
gulp.task('style-assets:load', function(event) {
    return gulp.src(sources.asset_styles, {base: "./"})
        .pipe(gulp.dest(destinations.css));
});
gulp.task('assets:load', ['image-assets:load', 'script-assets:load', 'style-assets:load']);
gulp.task('dev', ['serve']);
gulp.task('default', ['dev', 'deploy:s3']);
