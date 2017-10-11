'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var wrench = require('wrench');

var options = {
  src: 'src',
  dist: 'dist',
  tmp: '.tmp',
  e2e: 'e2e',
  errorHandler: function(title) {
    return function(err) {
      gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
      this.emit('end');
    };
  },
  wiredep: {
    directory: 'bower_components',
    exclude: []
  }
};

wrench.readdirSyncRecursive('./gulp').filter(function(file) {
  return (/\.(js|coffee)$/i).test(file);
}).map(function(file) {
  require('./gulp/' + file)(options);
});

gulp.task('version', function(){
  var p = require('./package.json');
  var replace = require('replace');

  gutil.log(' -- The version is: ' + p.version);

  replace({
    regex: "Version.*",
    replacement: "Version: " + p.version,
    paths: ['./src/app/components/footer/footer.html'],
    recursive: true,
    silent: true,
  });

});

gulp.task('default', ['clean'], function () {
    gulp.start('build');
});
