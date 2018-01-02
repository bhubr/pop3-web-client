var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');
var pathmod = require('pathmodify');
var babel = require('gulp-babel');

//
function buildClient(watch, done) {
  // var bundler = watchify(
  var bundler =
    browserify('./src/client/main.js', { debug: true })
      .plugin(pathmod(), {mods: [
        pathmod.mod.dir('node_modules', __dirname + '/node_modules'),
      ]})
      // Transform JSX      https://github.com/andreypopp/reactify/issues/58
      // Fix unexpected ... https://github.com/babel/babel-loader/issues/170
      .transform(babelify, { presets: ['es2015', 'stage-0', 'react'] });
  //   );
  //
  //   var bundler2 = watchify(

  //   );
  //
  //
  //   function rebundle() {
  return new Promise(function (resolve, reject) {
    bundler.bundle()
      .on('error', function(err) { console.error(err); this.emit('end'); })
      .pipe(source('build.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./public/js/dist'))
      .on('end', resolve);
  });
//   }
//
//   if (watch) {
//     bundler.on('update', function() {
//       console.log('-> bundling client');
//       rebundle();
//     });
//     bundler2.on('update', function() {
//       console.log('-> bundling server');
//       rebundle();
//     });
//   }
//
//   rebundle();
//   done();
}
//
// function watch(done) {
//   return compile(true, done);
//
// }
function buildServer() {
  return new Promise((resolve, reject) => {
    gulp.src(['src/server/**/*.js', 'src/common/**/*.js'])
      .pipe(babel({
        presets: [
          ['env', {
            'targets': {
              'node': 'current'
            }
          }],
          'es2015', 'stage-0', 'react'],
        plugins: [
          ['transform-runtime', {
            'regenerator': true,
            'moduleName': 'babel-runtime'
          }]
        ]
      }))
      .pipe(gulp.dest('./'))
      .on('end', resolve);
  });
}

// gulp.task('build', function() { return compile(); });
gulp.task('watch', function() {
  gulp.watch(['src/client', 'src/common'], buildClient);
  gulp.watch(['src/server', 'src/common'], buildServer);
});

gulp.task('build:client', function() {
  return buildClient();
});

gulp.task('build:server', function() {
  return buildServer();
});


gulp.task('default', gulp.series('build:client', 'build:server', 'watch'));
