这是关于 [有效解决 css sprite 图片使用 rem 单位边角缺失的问题](http://think2011.net/2017/03/31/css-sprite/) 的实践

![](http://think2011.qiniudn.com/gulp-icons-demo.gif)

## 依赖
    node >= 7.6.0

## 使用
 1. 修改 gulpfile.js 里 icons:sprite task定义的模板
 2. 要合成的图片放在src目录下
 3. `yarn run build`, 然后查看 dist 文件夹


## 注意！！
虽然项目以 gulp- 开头，但是非 gulp 插件，建议直接使用 gulp.spritesmith
