const { src, dest, series } = require('gulp');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');

// Minify CSS
function minifyCSS() {
  return src('css/xcustom-style.css')
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(rename('custom-style.css'))
    .pipe(dest('css'));
}

// Uglify JS
function uglifyJS() {
  return src(['js/xapp.js', 'js/xmethods.js'])
    .pipe(uglify())
    .pipe(rename((path) => {
      if (path.basename === 'xapp') {
        path.basename = 'app';
      } else if (path.basename === 'xmethods') {
        path.basename = 'methods';
      }
    }))
    .pipe(dest('js'));
}

// Default task
exports.default = series(minifyCSS, uglifyJS);