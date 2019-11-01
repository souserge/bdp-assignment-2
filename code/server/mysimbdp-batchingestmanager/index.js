const path = require('path')
const FtpSrv = require('ftp-srv')
const Bluebird = require('bluebird')
const cmd = require('node-cmd')
require('dotenv').config()

const getAsync = Bluebird.promisify(cmd.get, { multiArgs: true, context: cmd })

const users = require('./users.json')

function getUser (username, password) {
  return users.find(
    usr => usr.username === username && usr.password === password
  )
}

const ftpServer = new FtpSrv()

ftpServer.on('login', (data, resolve, reject) => {
  const { connection, username, password } = data

  const user = getUser(username, password)

  if (!user) {
    reject('user not found')
    return
  }

  connection.on('STOR', (error, filename) => {
    if (error) {
      console.error(error)
      return
    }
    const appPath = path.resolve(
      __dirname,
      'clientapps',
      username,
      user.appPath
    )
    getAsync(
      `MONGODB_URL=${process.env.MONGODB_URL} node ${appPath} ${filename}`
    )
      .then(output => console.log(output))
      .catch(err =>
        console.error(
          'Uh-oh, something is wrong with clientbatchingestapp:',
          err
        )
      )
  })

  resolve({
    cwd: username,
    root: './ftproot'
  })
})

ftpServer.listen().then(() => {
  console.log('Server started 💕')
})
