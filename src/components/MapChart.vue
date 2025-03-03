<template>
  <div ref="mapContainer" class="w-full h-96 bg-gray-100 shadow rounded relative"></div>
</template>

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import * as d3 from "d3";

export default {
  props: {
    data: Array,
    latKey: String,
    longKey: String,
  },
  mounted() {
    this.initMap();
  },
  watch: {
    data() {
      this.drawData();
    },
  },
  methods: {
    convertSemicirclesToDegrees(semicircles) {
      return semicircles * (180 / 2147483648);
    },
    initMap() {
      if (!this.data || this.data.length === 0) return;

      const firstPoint = [
        this.convertSemicirclesToDegrees(this.data[0][this.latKey]),
        this.convertSemicirclesToDegrees(this.data[0][this.longKey])
      ];

      const lastPoint = [
        this.convertSemicirclesToDegrees(this.data[this.data.length - 1][this.latKey]),
        this.convertSemicirclesToDegrees(this.data[this.data.length - 1][this.longKey])
      ];

      this.map = L.map(this.$refs.mapContainer).setView(firstPoint, 11);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(this.map);

      this.svgLayer = L.svg().addTo(this.map);
      this.svg = d3.select(this.svgLayer._rootGroup);

      this.map.on("zoomend", this.drawData);
      this.map.on("moveend", this.drawData);

      // Custom icons
      const startIcon = L.divIcon({
        className: "custom-icon",
        html: "<div style='background:green;width:20px;height:20px;border-radius:50%;'></div>",
      });

      const endIcon = L.divIcon({
        className: "custom-icon",
        html: "<div style='background:repeating-conic-gradient(black 0% 25%, white 25% 50%) center/10px 20px;width:20px;height:20px;border-radius:50%;'></div>",
      });

      // Add markers
      L.marker(firstPoint, { icon: startIcon }).addTo(this.map);
      L.marker(lastPoint, { icon: endIcon }).addTo(this.map);

      this.drawData();
    },

    drawData() {
      if (!this.data || this.data.length === 0) return;

      const coordinates = this.data.map((d) => [
        this.convertSemicirclesToDegrees(d[this.longKey]),
        this.convertSemicirclesToDegrees(d[this.latKey])
      ]);

      const projection = (coords) => {
        const point = this.map.latLngToLayerPoint([coords[1], coords[0]]);
        return [point.x, point.y];
      };

      this.svg.selectAll("*").remove();

      const lineGenerator = d3.line()
        .x(d => projection(d)[0])
        .y(d => projection(d)[1]);

      this.svg.append("path")
        .datum(coordinates)
        .attr("d", lineGenerator)
        .attr("fill", "none")
        .attr("stroke", "blue")
        .attr("stroke-width", 2);


    },
  }
};
</script>

<style scoped>
.custom-icon {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
