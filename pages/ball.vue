<template>
  <div class="container">
    <input type="file" accept="video/*" @change="loadVideo" />

    <video ref="video" controls @loadeddata="initCanvas"></video>

    <canvas ref="canvas" @click="setBoundary"></canvas>

    <p v-if="decision" class="result">
      🏏 Result: <b>{{ decision }}</b>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const video = ref(null)
const canvas = ref(null)
const ctx = ref(null)

const boundaryY = ref(null)
const decision = ref(null)

const loadVideo = (e) => {
  const file = e.target.files[0]
  video.value.src = URL.createObjectURL(file)
}

const initCanvas = () => {
  canvas.value.width = video.value.videoWidth
  canvas.value.height = video.value.videoHeight
  ctx.value = canvas.value.getContext('2d')

  trackBall()
}

// User clicks to mark boundary line
const setBoundary = (e) => {
  boundaryY.value = e.offsetY

  ctx.value.strokeStyle = 'red'
  ctx.value.lineWidth = 3
  ctx.value.beginPath()
  ctx.value.moveTo(0, boundaryY.value)
  ctx.value.lineTo(canvas.value.width, boundaryY.value)
  ctx.value.stroke()
}

// Fake ball tracking (white color detection)
const trackBall = () => {
  const draw = () => {
    ctx.value.drawImage(video.value, 0, 0)

    if (boundaryY.value !== null) {
      const frame = ctx.value.getImageData(0, 0, canvas.value.width, canvas.value.height)
      const data = frame.data

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]

        // Detect white ball
        if (r > 230 && g > 230 && b > 230) {
          const y = Math.floor(i / 4 / canvas.value.width)

          if (y < boundaryY.value) {
            decision.value = 'SIX 🟢'
          } else {
            decision.value = 'FOUR 🔵'
          }
        }
      }
    }

    requestAnimationFrame(draw)
  }
  draw()
}
</script>

<style scoped>
.container {
  max-width: 700px;
}
video, canvas {
  width: 100%;
  margin-top: 12px;
}
.result {
  font-size: 22px;
  margin-top: 10px;
}
</style>
