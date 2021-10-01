import cytoscape from 'cytoscape'
import spread from 'cytoscape-spread'
import './style.css'

cytoscape.use(spread)

// @TODO: handle ws vs wss
const ws = new WebSocket(`ws://${location.host}`)
ws.onmessage = (message) => {
	const data = JSON.parse(message.data)

	const nodes = []
	const edges = []
	data.forEach((node, i) => {
		nodes.push({
			group: 'nodes',
			data: {
				id: node.id,
				alias: node.alias,
				...(i === 0
					? {
							position: { x: 200, y: 200 },
					  }
					: {}),
			},
		})
	})
	data.forEach((node) => {
		node.neighbours.forEach((neighbour) => {
			if (node.id > neighbour) {
				edges.push({
					group: 'edges',
					data: {
						source: node.id,
						target: neighbour,
					},
				})
			}
		})
	})

	const cy = cytoscape({
		container: document.getElementById('container'),

		layout: {
			name: 'spread',
		},

		style: [
			{
				selector: 'node',
				style: {
					label: 'data(alias)',
					'text-valign': 'center',
					color: '#000000',
					'background-color': '#3a7ecf',
				},
			},

			{
				selector: 'edge',
				style: {
					width: 2,
					'line-color': '#3a7ecf',
					opacity: 0.5,
				},
			},
		],

		elements: {
			nodes,
			edges,
		},
	})

	ws.close()
}
