const {src, dest, series, parallel, watch} = require('gulp');
const yarg = require('yargs');
const gulpif = require('gulp-if');
const del = require('del');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();


const PRODUCTION = yarg.argv.prod;

const paths = {
    style: {
        src: [
                'node_modules/normalize.css/normalize.css',
                'node_modules/animate.css/animate.min.css',
                'node_modules/@fortawesome/fontawesome-free/css/fontawesome.min.css',
                'src/assest/scss/**/*.scss'
            ],
        dest: 'dist/assest/css'
    },
    html: {
        src: 'src/**/*.html',
        dest: 'dist'
    },
    font: {
        src: 'node_modules/@fortawesome/fontawesome-free/webfonts/**',
        dest: 'dist/assest/webfonts'
    },
    images: {
        src: '',
        dest: ''
    },
    script: {
        src: [
            'node_modules/@fortawesome/fontawesome-free/js/fontawesome.min.js',
            'src/assest/js/**/*.js'
        ],
        dest: 'dist/assest/js'
    }
}

const clean = () => del('dist');

const font = () => {
    return src(paths.font.src)
        .pipe(dest(paths.font.dest));
}

const style = () => {
    return src(paths.style.src)
        .pipe(gulpif(!PRODUCTION, sourcemaps.init()))
        .pipe(sass().on('error', sass.logError))
        .pipe(gulpif(PRODUCTION, cleanCSS({compatibility: 'ie8'})))
        .pipe(gulpif(!PRODUCTION, sourcemaps.write()))
        .pipe(dest(paths.style.dest))
        .pipe(browserSync.stream());
}

const html = () => {
    return src(paths.html.src)
        .pipe(dest(paths.html.dest));
}

const script = () => {
    return src(paths.script.src)
        .pipe(dest(paths.script.dest));
}

const watchs = () => {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });
    watch('src/assest/scss/**/*.scss', style);
    watch('src/**/*.html', html).on('change', browserSync.reload);
}

exports.default =  series(clean, parallel(style, html, script, font), watchs);