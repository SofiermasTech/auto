const { src, dest, watch, parallel } = require('gulp');

const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();



function watching() {
   browserSync.init({
      server: {
         baseDir: '/'
      }
   });
   watch(['js/*.js'], scripts)
}

function scripts() {
   return src([
      'js/*.js',
      '!js/main.min.js',
      '!js/catalog.js',
      '!js/aos.js',
      '!ion.rangeSlider.min'
   ])
      .pipe(concat('main.min.js'))
      .pipe(uglify())
      .pipe(dest('js'))
      // .pipe(browserSync.stream())
}



exports.scripts = scripts;
exports.watching = watching;


exports.default = parallel(scripts);