<template>
    <div ref="chartContainer" class="w-full">
        <div ref="chart"></div>
    </div>
</template>

<script>
import * as d3 from 'd3';

export default {
    props: {
        data: {
            type: Array,
            required: true,
        },
        yKey: {
            type: String,
            required: true,
        },
        lineColor: {
            type: String,
            default: 'steelblue',
        },
    },
    mounted() {
        this.renderChart();
        window.addEventListener('chart-move', this.handleChartHover);
        window.addEventListener('resize', this.handleResize);
    },
    beforeUnmount() {
        window.removeEventListener('chart-move', this.handleChartHover);
        window.removeEventListener('resize', this.handleResize);
    },
    watch: {
        data: {
            handler: 'renderChart',
            deep: true,
        },
    },
    methods: {
        renderChart() {
            d3.select(this.$refs.chart).selectAll('*').remove();

            const threshold = 30 * 1000; // 30 seconds gap threshold
            // eslint-disable-next-line vue/no-mutating-props
            const sortedData = this.data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

            let filteredData = [];
            for (let i = 1; i < sortedData.length; i++) {
                const prevTimestamp = new Date(sortedData[i - 1].timestamp).getTime();
                const currTimestamp = new Date(sortedData[i].timestamp).getTime();

                if (currTimestamp - prevTimestamp <= threshold) {
                    filteredData.push(sortedData[i]);
                }
            }

            const containerWidth = this.$refs.chartContainer.clientWidth;
            const margin = { top: 20, right: 30, bottom: 30, left: 40 };
            const width = containerWidth - margin.left - margin.right;
            const height = 120 - margin.top - margin.bottom;

            const svg = d3.select(this.$refs.chart)
                .append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('transform', `translate(${margin.left},${margin.top})`);

            const parseTime = d3.timeParse('%Y-%m-%dT%H:%M:%SZ');
            const formattedData = filteredData.map(d => ({
                timestamp: parseTime(d.timestamp),
                value: +d[this.yKey],
            }));

            const x = d3.scaleTime()
                .domain(d3.extent(formattedData, d => d.timestamp))
                .range([0, width]);

            const y = d3.scaleLinear()
                .domain([0, d3.max(formattedData, d => d.value)])
                .range([height, 0]);

            svg.append('g')
                .attr('transform', `translate(0,${height})`)
                .call(d3.axisBottom(x)
                    .ticks(d3.timeMinute.every(10))
                    .tickFormat(d3.timeFormat('%I:%M %p'))
                );

            svg.append('g').call(d3.axisLeft(y));

            // Line generator
            const line = d3.line()
                .x(d => x(d.timestamp))
                .y(d => y(d.value))
                .defined(d => d.value !== null); // This skips undefined data points

            // Area generator
            const area = d3.area()
                .x(d => x(d.timestamp))
                .y0(height)
                .y1(d => y(d.value));

            // Append area path
            svg.append('path')
                .datum(formattedData)
                .attr('fill', this.lineColor)
                .attr('opacity', 0.3) // Semi-transparent color
                .attr('d', area);

            // Append line path
            svg.append('path')
                .datum(formattedData)
                .attr('fill', 'none')
                .attr('stroke', this.lineColor)
                .attr('stroke-width', 1.6)
                .attr('d', line);

            const tooltip = d3.select(this.$refs.chartContainer)
                .append('div')
                .attr('class', 'tooltip')
                .style('position', 'absolute')
                .style('background', 'rgba(0, 0, 0, 0.8)')
                .style('color', 'white')
                .style('padding', '8px')
                .style('border-radius', '4px')
                .style('font-size', '12px')
                .style('pointer-events', 'none')
                .style('display', 'none')


            const circle = svg.append('circle')
                .attr('r', 0)
                .attr('fill', 'red')
                .style('stroke', 'white')
                .attr('opacity', 0.7)
                .style('pointer-events', 'none');

            const listeningRect = svg.append('rect')
                .attr('width', width)
                .attr('height', height)
                .style('fill', 'none')
                .style('pointer-events', 'all');

            listeningRect.on('mousemove', (event) => {
                const [xCoord] = d3.pointer(event);
                const x0 = x.invert(xCoord);

                const chartMoveEvent = new CustomEvent('chart-move', {
                    detail: { timestamp: x0, xPos: xCoord },
                });
                window.dispatchEvent(chartMoveEvent);
            });

            listeningRect.on('mouseleave', () => {
                circle.transition().duration(50).attr('r', 0);
                tooltip.style('display', 'none');
            });

            this.xScale = x;
            this.yScale = y;
            this.formattedData = formattedData;
        },
        handleChartHover(event) {
            const { timestamp, xPos } = event.detail;

            const bisectDate = d3.bisector(d => d.timestamp).left;
            const i = bisectDate(this.formattedData, timestamp, 1);
            const d0 = this.formattedData[i - 1];
            const d1 = this.formattedData[i];
            const d = timestamp - d0.timestamp > d1.timestamp - timestamp ? d1 : d0;

            if (!d) return;

            const yPos = this.yScale(d.value);
            const formattedTime = d3.timeFormat('%I:%M:%S %p')(d.timestamp); // Format time

            d3.select(this.$refs.chartContainer).select('.tooltip')
                .style('display', 'block')
                .style('left', `${xPos + 0}px`)
                .style('margin', '-100px')
                .html(`<strong>N</strong> ${d.value} <br/><strong>Time:</strong> ${formattedTime}`);

            d3.select(this.$refs.chart).select('circle')
                .attr('cx', this.xScale(d.timestamp))
                .attr('cy', yPos)
                .transition()
                .duration(50)
                .attr('r', 5);
        },
        handleResize() {
            this.renderChart();
        },
    },
};
</script>

<style>
.w-full {
    width: 100%;
}

.tooltip {
    position: absolute;
    padding: 8px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    border-radius: 4px;
    pointer-events: none;
}
</style>
