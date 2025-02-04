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
        window.addEventListener('resize', this.handleResize); // Add resize listener
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.handleResize); // Clean up resize listener
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

            // Filter out data points where the value is 0
            const filteredData = this.data.filter(d => d[this.yKey] !== 0);

            // If no data is left after filtering, show a message or return
            if (filteredData.length === 0) {
                console.warn("No valid data to display.");
                return;
            }

            // Get the width of the container
            const containerWidth = this.$refs.chartContainer.clientWidth;

            // Set up the chart dimensions
            const margin = { top: 20, right: 30, bottom: 30, left: 40 };
            const width = containerWidth - margin.left - margin.right; // Use container width
            const height = 400 - margin.top - margin.bottom;

            // Create the SVG element
            const svg = d3.select(this.$refs.chart)
                .append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('transform', `translate(${margin.left},${margin.top})`);

            // Parse the date / time
            const parseTime = d3.timeParse('%Y-%m-%dT%H:%M:%SZ');

            // Format the data
            const formattedData = filteredData.map(d => ({
                timestamp: parseTime(d.timestamp),
                value: +d[this.yKey], // Use the yKey prop to determine the value
            }));

            // Set the scales
            const x = d3.scaleTime()
                .domain(d3.extent(formattedData, d => d.timestamp))
                .range([0, width]);

            const y = d3.scaleLinear()
                .domain([0, d3.max(formattedData, d => d.value)])
                .range([height, 0]);

            // Add the X Axis
            svg.append('g')
                .attr('transform', `translate(0,${height})`)
                .call(d3.axisBottom(x));

            // Add the Y Axis
            svg.append('g')
                .call(d3.axisLeft(y));

            // Add the line
            const line = d3.line()
                .x(d => x(d.timestamp))
                .y(d => y(d.value));

            svg.append('path')
                .datum(formattedData)
                .attr('fill', 'none')
                .attr('stroke', this.lineColor) // Use the lineColor prop
                .attr('stroke-width', 1.5)
                .attr('d', line);

            // Create tooltip div
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

            // Add a circle element
            const circle = svg.append('circle')
                .attr('r', 0)
                .attr('fill', 'red')
                .style('stroke', 'white')
                .attr('opacity', 0.7)
                .style('pointer-events', 'none');

            // Add red lines extending from the circle to the date and value
            const tooltipLineX = svg.append('line')
                .attr('class', 'tooltip-line')
                .attr('stroke', 'red')
                .attr('stroke-width', 1)
                .attr('stroke-dasharray', '2,2')
                .style('display', 'none');

            const tooltipLineY = svg.append('line')
                .attr('class', 'tooltip-line')
                .attr('stroke', 'red')
                .attr('stroke-width', 1)
                .attr('stroke-dasharray', '2,2')
                .style('display', 'none');

            // Create a listening rectangle
            const listeningRect = svg.append('rect')
                .attr('width', width)
                .attr('height', height)
                .style('fill', 'none')
                .style('pointer-events', 'all');

            // Mouse move function
            listeningRect.on('mousemove', (event) => {
                const [xCoord] = d3.pointer(event); // Get cursor coordinates
                const bisectDate = d3.bisector(d => d.timestamp).left;
                const x0 = x.invert(xCoord);
                const i = bisectDate(formattedData, x0, 1);
                const d0 = formattedData[i - 1];
                const d1 = formattedData[i];
                const d = x0 - d0.timestamp > d1.timestamp - x0 ? d1 : d0;
                const xPos = x(d.timestamp);
                const yPos = y(d.value);

                // Update the circle position
                circle.attr('cx', xPos).attr('cy', yPos);

                // Add transition for the circle radius
                circle.transition()
                    .duration(50)
                    .attr('r', 5);

                // Update the position of the red lines
                tooltipLineX.style('display', 'block')
                    .attr('x1', xPos).attr('x2', xPos)
                    .attr('y1', 0).attr('y2', height);

                tooltipLineY.style('display', 'block')
                    .attr('y1', yPos).attr('y2', yPos)
                    .attr('x1', 0).attr('x2', width);

                // Update tooltip position to follow the cursor
                tooltip
                    .style('display', 'block')
                    .style('left', `${event.pageX + 10}px`) // Position tooltip 10px to the right of the cursor
                    .style('top', `${event.pageY - 10}px`) // Position tooltip 10px above the cursor
                    .html(`
                        <strong>Date:</strong> ${d.timestamp.toISOString().slice(0, 10)}<br>
                        <strong>Value:</strong> ${d.value}
                    `);
            });

            // Mouse leave function
            listeningRect.on('mouseleave', () => {
                circle.transition().duration(50).attr('r', 0);
                tooltip.style('display', 'none');
                tooltipLineX.style('display', 'none');
                tooltipLineY.style('display', 'none');
            });
        },
        handleResize() {
            this.renderChart(); // Re-render the chart on window resize
        },
    },
};
</script>

<style scoped>
/* Ensure the chart container takes full width */
.w-full {
    width: 100%;
}

/* Style for tooltips */
.tooltip {
    position: absolute;
    padding: 8px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    border-radius: 4px;
    font-size: 12px;
    pointer-events: none;
}
</style>