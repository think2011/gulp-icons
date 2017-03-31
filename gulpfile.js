const gulp        = require('gulp')
const fsp         = require('fs-promise')
const $           = require('gulp-load-plugins')()
const runSequence = require('run-sequence')

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
                        let prevStr = `
                        /* rem */
                        $designWidth: 750;
                        @function px2rem($px) {
                        @return $px*320/$designWidth/20 + rem;
                        }
                        
                        .icon {
                            display:inline-block;
                        }
                        `
                        let cssItem = sprite.sprites.map((item) => {
                            return `
                            .${name}-${item.name} {
                                width: px2rem(${item.width});
                                height: px2rem(${item.height});
                                background: url(${item.escaped_image}) no-repeat px2rem(-${item.x}) px2rem(-${item.y});
                                background-size: px2rem(${item.total_width}) px2rem(${item.total_height});
                            }
                            `
                        })

                        return prevStr + cssItem.join('')
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

function newTask() {

}