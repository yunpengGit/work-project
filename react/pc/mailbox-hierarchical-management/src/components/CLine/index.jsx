import { Line } from '@antv/g2plot';

const Cline = (params) => {
	const {data, xField, yField, seriesField, yAxis} = params
    const linePlot = new Line(params.id, {
      data,
      xField,
      yField,
      seriesField,
			yAxis,
      legend: {
        position: 'top',
			},
			color: params.color,
      smooth: true,
      animation: {
        appear: {
          animation: 'path-in',
          duration: 5000,
        },
      },
    });

    linePlot.render();
}
export default Cline
