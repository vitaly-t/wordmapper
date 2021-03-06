/**
 * Gulp Tasks
 * --------------------------------------------------------------------
 *
 * USAGE:
 * 
 *    $ gulp build -- Build the JS using webpack
 *    $ gulp watch -- Watch the JS client files and automatically rebuild (via webpack).
 *    $ gulp migrate -- Migrate to the latest version of the server database 
 *    $ gulp test -- Run the JS unit tests
 *
 * NOTES:
 * -The default task when you execute "gulp" without any arguments is to build the JS.
 */

var path = require('path');
var gulp = require('gulp');
var rename = require('gulp-rename');
var exec = require('child_process').exec;
var webpack = require('webpack-stream');
var WebpackConfig = require(path.resolve('webpack.config.js'));

gulp.task('webpack', function() {
  return gulp.src('wordmapper/client/src/app.js')
    .pipe(webpack(WebpackConfig))
    .pipe(gulp.dest('wordmapper/client/dist/'));
});

gulp.task('copy', ['webpack'], function() {
  return gulp.src('wordmapper/client/dist/app.js')
    .pipe(rename('bookmarklet.js'))
    .pipe(gulp.dest('wordmapper/server/src/public/js/'));
});

gulp.task('build', ['webpack', 'copy']);

gulp.task('migrate', function(done) {
  exec('node ./wordmapper/server/src/migrate.js max', function(err, stdout, stderr) {
    if (err) {
      console.error(err);
      return done(err);
    }
    console.log(stdout);
    done();
  });
});

gulp.task('testclient', function (done) {
  // This is equivalent to shell command:
  //     $ karma start karma.conf.js --single-run
  var envCopy = {};
  for (e in process.env) {
    envCopy[e] = process.env[e];
  }
  exec('karma start karma.conf.js --single-run', {env:envCopy}, function(err, stdout, stderr) {
    if (err) {
      console.error(err);
      return done(err);
    }
    console.log(stdout);
    done();
  });
});

gulp.task('testserver', function(done) {
  // This is equivalent to shell command:
  //     $ jasmine JASMINE_CONFIG_PATH=jasmine.server.json
  var envCopy = {};
  for (e in process.env) {
    envCopy[e] = process.env[e];
  }
  envCopy.JASMINE_CONFIG_PATH = path.resolve('jasmine.server.json')
  exec('jasmine', {env: envCopy}, function(err, stdout, stderr) {
    if (err) {
      console.error(err);
      return done(err);
    }
    console.log(stdout);
    done();
  });
});

gulp.task('test', ['testserver', 'testclient']);

gulp.task('watch', function() {
  var watcher = gulp.watch('wordmapper/client/src/**/*', ['build']);
  watcher.on('change', function(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  });
  return watcher;
});

gulp.task('default', ['build']);
