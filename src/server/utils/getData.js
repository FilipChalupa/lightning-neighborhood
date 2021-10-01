import { authenticatedLndGrpc, getIdentity } from 'lightning'
import { createRequire } from 'module'
import path from 'path'

const require = createRequire(import.meta.url)

const isCached = true // @TODO

export const getData = async (cert, macaroon, socket) => {
	if (isCached) {
		const identity = require(path.resolve('./server_cache/identity.json'))
		const channels = require(path.resolve('./server_cache/channels.json'))
		const nodes = require(path.resolve('./server_cache/nodes.json'))
		return { identity, channels, nodes }
	} else {
		const { lnd } = authenticatedLndGrpc({
			cert,
			macaroon,
			socket,
		})

		const identity = await getIdentity({ lnd })
		const { channels, nodes } = await getNetworkGraph({ lnd })
		// @TODO: save to cache
		return { identity, channels, nodes }
	}
}
