module.exports = function (name, sprite) {
    let prevStr = `
.icon {
  display: inline-block;
}
`
    let cssItem = sprite.sprites.map((item) => {
        return `
.${name}-${item.name} {
  width: ${item.width}px;
  height: ${item.height}px;
  background: url(${item.escaped_image}) no-repeat -${item.x}px -${item.y}px;
  background-size: ${item.total_width}px ${item.total_height}px;
}
`
    })

    return prevStr + cssItem.join('')
}