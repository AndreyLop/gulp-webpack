var gulp = require('gulp'),
  rename = require('gulp-rename'),
  uglify = require('gulp-uglify'),
  webpackStream = require('webpack-stream'),
  sass = require('gulp-sass'),
  autoprefixer   = require('gulp-autoprefixer'),
  browserSync    = require('browser-sync'),
  cleanCSS       = require('gulp-clean-css'),
  notify         = require("gulp-notify");

//webpack to use E.S.2015 
gulp.task('js', function () {
  return gulp.src('./src/js/app.js')
    .pipe(webpackStream({
      mode: 'development',
      output: {
        filename: 'app.js',
      },
      module: {
        rules: [
          {
            test: /\.(js)$/,
            exclude: /(node_modules)/,
            loader: 'babel-loader',
            query: {
              presets: ['@babel/preset-env']
            }
          }
        ]
      }
    }))
    .pipe(gulp.dest('./dist/js/'))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('./dist/js/'))
    .pipe(browserSync.reload({stream: true}));
});

// SASS to CSS
gulp.task('sass', function() {
	return gulp.src(['src/sass/**/*.sass', 'src/sass/**/*.scss'])
	.pipe(sass({outputStyle: 'expand'}).on("error", notify.onError()))
	.pipe(rename({suffix: '.min', prefix : ''}))
	.pipe(autoprefixer(['last 15 versions']))
	.pipe(cleanCSS())
	.pipe(gulp.dest('dist/css'))
	.pipe(browserSync.reload({stream: true}));
});

// Browser Sync
gulp.task('browser-sync', function() {
	browserSync({
		//proxy: "http://localhost:80/academkvartal/dist",
		proxy: "supersite/dist",
    	notify: false
	});
});

gulp.task('watch', ['sass', 'js', 'browser-sync'], function() {
	gulp.watch('src/sass/**/*.scss', ['sass']);
	gulp.watch('src/**/*.js', ['js']);
	gulp.watch('dist/**/*.php', browserSync.reload);
	gulp.watch('dist/*.html', browserSync.reload);
});

gulp.task('default', ['watch']);
