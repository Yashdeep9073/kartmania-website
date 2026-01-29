<template>
  <div class="skeleton-section"></div>
</template>

<style scoped>
.skeleton-section {
  height: 280px;
  background: linear-gradient(90deg,#eee,#f5f5f5,#eee);
  animation: pulse 1.5s infinite;
}
@keyframes pulse {
  0% { background-position: 0% }
  100% { background-position: 100% }
}
</style>
