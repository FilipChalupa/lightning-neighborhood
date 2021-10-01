export const createGraph = (identity, channels, nodes, depth) => {
	const graph = {}

	const ensureNode = (id) => {
		if (!(id in graph)) {
			graph[id] = {
				id,
				neighbours: [],
			}
			return false // Newly created
		}
		return true
	}

	const expand = (rootId, depth) => {
		if (depth === 0) {
			return
		}
		channels.forEach((channel) => {
			if (!channel.policies.some((policy) => policy.public_key === rootId)) {
				return
			}
			channel.policies.forEach((policy) => {
				const isNew = !ensureNode(policy.public_key)
				graph[policy.public_key].neighbours.push(rootId)
				graph[rootId].neighbours.push(policy.public_key)
				if (isNew) {
					expand(policy.public_key, depth - 1)
				}
			})
		})
		nodes
	}

	ensureNode(identity.public_key)

	// @TODO: explore depth async
	expand(identity.public_key, depth)

	// Add aliases
	for (const id in graph) {
		graph[id].alias = nodes.find((node) => node.public_key === id)?.alias ?? id
	}
	return Object.values(graph)
}
