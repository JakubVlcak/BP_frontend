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
        window.addEventListener('resize', this.handleResize);
    },
    beforeUnmount() {
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
            // Clear any existing chart
            d3.select(this.$refs.chart).selectAll('*').remove();

            const filteredData = this.data.filter(d => d[this.yKey] !== 0);
            if (filteredData.length === 0) {
                console.warn("No valid data to display.");
                return;
            }

            const containerWidth = this.$refs.chartContainer.clientWidth;
            const margin = { top: 20, right: 30, bottom: 30, left: 40 };
            const width = containerWidth - margin.left - margin.right;
            const height = 400 - margin.top - margin.bottom;

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
                .call(d3.axisBottom(x));

            svg.append('g')
                .call(d3.axisLeft(y));

            const line = d3.line()
                .x(d => x(d.timestamp))
                .y(d => y(d.value));

            svg.append('path')
                .datum(formattedData)
                .attr('fill', 'none')
                .attr('stroke', this.lineColor)
                .attr('stroke-width', 1.5)
                .attr('d', line);

            // Tooltip setup
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
                .style('display', 'none');

            const circle = svg.append('circle')
                .attr('r', 0)
                .attr('fill', 'red')
                .style('stroke', 'white')
                .attr('opacity', 0.7)
                .style('pointer-events', 'none');

            const tooltipLineX = svg.append('line')
                .attr('stroke', 'red')
                .attr('stroke-width', 1)
                .attr('stroke-dasharray', '2,2')
                .style('display', 'none');

            const tooltipLineY = svg.append('line')
                .attr('stroke', 'red')
                .attr('stroke-width', 1)
                .attr('stroke-dasharray', '2,2')
                .style('display', 'none');

            const listeningRect = svg.append('rect')
                .attr('width', width)
                .attr('height', height)
                .style('fill', 'none')
                .style('pointer-events', 'all');

            listeningRect.on('mousemove', (event) => {
                const [xCoord] = d3.pointer(event);
                const bisectDate = d3.bisector(d => d.timestamp).left;
                const x0 = x.invert(xCoord);
                const i = bisectDate(formattedData, x0, 1);
                const d0 = formattedData[i - 1];
                const d1 = formattedData[i];
                const d = x0 - d0.timestamp > d1.timestamp - x0 ? d1 : d0;
                const xPos = x(d.timestamp);
                const yPos = y(d.value);

                // Update circle position
                circle.attr('cx', xPos).attr('cy', yPos);
                circle.transition().duration(50).attr('r', 5);

                // Update tooltip lines
                tooltipLineX.style('display', 'block')
                    .attr('x1', xPos).attr('x2', xPos)
                    .attr('y1', 0).attr('y2', height);

                tooltipLineY.style('display', 'block')
                    .attr('y1', yPos).attr('y2', yPos)
                    .attr('x1', 0).attr('x2', width);

                // Update tooltip content and position
                tooltip
                    .style('display', 'block')
                    .style('left', `${event.pageX + 10}px`)
                    .style('top', `${event.pageY - 10}px`)
                    .html(`
                    <strong>Date:</strong> ${d.timestamp.toLocaleString()}<br>
                    <strong>Value:</strong> ${d.value.toFixed(2)}
                `);
            });

            listeningRect.on('mouseleave', () => {
                // Hide tooltip and lines
                circle.transition().duration(50).attr('r', 0);
                tooltip.style('display', 'none');
                tooltipLineX.style('display', 'none');
                tooltipLineY.style('display', 'none');
            });
        },
        handleResize() {
            this.renderChart();
        },
    },
}
</script>

<style scoped>
.w-full {
    width: 100%;
}

.tooltip {
    position: absolute;
    padding: 8px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    border-radius: 4px;
    font-size: 12px;
    pointer-events: none;
    z-index: 10;
    white-space: nowrap;
    /* Prevent text wrapping */
}
</style>