<template>
  <div class="grid-skeleton">
    <div
      v-for="i in items"
      :key="i"
      class="skeleton-card"
    >
      <div class="skeleton-img"></div>
      <div class="skeleton-line w-80"></div>
      <div class="skeleton-line w-60"></div>
    </div>
  </div>
</template> 
  
<script setup>
defineProps({
  items: {
    type: Number,
    default: 8
  }
})
</script>

<style scoped>
.grid-skeleton {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
  padding: 24px;
}

.skeleton-card {
  background: #fff;
  border-radius: 8px;
  padding: 12px;
}

.skeleton-img {
  height: 160px;
  border-radius: 6px;
  background: linear-gradient(
    90deg,
    #eee,
    #f5f5f5,
    #eee
  );
  animation: pulse 1.5s infinite;
}

.skeleton-line {
  height: 12px;
  margin-top: 10px;
  border-radius: 4px;
  background: linear-gradient(
    90deg,
    #eee,
    #f5f5f5,
    #eee
  );
  animation: pulse 1.5s infinite;
}

.w-80 { width: 80%; }
.w-60 { width: 60%; }

@keyframes pulse {
  0% { background-position: 0% }
  100% { background-position: 100% }
}
</style>
