module.exports = {
  apps : [{
    name: 'TRANSFER-FTP-FILE-NEW',
    script: 'index.js',
    // instances: 1,
    autorestart: true,
    env: {
      NODE_ENV: 'production',
      // CONFIG 
      ROOT_WATCH: 'D:/FTPOnlineData',  // thư mục source để watch
      ROOT_REMOTE_FTP: '/STNMT_HaiPhong',  // thư mục đích truyền đến việt an
      ROOT_MOVE_FTP: 'D:/FTPOnlineData_IMP', // thư mục di dời
    },
  }],
};