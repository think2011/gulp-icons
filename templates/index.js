let modules = {}

require("fs").readdirSync(__dirname)
    .forEach((file) => {
        if (/^index|^_/g.test(file)) return

        modules[file.split('.')[0]] = require(`./${file}`)
    })

module.exports = modules