const fs = require('fs')
const path = require('path')
const chokidar = require('chokidar')
const ftp = require('basic-ftp')
require('dotenv').config()

const defaultConfPath = './config.json'

const ftpConfig = {
  host: process.env.FTP_HOST,
  user: process.env.FTP_USER,
  password: process.env.FTP_PASSWORD
}

function getConfig () {
  const confPath = process.argv[2]
  if (fs.existsSync(confPath)) {
    return require(confPath)
  } else if (fs.existsSync('./config.json')) {
    return require(defaultConfPath)
  } else {
    throw new Exception('No config file found!')
  }
}

function isFileAllowed (config, filepath) {
  return true
}

function sendFile (config, filepath) {
  const remotePath = path.basename(filepath)

  const client = new ftp.Client()
  client.ftp.verbose = true
  return client
    .access(ftpConfig)
    .then(() => client.uploadFrom(filepath, remotePath))
    .then(() => client.close())
}

const config = getConfig()

const watcher = chokidar.watch(config.clientDir, {
  ignored: /^\./,
  persistent: true
})

watcher
  .on('add', filepath => {
    console.log('File', filepath, 'has been added')
    if (isFileAllowed(config, filepath)) {
      sendFile(config, filepath)
        .then(result => console.log('File', filepath, 'has been sent'))
        .catch(error => console.error(error))
    } else {
      console.log('File', filepath, 'is not acceped given the current settings')
    }
  })
  .on('change', filepath => console.log('File', filepath, 'has been changed'))
  .on('unlink', filepath => console.log('File', filepath, 'has been removed'))
  .on('error', error => console.error('Error happened', error))
