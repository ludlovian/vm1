import polka from 'polka'
import send from '@polka/send-type'
import Timer from 'timer'
import Debug from '@ludlovian/debug'

const PORT = 1824
const PERIOD = 5 * 1000

const debug = Debug('vm1')

main()

function main () {
  polka()
    .use(getIP)
    .get('/status', getStatus)
    .get('/stream', getStream)
    .listen(PORT, '0.0.0.0', () => {
      debug('Listening on port %d', PORT)
    })
}

function getIP (req, res, next) {
  if (req.ip) return next()
  req.ip =
    req.headers['x-forwarded-for']?.split(',')?.shift() ??
    req.socket.remoteAddress
  next()
}

function getStatus (req, res) {
  const { ip } = req
  debug('getStatus from %s', ip)
  send(res, 200, { ip })
}

function getStream (req, res) {
  const { ip } = req
  debug('getStream from %s - started', ip)

  res.writeHead(200, {
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'Content-Type': 'text/event-stream'
  })

  const tm = new Timer({ every: PERIOD, fn: tick })
  tm.fire()
  req.on('close', stop)

  function tick () {
    const data = { now: new Date() }
    res.write(`data: ${JSON.stringify(data)}\n\n`)
  }

  function stop () {
    debug('getStream from %s - stopped', ip)
    tm.cancel()
  }
}
