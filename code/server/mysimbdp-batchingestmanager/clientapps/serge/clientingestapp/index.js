const fs = require('fs')
const EventEmitter = require('events')
const csvParse = require('csv-parse')
const MongoClient = require('mongodb').MongoClient
const url = process.env.MONGODB_URL
const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

function sendRow (collection) {
  return row => collection.insertOne(row)
}

const filenames = process.argv.slice(2)

const eventEmitter = new EventEmitter()

eventEmitter.on('allsent', () => {
  console.log('All files sent')
  process.exit(0)
})

eventEmitter.on('fail', err => {
  console.error('Failed to send files')
  console.error(err)
  process.exit(1)
})

console.log(filenames)
client.connect(err => {
  if (err) {
    eventEmitter.emit('fail', err)
    return
  }

  const collection = client.db('mysimbdp-coredms').collection('localizations')

  const promises = filenames.map(
    filename =>
      new Promise((resolve, reject) =>
        fs
          .createReadStream(filename)
          .pipe(csvParse({ columns: true }))
          .on('data', sendRow(collection))
          .on('end', resolve)
          .on('error', reject)
      )
  )
  Promise.all(promises)
    .then(() => {
      client.close()
      eventEmitter.emit('allsent')
    })
    .catch(err => {
      client.close()
      eventEmitter.emit('fail')
    })
})
