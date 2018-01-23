var gulp = require('gulp'),
    gutil = require('gulp-util'),
    del = require('del');

// Include all dev dependencies of package.json
var plugins = require('gulp-load-plugins')();

// folder configuration
// !! angular module first for concatenation
var libJs = [
        './node_modules/jquery/dist/jquery.min.js',
        './node_modules/angular/angular.min.js',
        './node_modules/angular-aria/angular-aria.min.js',
        './node_modules/angular-material/angular-material.min.js',
        './node_modules/angular-animate/angular-animate.min.js',
        './node_modules/angular-messages/angular-messages.min.js',
        './node_modules/@uirouter/angularjs/release/angular-ui-router.min.js',
        './node_modules/angular-storage/dist/angular-storage.min.js',
        './node_modules/angular-deferred-bootstrap/angular-deferred-bootstrap.min.js'
    ],
    libCss = ['./node_modules/angular-material/angular-material.min.css'],
    sourceJs = ['./client/app/app.module.js', './client/app/**/*.js'],
    sourcePug = './client/views/**/*.pug',
    sourceSass = './client/views/stylesheets/*.sass',
    destination = './client/public/js',
    destinationCss = './client/public/stylesheets',
    finalJs = 'client.js',
    installFiles = [
        './client/app/**',
        './client/views/**',
        './server/**',
        './app.js',
        './config.js'
    ];

// to get string to replace for installation
var installCfg = require('./front-install.json'),
    tabReplace = [];
Object.keys(installCfg).map(function(key) {
    var rp = [];
    rp.push('#' + key + '#');
    rp.push(installCfg[key]);
    tabReplace.push(rp);
});

// concatenation of all client js
gulp.task('concat', function() {
    return gulp.src(sourceJs)
        .pipe(plugins.concat(finalJs))
        .pipe(gulp.dest(destination))
        .pipe(plugins.livereload());
});

// minification of client js
gulp.task('uglify', function() {
    return gulp.src(destination + finalJs)
        .pipe(plugins.uglify({
            mangle: {
                toplevel: true
            }
        }))
        .pipe(plugins.rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(destination))
        .pipe(plugins.livereload());
});

// copy of public js libraries
gulp.task('copy-js', function() {
    return gulp.src(libJs)
        .pipe(gulp.dest(destination));
});

// copy of public css libraries
gulp.task('copy-css', function() {
    return gulp.src(libCss)
        .pipe(gulp.dest(destinationCss));
});

// replace strings
gulp.task('replace', function() {
    return gulp.src(installFiles, {
            base: './'
        })
        .pipe(plugins.batchReplace(tabReplace))
        .pipe(gulp.dest('./'));
});

gulp.task('clean', function() {
    return del([
        '/client/public/js/*',
        '/client/public/stylesheets/*'
    ]);
});

// watch files for reload
gulp.task('watch', function() {
    plugins.livereload.listen();
    gulp.watch(sourceJs, ['concat']);
    gulp.watch(sourceSass, []);
    gulp.watch(sourcePug, []);
});

// task of installation (replace config and copy css and js lib)
gulp.task('install', ['clean', 'replace', 'copy-css', 'copy-js', 'concat']);
// default task (production)
gulp.task('default', ['clean', 'copy-css', 'copy-js', 'concat', 'uglify']);