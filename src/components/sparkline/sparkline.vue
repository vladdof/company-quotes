<template>
  <svg
    v-if="points.length > 1"
    class="sparkline"
    :viewBox="`0 0 ${width} ${height}`"
    :width="width"
    :height="height"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <linearGradient :id="gradientId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" :stop-color="lineColor" stop-opacity="0.3" />
        <stop offset="100%" :stop-color="lineColor" stop-opacity="0" />
      </linearGradient>
    </defs>
    <path
      :d="areaPath"
      :fill="`url(#${gradientId})`"
    />
    <polyline
      :points="svgPoints"
      fill="none"
      :stroke="lineColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

let idCounter = 0;

export default defineComponent({
  name: 'sparkline',
  props: {
    data: {
      type: Array as () => number[],
      default: () => [],
    },
    width: {
      type: Number,
      default: 80,
    },
    height: {
      type: Number,
      default: 32,
    },
    positive: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    idCounter += 1;
    const gradientId = `spk-${idCounter}-${Math.random().toString(36).slice(2, 7)}`;

    const lineColor = computed(() => (props.positive ? '#22c55e' : '#ef4444'));

    const points = computed(() => {
      const d = props.data.filter((v) => typeof v === 'number' && isFinite(v));
      if (d.length < 2) return [];
      return d;
    });

    const svgPoints = computed(() => {
      const d = points.value;
      if (!d.length) return '';
      const minV = Math.min(...d);
      const maxV = Math.max(...d);
      // Fallback to 1 when all values are equal to prevent division by zero (renders a flat mid-line)
      const range = maxV - minV || 1;
      const pad = 2;
      return d
        .map((v, i) => {
          const x = (i / (d.length - 1)) * (props.width - pad * 2) + pad;
          const y = props.height - pad - ((v - minV) / range) * (props.height - pad * 2);
          return `${x.toFixed(2)},${y.toFixed(2)}`;
        })
        .join(' ');
    });

    const areaPath = computed(() => {
      const d = points.value;
      if (!d.length) return '';
      const minV = Math.min(...d);
      const maxV = Math.max(...d);
      // Fallback to 1 when all values are equal to prevent division by zero (renders a flat mid-line)
      const range = maxV - minV || 1;
      const pad = 2;
      const pts = d.map((v, i) => {
        const x = (i / (d.length - 1)) * (props.width - pad * 2) + pad;
        const y = props.height - pad - ((v - minV) / range) * (props.height - pad * 2);
        return { x, y };
      });
      const lineStr = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ');
      const lastX = pts[pts.length - 1].x;
      const firstX = pts[0].x;
      return `${lineStr} L${lastX.toFixed(2)},${props.height} L${firstX.toFixed(2)},${props.height} Z`;
    });

    return {
      gradientId,
      lineColor,
      points,
      svgPoints,
      areaPath,
    };
  },
});
</script>

<style scoped>
.sparkline {
  display: block;
  overflow: visible;
}
</style>
