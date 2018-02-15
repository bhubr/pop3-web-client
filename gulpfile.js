const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const browserify = require('browserify');
const watchify = require('watchify');
const babelify = require('babelify');
const pathmod = require('pathmodify');
const babel = require('gulp-babel');
const gutil = require('gulp-util');
const Promise = require('bluebird');
const fs = require('fs');
Promise.promisifyAll(fs);

const srcDir = __dirname + '/src/';


function readModels(baseDir) {
  return fs.readdirAsync(srcDir + baseDir + 'models');
}

function prepareTmpModelDir(baseDir) {
  return readModels('')
  .then(tmpModelFiles => Promise.map(tmpModelFiles,
    f => fs.unlinkAsync(srcDir + 'dist/models/' +f)
  ));
}

function copyTmpModels(baseDir) {
  return readModels(baseDir)
  .then(modelFiles => Promise.map(modelFiles,
    f => fs.copyFileAsync(srcDir + baseDir + 'models/' + f, srcDir + 'dist/models/' + f)
  ))
}


function buildClient(watch, done) {
  var bundler =
    browserify('./src/client/main.js', { debug: true })
      .plugin(pathmod, {mods: [
        pathmod.mod.dir('node_modules', __dirname + '/node_modules'),
      ]})
      // Transform JSX      https://github.com/andreypopp/reactify/issues/58
      // Fix unexpected ... https://github.com/babel/babel-loader/issues/170
      .transform(babelify, { presets: ['es2015', 'stage-0', 'react'] });

  return copyTmpModels('client/')
  .then(() => new Promise(function (resolve, reject) {
    bundler.bundle()
      .on('error', function(err) { console.error(err); this.emit('end'); })
      .pipe(source('build.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./public/js/dist'))
      .on('end', resolve);
  }));
}

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
      .pipe(gulp.dest('./dist'))
      .on('end', resolve);
  });
}

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
