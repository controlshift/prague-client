// Load Plugins
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
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),
    concat = require('gulp-concat'),
    filter = require('gulp-filter'),
    s3 = require('gulp-s3'),
    gzip = require('gulp-gzip'),
    revall = require('gulp-rev-all'),
    cloudfront = require("gulp-cloudfront"),
    settings = require('./config/production.json'),
    aws = settings.aws,
    debug = require('gulp-debug'),
    replace = require('gulp-replace'),
    destinations = {
      public: 'public/',
      config: 'public/config/',
      docs: 'public/',
      js: 'public/js/',
      css: 'public/css/',
      img: 'public/img/',
      test: 'public/test/',
      build: 'build/',
      dist: 'dist/'
    },
    sources = {
        deployment: ['dist/**/*.*'],
        scss: 'src/scss/**/*.scss',
        clean: [destinations.public, destinations.dist, destinations.build],
        coffee: ['src/coffee/**/*.coffee'],
        jade: 'src/jade/**/*.jade',
        overwatch: 'public/**/*.*',
        config: 'src/config/*.json',
        asset_scripts: {
            test: [
                'vendor/jasmine/lib/jasmine-2.0.0/jasmine.js',
                'vendor/jasmine/lib/jasmine-2.0.0/jasmine-html.js',
                'vendor/jasmine/lib/jasmine-2.0.0/boot.js',
            ],
            dev: [
                'vendor/pusher/index.js',
                'vendor/stripe/index',
                "vendor/jquery.payment/jquery.payment.js",
                'vendor/knockout/index.js',
                'vendor/knockout-validation/Dist/knockout.validation.min.js'
            ]
        },
        asset_styles: [
            'vendor/jasmine/lib/jasmine-2.0.0/**/*.css'
        ],
        asset_images: [
            'src/img/**/*.*'
        ]
    },
    options = {
        s3: {
                gzippedOnly: true,
                headers: {
                    'Cache-Control': 'max-age=315360000, no-transform, public'
                }
            }
    };
/** serve; sets up a static server with livereload **/
gulp.task('serve', function(event) {
    connect.server({
    root: destinations.docs,
    port: 1987,
    livereload: true
  });
  watch({glob: sources.overwatch})
    .pipe(connect.reload());
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
        .pipe(concat('jquery.donations.css'))
        .pipe(sass()) // use outputStyle: 'compressed' for minifications.
        .pipe(gulp.dest(destinations.css));
});
/** Coffee:compile; compiles coffeescript **/
gulp.task('coffee:compile', function(event) {
    var loaderFilter = filter('donations-loader.coffee'),
        donationsFormFilter = filter('*form*.coffee'),
        casperFilter = filter('test/*feature.coffee'),
        jasmineFilter = filter('test/*spec.coffee');
    return gulp.src(sources.coffee, {base: './src/coffee/'})
        .pipe(plumber())
        .pipe(loaderFilter)
        .pipe(concat('jquery.donations.loader.coffee'))
        .pipe(coffee())
        .pipe(gulp.dest(destinations.js))
        .pipe(loaderFilter.restore())
        .pipe(donationsFormFilter)
        .pipe(concat('jquery.donations.coffee'))
        .pipe(coffee({
            bare: true
        }))
        .pipe(gulp.dest(destinations.js))
        .pipe(donationsFormFilter.restore())
        .pipe(casperFilter)
        .pipe(concat('test/casper.coffee'))
        .pipe(coffee())
        .pipe(gulp.dest(destinations.js))
        .pipe(casperFilter.restore())
        .pipe(jasmineFilter)
        .pipe(coffee())
        .pipe(gulp.dest(destinations.js))
        .pipe(jasmineFilter.restore());
});

gulp.task('config:watch', function(event) {
    watch({glob: sources.config }, ['config:push']);
});
/** Config:push; pushes over widget config **/
gulp.task('config:push', function(event) {
    return gulp.src(sources.config)
        .pipe(gulp.dest(destinations.config));
});
/** Jade:compile; compiles jade source **/
gulp.task('jade:compile', function(event) {
    return gulp.src(sources.jade)
        .pipe(plumber())
        .pipe(jade({
            data: {
                vendor_scripts: sources.asset_scripts
            },
            pretty: true
        }))
        .pipe(gulp.dest(destinations.docs))
});

/** Scss:watch; watch for scss source changes **/
gulp.task('scss:watch', function(event) {
    watch({glob: sources.scss }, ['scss:compile']);
});

