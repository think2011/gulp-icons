module.exports = function (name, sprite) {
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