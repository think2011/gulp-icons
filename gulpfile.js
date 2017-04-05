const gulp        = require('gulp')
const fsp         = require('fs-promise')
const $           = require('gulp-load-plugins')()
const runSequence = require('run-sequence')
const templates   = require('./templates')

let staticDir = `.`
let paths     = {
    src : `${staticDir}/src`,
    dist: `${staticDir}/dist`
}

gulp.task('icons:sprite', async (cb) => {
    let dirs = await fsp.readdir(paths.src)
    dirs     = dirs.filter((item) => item[0] !== '.')
    dirs.unshift('')

    let fns = dirs.map((dir) => {
        return new Promise((resolve, reject) => {
            let name = dir === '' ? '_' : dir
            let src  = name !== '_' ? `${paths.src}/${dir}/*.+(gif|png|jpg)` : `${paths.src}/*.+(gif|png|jpg)`

            gulp.src(src)
                .pipe($.spritesmith({
                    padding: 15,
                    imgName: `${name}.png`,
                    cssName: `${name}.scss`,
                    cssTemplate(sprite){
                        return templates.rem(name, sprite)
                    }
                }))
                .pipe(gulp.dest(paths.dist))
                .on('end', resolve)
        })
    })

    return await Promise.all(fns)
})

gulp.task('icons:css', ['icons:sprite'], () => {
    return gulp.src(`${paths.dist}/*.scss`)
        .pipe($.sass().on('error', $.sass.logError))
        .pipe(gulp.dest(paths.dist))
})


gulp.task('default', () => {
    gulp.start('icons:css')
})