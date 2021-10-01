import dotenv from 'dotenv'
import { authenticatedLndGrpc, getWalletInfo } from 'lightning'

dotenv.config()

const { CERT, READONLY_MACAROON, SOCKET } = process.env

const { lnd } = authenticatedLndGrpc({
	cert: CERT,
	macaroon: READONLY_MACAROON,
	socket: SOCKET,
})

const walletInfo = await getWalletInfo({ lnd })

console.log(walletInfo)
