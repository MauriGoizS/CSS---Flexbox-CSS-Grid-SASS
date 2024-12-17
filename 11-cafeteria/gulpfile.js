const { src, dest, watch, series, parallel } = require('gulp');

// =============Dependencias=============

// CSS y SASS
const sass         = require('gulp-sass')(require('sass'))
const postcss      = require('gulp-postcss');
const autoprefixer = require('autoprefixer');

// Imagenes
const imagemin = require('gulp-imagemin');
const avif = require('gulp-avif');

function css(  done ) {
    // Compilar sass
    // pasos: 1 - Identificar archivo, 2 - Compilarla, 3 - Guardar el .css

    src('src/scss/app.scss')
        .pipe( sass() ) // Para expandir, cambiarlo por  "expanded" 
        .pipe( postcss([ autoprefixer() ]) )
        .pipe( dest('build/css') )

    done();
};

function imagenes() {
    return src('src/img/**/*')
        .pipe( imagemin({ optimizationLevel: 3 }) )
        .pipe( dest( 'build/img' ) );
}

async function versionWebp() {
    const webp = (await import('gulp-webp')).default; // Importación dinámica
        const opciones = {
        quality: 50
    }
    return src('src/img/**/*.{png,jpg}')
        .pipe( webp( opciones ) )
        .pipe( dest( 'build/img' ) );
}

function versionAvif() {
    const opciones = {
        quality: 50
    }
    return src('src/img/**/*.{png,jpg}')
        .pipe( avif( opciones ) )
        .pipe( dest('build/img'))
}

function dev() {
    watch( 'src/scss/**/*.scss', css );
    watch('src/img/**/*', imagenes);
};

exports.css      = css;
exports.dev      = dev;
exports.imagenes = imagenes;
exports.versionWebpwebp = versionWebp;
exports.versionAvif     = versionAvif;
exports.default  = series( imagenes, versionWebp, versionAvif, css, dev );

// series - Se inicia una tarea, y hasta que finaliza, inicia la siguiente
// parallel - Todas inician al mismo tiempo