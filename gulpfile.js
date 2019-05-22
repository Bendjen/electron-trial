var gulp = require('gulp');
var electron = require('electron-connect').server.create();
process.env['NODE_ENV'] = 'development'
gulp.task('watch:electron', function () {
  electron.start();
  gulp.watch(['./src/main/**/*'], electron.restart);
  gulp.watch(['./src/renderer/build/**/*.{html,js,css}'], electron.reload);
});