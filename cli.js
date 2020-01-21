const path = require('path');
const fs = require('fs');
const program = require('commander');
const video = require('./video')
/*
几种路径:
(1)__dirname=C:\Users\huangjinlin\AppData\Roaming\npm\node_modules\lesson
(2)__filename=C:\Users\huangjinlin\AppData\Roaming\npm\node_modules\lesson\cli.js
(3)path.resolve(process.cwd())=D:\lesson\08-Ajax\Ajax-day01\视频
测试用的代码
fs.writeFile('d://1.txt', path.resolve(process.cwd()),{
    encoding: 'utf8'
},(err)=>{
 console.log(err)
})
*/

program
    .command('video')
    .description('统计视频时间')
    .action(onVedio);

//启动服务
program
    .parse(process.argv);

function onVedio() {
    let dir = path.resolve(process.cwd())
    video.writeFile(dir)
}    