/** Coffee:watch; watch for coffeescript source changes and compile as necessary **/
gulp.task('coffee:watch', function(event) {
    watch({glob: sources.coffee}, ['coffee:compile']);
});

/** Jade:watch; watch for jade source changes and compile as necessary **/
gulp.task('jade:watch', function(event) {
    watch({glob: sources.jade }, ['jade:compile']);
});

/** Watch; watch for source changes and run necessary compilation during development **/
gulp.task('watch', ['jade:watch', 'coffee:watch', 'scss:watch', 'config:watch']);

/** Script-assets:load; load vendor scripts **/
gulp.task('script-assets:load', function(event) {
    gulp.src('src/js/vendor/jquery.payment/*.js', {base: "./src/js/"})
        .pipe(gulp.dest(destinations.js));
    return gulp.src(sources.asset_scripts.test.concat(sources.asset_scripts.dev), {base: "./"})
        .pipe(gulp.dest(destinations.js));
});

/** Style-assets:load; load vendor styles **/
gulp.task('style-assets:load', function(event) {
    gulp.src('src/css/vendor/cleanslate/*.css', {base: "./src/css/"})
        .pipe(gulp.dest(destinations.css));
    return gulp.src(sources.asset_styles, {base: "./"})
        .pipe(gulp.dest(destinations.css));
});
/** Image-assets:load; loads icons and images **/
gulp.task('image-assets:load', function(event) {
    return gulp.src(sources.asset_images, {base: "./src/img"})
        .pipe(gulp.dest(destinations.img));
});

/** Build:script; concats all vendor scripts and donations scripts into one and then minifies to dist folder. **/
gulp.task('dist:script', function(event) {
  var coffeeFilter = filter('*form*.coffee'),
    loaderFilter = filter('*loader.coffee'),
    jsFilter = filter('!**/*.coffee');
  return gulp.src(sources.coffee.concat(sources.asset_scripts.dev).concat(['src/js/vendor/**/*.js']))
    .pipe(plumber())
    .pipe(coffeeFilter)
    .pipe(concat('jquery.donations.coffee'))
    .pipe(coffee({
      bare:true
    }))
    .pipe(coffeeFilter.restore())
    .pipe(jsFilter)
    .pipe(concat('jquery.donations.js'))
    .pipe(gulp.dest(destinations.build))
    .pipe(uglify())
    .pipe(gulp.dest(destinations.build))
    .pipe(jsFilter.restore())
    .pipe(loaderFilter)
    .pipe(concat('jquery.donations.loader.js'))
    .pipe(coffee())
    .pipe(gulp.dest(destinations.build))
    .pipe(uglify())
    .pipe(gulp.dest(destinations.build));
});

/** dist:style; packages up styles **/
gulp.task('dist:style', function(event) {
  var scssFilter = filter('**/*.scss');
  return gulp.src(['src/css/vendor/**/*.css', sources.scss])
    .pipe(concat('jquery.donations.css'))
    .pipe(sass())
    .pipe(gulp.dest(destinations.build))
    .pipe(sass({
      outputStyle: "compressed"
    }))
    .pipe(gulp.dest(destinations.build));
});

/** Applies revisions for cache busting **/
gulp.task('dist:version', function(event) {
  return gulp.src(['build/jquery.donations.js', 'build/jquery.donations.css', 'build/jquery.donations.loader.js'])
    .pipe(revall({prefix: settings.cdnUrl}))
    .pipe(replace(/praguecloudfronturl/g, settings.cdnUrl))
    .pipe(gulp.dest(destinations.dist))
});

/** Deploy:S3; gzips sources and deploys to S3.**/
gulp.task('deploy:s3', function(event) {
  return gulp.src(sources.deployment)
    .pipe(gzip())
    .pipe(s3(aws, options.s3)
    .pipe(cloudfront(aws))
    );
});

gulp.task('dist', ['dist:script', 'dist:style', 'dist:images'], function(event) {
    return gulp.start('dist:version');
  }
);

gulp.task('dist:images', function() {
  return gulp.src('src/img/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/img')
  );
});

/** Assets:load; loads all css and js assets **/
gulp.task('assets:load', ['script-assets:load', 'style-assets:load', 'image-assets:load']);
/** Dev; sets up the development environment so you can hack away on a server **/
gulp.task('dev', ['assets:load', 'serve', 'watch']);
gulp.task('default', ['dev']);
