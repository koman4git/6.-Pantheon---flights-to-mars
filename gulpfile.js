let project_folder = "dist";
let source_folder = "src";

let path={
  build:{
      html: project_folder+"/",
      img: project_folder+ "/images/",
      
  },
  src: {
      html: source_folder+"/**/*.html", 
      images: source_folder+ "/images/**/*.{jpg,png,svg,gif.ico,webp}",
    },
  watch: {
    html: source_folder+"/**/*.html",
    images: source_folder+ "/images/**/*.{jpg,png,svg,gif.ico,webp}",
  },
  clean: "./" + project_folder + "/"
}

let {src, dest} = require('gulp');
    gulp = require('gulp'),
    browsersync = require('browser-sync').create();
    fileinclude = require('gulp-file-include');
    del = require('del');
    imagemin = require('gulp-imagemin');
    cleanCSS = require('gulp-clean-css');
    webp = require('gulp-webp');
    webpHTML = require('gulp-webp-html');
             

function browserSync(params) {
  browsersync.init({
    server:{
      baseDir: "./" + project_folder + "/"
    },
    port: 3000,
    notify: false
  })
}

function html(){
  return src(path.src.html)
      .pipe(fileinclude())
      .pipe(webpHTML())
      .pipe(dest(path.build.html))
      .pipe(browsersync.stream())
}
function img(){
  return src(path.src.images)
      .pipe(webp({
        quality: 70
      })
      )
      .pipe(dest(path.build.img))
      .pipe(src(path.src.images))
      .pipe(imagemin({
          interlaced: true,
          progressive: true,
          optimizationLevel: 4,
          svgoPlugins: [{removeViewBox: false}]
      }))
      .pipe(dest(path.build.img))
      .pipe(browsersync.stream())
}


function watchFiles(params){
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.images], img);
}

function clean(params){
    return del(path.clean);
}

let build = gulp.series(clean, gulp.parallel(html, img));
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.img = img;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;