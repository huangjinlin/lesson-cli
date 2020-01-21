const fs = require('fs')
const path = require('path')
//获取文件夹下所有的视频文件名称列表
function getVideFiles (dir) {
  return new Promise((resolve, reject)=>{
    fs.readdir(dir,{encoding: 'utf8'},(err,files)=>{
      let a = files.filter((t)=>[".avi"].includes(path.extname(t)))
      // console.log(a);
      resolve(a)
    })
  })
}
// getVideFiles(__dirname).then((files)=>{
//   console.log(files)
// })
//根据视频文件的绝对路径获取该文件的时长
function getVideDuration(url){
  return new Promise((resolve, reject)=>{
    var exec = require('child_process').exec;
    var cp = exec('D:\\sofeware\\ffmpeg-20200115-0dc0837-win64-static\\bin\\ffmpeg -i '+url,function(err,stdout,stderr){
        var outStr = stderr.toString();
        // console.log(outStr);
        var regDuration =/Duration\: ([0-9\:\.]+),/;
        var rs = regDuration.exec(outStr);
        if(rs[1]){
            var duration = rs[1].trim();
            var hour = parseInt(duration.substr(0, 2))
            var minute = parseInt(duration.substr(3, 2))
            var second = parseInt(duration.substr(6, 2))
            var seconds = minute*60+second
            // console.log('hour', hour, 'minute', minute, 'second',second);
            //获得时长
            resolve({
              duration,
              hour,
              minute,
              second,
              seconds
            })
        }
    })
  })
}
// getVideDuration("\""+path.join(__dirname, '01-Ajax概述及应用场景.avi')+"\"").then((o)=>{
//   console.log('duration', o);
// })
//生成目录下的文件时长的统计的html文件
function writeFile(dir){
  getVideFiles(dir).then((files)=>{
    // console.log(files)
    // 视频统计用的promise数组
    var pVideDuration = []
    var a = []
    for(let i = 0; i<files.length; i++){
      a[i] = {name: files[i],selected: true}
      let p = getVideDuration("\""+path.join(dir, files[i])+"\"")
      pVideDuration.push(p)
      p.then((o)=>{
        Object.assign(a[i], o)
        // console.log(a[i])
      })
    }
    Promise.all(pVideDuration).then(()=>{
      var content = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="X-UA-Compatible" content="ie=edge">
          <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
          <title></title>
        </head>
        <body style="padding: 20px;">
          <div id="app">
            <div class="alert alert-primary" role="alert">{{totalTime}}</div>
            <table class="table table-striped">
              <thead>
                <tr>
                  <th scope="col"><input type="checkbox" v-model="allSelect"></th>
                  <th scope="col">#</th>
                  <th scope="col">名称</th>
                  <th scope="col">时长</th>
                </tr>
              </thead>
              <tbody>
                <tr :key="index" v-for="(item, index) in fileList">
                  <td><input type="checkbox" v-model="item.selected"></td>
                  <td>{{index+1}}</td>
                  <td>{{item.name}}</td>
                  <td>{{item.minute<10? '0'+item.minute : item.minute}} : {{item.second<10?'0'+item.second : item.second}}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </body>
        <script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossorigin="anonymous"></script>
        <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
        <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>
        <script src="https://cdn.bootcss.com/vue/2.6.10/vue.min.js"></script>
        <script>
        var vm = new Vue({
          el: '#app',
          data: {
            fileList: ${JSON.stringify(a)}
          },
          computed: {
            totalTime(){
              let hour = 0, minute = 0, second = 0;
              this.fileList.forEach(e => {
                if(e.selected) second+=e.seconds
              })
              minute = parseInt(second/60); //算出一共有多少分钟
              second%=60;//算出有多少秒
              if(minute>60) { //如果分钟大于60，计算出小时和分钟
                  hour = parseInt(minute/60);
                  minute%=60;//算出有多分钟
              }
              return hour>0 ? hour+"小时"+minute+"分"+second+"秒" : minute+"分"+second+"秒"
            },
            allSelect: {
              get(){
                return this.fileList.every((item) => item.selected)
              },
              set(v){
                this.fileList.forEach((item) => {
                item.selected = v
                })
              }
            }
          }
        })
        </script>
        </html>`
      fs.writeFile(path.join(dir, 'index.html'), content, {encoding: 'utf8'}, function(){})
      // console.log('pa.length', pa.length)
      console.log('生成html完成');
    }).then(()=>{                               
        //删除文件用的数组
        var pUnlinkFile = []
        for(let i = 0; i<files.length; i++){
            let p = unlinkFile(path.join(dir, files[i]))
            pUnlinkFile.push(p)
        }
        Promise.all(pUnlinkFile).then(()=>{
            console.log('删除文件完成')
        })
    })
  })
}
//删除文件
function unlinkFile(path){
    return new Promise((resolve, reject)=>{
        fs.unlink(path, ()=>{
            resolve()
        })
    })
}
module.exports = {
    getVideFiles,
    getVideDuration,
    writeFile
}

