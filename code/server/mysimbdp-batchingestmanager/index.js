const FtpSrv = require('ftp-srv')

const ftpServer = new FtpSrv()

ftpServer.on('login', (data, resolve, reject) => {
  const { connection, username, password } = data

  connection.on('STOR', (error, filename) => {
    if (error) {
      console.error(error)
      return
    }

    console.log('File', filename, 'was stored')
  })

  if (username === 'paula' && password === 'kit') {
    resolve({
      cwd: username,
      root: './ftproot'
    })
  } else {
    reject()
  }
})

ftpServer.listen().then(() => {
  console.log('Server started 💕')
})
