<template>
  <div ref="mapContainer" class="w-full h-96 bg-gray-100 shadow rounded relative">
  </div>
</template>

<script>
import * as d3 from "d3";

export default {
  props: {
    data: Array,
    latKey: String,
    longKey: String,
  },
  mounted() {
    this.drawMap();
  },
  watch: {
    data() {
      this.drawMap();
    },
  },
  methods: {
    drawMap() {
      if (!this.data || this.data.length === 0) return;

      // Convert fixed-point lat/long to proper format
      const coordinates = this.data.map((d) => [
        d[this.longKey] / 1e7, // Longitude
        d[this.latKey] / 1e7,  // Latitude
      ]);

      // Set dimensions
      const width = this.$refs.mapContainer.clientWidth;
      const height = this.$refs.mapContainer.clientHeight;

      // Clear previous SVG
      d3.select(this.$refs.mapContainer).selectAll("*").remove();

      // Create SVG
      const svg = d3
        .select(this.$refs.mapContainer)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .call(
          d3.zoom()
            .scaleExtent([1, 10]) // Zoom limits
            .on("zoom", (event) => {
              mapGroup.attr("transform", event.transform);
            })
        );

      // Create projection (scales lat/lng to fit SVG)
      const projection = d3.geoMercator().fitSize([width, height], {
        type: "LineString",
        coordinates: coordinates,
      });

      // Create path generator
      const pathGenerator = d3.line()
        .x((d) => projection(d)[0])
        .y((d) => projection(d)[1]);

      // Create a group for map elements
      const mapGroup = svg.append("g");

      // Draw the polyline
      mapGroup.append("path")
        .datum(coordinates)
        .attr("d", pathGenerator)
        .attr("fill", "none")
        .attr("stroke", "blue")
        .attr("stroke-width", 2);


      // Draw points with tooltips
      mapGroup.selectAll("circle")
        .data(coordinates)
        .enter()
        .append("circle")
        .attr("cx", (d) => projection(d)[0])
        .attr("cy", (d) => projection(d)[1])
        .attr("r", 0.5)
        .attr("fill", "red")
    },
  },
};
</script>

<style scoped></style>
