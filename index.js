if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }
  
  require('colors');
  const glob = require("glob")
  const moveFile = require('move-file');
  const moment = require("moment");
  const path = require("path")
  const EasyFtp = require('easy-ftp');
  const watch = require('node-watch');
  const schedule = require('node-schedule');
  
  
  const rootFTP = process.env.ROOT_WATCH; 
  const rootFTP_remote = process.env.ROOT_REMOTE_FTP
  const root_move_ftp = process.env.ROOT_MOVE_FTP
  const ftp = new EasyFtp();
  // CONFIG 
  const config = {
    host: "125.212.251.161",
    port: 21,
    username: "collector",
    password: "c0llector",
    type: 'ftp'
  }
  
  let _countRetry = 0
  let _tiktok = 0
  const _tiktokLimit = 60
  
  setInterval(() => {
    _tiktok = _tiktok + 1
  }, 1000);
  
  ftp.connect(config);
  
  ftp.on("open", function (client) {
    console.log('connect FTP Success Full'.yellow);
    run()
  });
  ftp.on("close", function (err) {
    console.log('connect FTP close Full'.red, err);
    _countRetry = _countRetry + 1
    if (_countRetry >= 10) {
        process.exit(1)
    }
    setTimeout(() => {
        ftp.connect(config);
    }, 8000);
  });
  ftp.on("error", function (err) {
    console.log('connect FTP error'.red, err);
    _countRetry = _countRetry + 1
    if (_countRetry >= 10) {
        process.exit(1)
    }
    setTimeout(() => {
        ftp.connect(config);
    }, 8000);
  });
  
  const stack = []
  
  function run() {
    watch(rootFTP, { recursive: true }, function(evt, file) {
      console.log('%s changed.', file);
      if (evt == 'remove') {
          // on delete
          return
        }
        stack.push(file)
    });
  
    schedule.scheduleJob('*/6 * * * * *', async function(){
      if(stack.length <= 0) return
      let file = stack.shift()
      console.log(`total file current ${stack.length}`.bgYellow.black)
      const pathSource = file
      const pathRemote = rootFTP_remote + '/' + moment().format('YYYYMMDD') + '/' + path.relative(rootFTP, pathSource).replace(/\\/g, '/') 
      const pathMove = root_move_ftp + '/' + moment().format('YYYYMMDD') + '/' + path.relative(rootFTP, pathSource).replace(/\\/g, '/')
  
      try{
        let responseUpload = await upload(pathSource, pathRemote)
        if (responseUpload) {
            console.log(`The file has been uploaded ${pathRemote}`.green)
            // await moveFile(pathSource, pathMove)
            // console.log(`The file has been moved ${pathMove}`.blue)
        } else {
            process.exit(1)
        }
        }catch(e){
            console.log(e)
            // process.exit(1)
           
        }
    });
  }
  
  
  
  function upload(local, remote) {
    return new Promise(resolve => {
        ftp.upload([{ local, remote }], function (err) {
            if (err) {
                console.log('loi upload r'.red, err)
                return resolve(false)
            }
            return resolve(true)
        })
    })
  }