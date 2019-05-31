// 这个废弃了，如果使用electron-connenct可以用这个

var gulp = require('gulp');
var electron = require('electron-connect').server.create();

gulp.task('watch:electron', function () {
  electron.start();
  gulp.watch(['./src/main/**/*'], electron.restart);
  gulp.watch(['./src/renderer/build/**/*.{html,js,css}'], electron.reload);
});

// gulp watch:electron