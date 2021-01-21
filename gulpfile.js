const gulp = require('gulp');
const cleanCss = require('gulp-clean-css');
const htmlmin = require('gulp-html-minifier-terser');
const htmlClean = require('gulp-htmlclean');

const uglify = require('gulp-uglify');
const babel = require('gulp-babel');

// js babel处理和压缩
gulp.task('compress', () => {
  return gulp.src(['./public/**/*.js', '!./public/**/*.min.js'])
    .pipe(babel({
      presets: ['@babel/preset-env']
    }))
    .pipe(uglify().on('error', (e) => {
      console.log('js压缩错误', e);
    }))
    .pipe(gulp.dest('./public'));
});

// css 压缩
gulp.task('minify-css', () => {
  return gulp.src('./public/**/*.css')
    .pipe(cleanCss())
    .pipe(gulp.dest('./public'));
});

// html 压缩
gulp.task('minify-html', () => {
  return gulp.src('./public/**/*.html')
    .pipe(htmlClean())
    .pipe(htmlmin({
      removeComments: true, // 清除HTML注释
      collapseWhitespace: true, // 压缩HTML
      collapseBooleanAttributes: true, // 省略布局属性的值 <input checked="true"/> ==> <input />
      removeEmptyAttributes: true, // 刪除所有空格作屬性值 <input id="" /> ==> <input />
      removeScriptTypeAttributes: true, // 刪除 <script> 的 type="text/javascript"
      removeStyleLinkTypeAttributes: true, // 刪除 <style> 和 <link> 的 type="text/css"
      minifyJS: true, // 压缩頁面 JS
      minifyCSS: true, // 压缩頁面 CSS
      minifyURLs: true
    }))
    .pipe(gulp.dest('./public'))
});

// 默认任务
gulp.task('default', gulp.parallel(
  'compress', 'minify-css', 'minify-html'
));