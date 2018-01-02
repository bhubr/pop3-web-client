var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var babel = require('babelify');
var pathmod = require('pathmodify');


function compile(watch, done) {
  var bundler = watchify(
    browserify('./src/client/main.js', { debug: true })
      .plugin(pathmod(), {mods: [
        pathmod.mod.dir('node_modules', __dirname + '/node_modules'),
      ]})
      // Transform JSX      https://github.com/andreypopp/reactify/issues/58
      // Fix unexpected ... https://github.com/babel/babel-loader/issues/170
      .transform(babel, { presets: ['es2015', 'stage-0', 'react'] })
  );

  function rebundle() {
    bundler.bundle()
      .on('error', function(err) { console.error(err); this.emit('end'); })
      .pipe(source('build.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./public/js/dist'));
  }

  if (watch) {
    bundler.on('update', function() {
      console.log('-> bundling...');
      rebundle();
    });
  }

  rebundle();
  done();
}

function watch(done) {
  return compile(true, done);

}

// gulp.task('build', function() { return compile(); });
// gulp.task('watch', function() { return watch(); });

gulp.task('default', watch);
