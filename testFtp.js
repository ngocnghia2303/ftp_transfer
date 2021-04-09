var EasyFtp = require('easy-ftp');
var ftp = new EasyFtp();
var config = {
    host: "103.140.42.141",
    port: 21,
    username: "ftpuser",
    password: "0!@#$%^QWERTY",
    type : 'ftp'
};
require('colors');


ftp.on("open", function(client){
    console.log('connect FTP Success Full');
    main()
});
ftp.on("close", function(err){
    console.log('connect FTP close Full', err);
    ftp.connect(config);
});
ftp.on("end", function(err){
    console.log('connect FTP end Full', err);
});
ftp.on("ready", function(err){
    console.log('connect FTP ready Full', err);
});

ftp.on("error", function(err){
    console.log('connect FTP error'.red, err);
    // setTimeout(() => {
    //     ftp.connect(config);
    // }, 5000);
    // process.exit(1);
});
ftp.connect(config);



// ftp.client('open')

async function main(){
    let res1 = await upload('E:/iLotusland_Api_KhongXoa/cron-transfer-file/test.txt', "/a/b/c/test.txt")
    console.log('resss1',res1)
 
    let res2 = await upload('E:/iLotusland_Api_KhongXoa/cron-transfer-file/test.txt', "/a/b/c/test.txt")
    console.log('resss2',res2)

    let res3 = await upload('E:/iLotusland_Api_KhongXoa/cron-transfer-file/test.txt', "/a/b/c/test.txt")
    console.log('res3',res3)
// ftp.upload("E:/iLotusland_Api_KhongXoa/cron-transfer-file/test.txt", "/a/b/c/test.txt", function(err){
//     console.log('err',err)
// })
}


function upload(local, remote){
    return new Promise(resolve=>{
        ftp.upload([{local, remote}], function(err){
            if(err){
                console.log('loi r'.red,err)
                return resolve(false)
            }
            return resolve(true)
        })
    })
}