import dotenv from 'dotenv'
import express from 'express'
import http from 'http'
import { authenticatedLndGrpc } from 'lightning'
import { WebSocketServer } from 'ws'

dotenv.config()

const { CERT, READONLY_MACAROON, SOCKET, PORT } = process.env

const { lnd } = authenticatedLndGrpc({
	cert: CERT,
	macaroon: READONLY_MACAROON,
	socket: SOCKET,
})

const app = express()
const server = http.createServer(app)

app.use(express.static('public'))

const wss = new WebSocketServer({ server })
server.listen(PORT, () => {
	console.log(`Server started on port ${server.address().port}`)
})

// const { channels, nodes } = await getNetworkGraph({ lnd })

// console.log(channels)
// console.log('--------------')
//console.log(nodes)

// 02039029e390f6d00e1973044b7dad2c941076cce25cd4c70ac789eaba4d3ac242
