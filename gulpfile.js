// ========== DEPENDENCES ==========
const { src, dest, watch, series } = require("gulp"),
sass = require('gulp-sass')(require('sass')),
prefix = require("gulp-autoprefixer"),
minify = require("gulp-clean-css"),
terser = require("gulp-terser"),
imagemin = require("gulp-imagemin"),
imagewebp = require("gulp-webp"),
webserver = require('gulp-webserver'),
concat = require('gulp-concat');

// ========== SCSS ==========

function compileScss() {
    return src("src/scss/*.scss")
        .pipe(sass().on('error', sass.logError))
        .pipe(prefix({
			cascade: false
		}))
        .pipe(minify())
        .pipe(concat("style.css"))
        .pipe(dest("../project-boilerplate"))
}

// ========== JS ==========

function jsMin() {
    return src("src/js/*.js")
        .pipe(terser())
        .pipe(concat("app.js"))
        .pipe(dest("../project-boilerplate"))
}

// ========== IMAGES ==========

function optimizeImg() {
    return src("src/image/*.{jpg,png}")
        .pipe(imagemin([
            imagemin.mozjpeg({ quality:80, progressive: true }),
            imagemin.optipng({ optimizationLevel: 2 })
        ]))
        .pipe(dest("image"))
}

// ========== WEBP IMAGES ==========

function webpImage() {
    return src("image/*.{jpg,png}")
    .pipe(imagewebp())
    .pipe(dest("image"))
}

// ========== SERVER ==========

function launchServer() {
    return src("../project-boilerplate")
        .pipe(webserver({
            livereload: true,
            port: "4000",
            open: true
        }));
}

// ========== WATCH ==========

function watchTask() {
    watch("src/scss/*.scss", compileScss)
    watch("src/js/*.js", jsMin)
    watch("src/image/*.{jpg,png}", optimizeImg)
    watch("image/*.{jpg,png}", webpImage)
}

// ========== DEFAULT ==========

exports.default = series(
    compileScss,
    jsMin,
    optimizeImg,
    webpImage,
    launchServer,
    watchTask
)