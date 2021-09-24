import { useState, useContext, useEffect, useImperativeHandle, forwardRef } from 'react'
import { Pie } from '@antv/g2plot'

let CPie = (params) => {
	const piePlot = new Pie(params.id, {
		padding: 10,
		width: params.width || 392,
		height: params.height || 240,
		data: params.data,
		angleField: 'value',
		colorField: 'type',
		radius: 0.8,
		innerRadius: 0.6,
		label:
			params.label !== undefined
				? params.label
				: {
						type: 'spider',
						content: '{name}\n{percentage}'
				  },
		color: params.color,
		legend:
			params.legend !== undefined
				? params.legend
				: {
						layout: 'horizontal',
						position: 'bottom'
				  },
		interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
		statistic: {
			title: false,
			content: {
				style: {
					fontSize: 12,
					color: '#808695'
				},
				formatter: () => params.doc
			}
		}
	})
	piePlot.render()
}
export default CPie
