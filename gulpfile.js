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
                        /*
                         * 加大单位的数值解决浏览器对小数解析精度导致图片边角缺失的问题
                         */
                        let prevStr = `
/* rem */
$designWidth: 750;
@function _px($px) {
  @return $px*320/$designWidth/20 + rem;
}

.icon {
  display: inline-block;
  position: relative;
}
                        `
                        let cssItem = sprite.sprites.map((item) => {
                            return `
.${name}-${item.name} {
  width: _px(${item.width});
  height: _px(${item.height});

  &:after {
    content: '';
    width: 10000%;
    height: 10000%;
    position: absolute;
    left: 0;
    top: 0;
    background: url(${item.escaped_image}) no-repeat _px(-${item.x * 100}) _px(-${item.y * 100});
    background-size: _px(${item.total_width * 100}) _px(${item.total_height * 100});
    -webkit-transform-origin: 0 0;
    -webkit-transform: scale(.01);
    transform-origin: 0 0;
    transform: scale(.01);
  }
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