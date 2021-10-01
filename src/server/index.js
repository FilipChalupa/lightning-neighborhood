import dotenv from 'dotenv'
import express from 'express'
import http from 'http'
import { WebSocketServer } from 'ws'
import { createGraph } from './utils/createGraph.js'
import { getData } from './utils/getData.js'

dotenv.config()

const { CERT, READONLY_MACAROON, SOCKET, PORT } = process.env

const { identity, channels, nodes } = await getData(
	CERT,
	READONLY_MACAROON,
	SOCKET,
)

const graph = createGraph(identity, channels, nodes, 1)

const app = express()
const server = http.createServer(app)

app.use(express.static('public'))

const wss = new WebSocketServer({ server })
server.listen(PORT, () => {
	console.log(`Server started on port ${server.address().port}`)
})

wss.on('connection', (ws) => {
	ws.send(JSON.stringify(graph))
})

// console.log(channels)
// console.log('--------------')
//console.log(nodes)

// 02039029e390f6d00e1973044b7dad2c941076cce25cd4c70ac789eaba4d3ac242
