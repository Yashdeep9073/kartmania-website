<!-- components/homeBanner.vue -->
<template>
  <div class="banner pb-0">
    <div class="banner-item position-relative">
      <!-- Loading State -->
      <div 
        v-if="isLoading" 
        class="banner-loading position-absolute inset-0 d-flex align-items-center justify-content-center"
      >
        <div class="loading-content text-center">
          <div class="spinner-border text-primary mb-3" role="status">
            <span class="visually-hidden">Loading banners...</span>
          </div>
          <p class="text-muted">Loading banners...</p>
        </div>
      </div>

      <!-- Error State -->
      <div 
        v-else-if="isError" 
        class="banner-error position-absolute inset-0 d-flex align-items-center justify-content-center"
      >
        <div class="error-content text-center p-4">
          <i class="fas fa-exclamation-triangle fa-3x text-danger mb-3"></i>
          <p class="text-danger mb-3 fw-semibold">Failed to load banners</p>
          <p class="text-muted mb-3 small">{{ error?.message || 'Network error' }}</p>
          <button 
            type="button"
            class="btn btn-outline-danger btn-sm"
            @click="handleRefresh"
          >
            <i class="fas fa-redo me-2"></i> Try Again
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div 
        v-else-if="isEmpty" 
        class="banner-empty position-absolute inset-0 d-flex align-items-center justify-content-center"
      >
        <div class="empty-content text-center p-4">
          <i class="fas fa-images fa-3x text-secondary mb-3"></i>
          <p class="text-muted mb-3">No banners available</p>
          <button 
            type="button"
            class="btn btn-outline-secondary btn-sm"
            @click="handleRefresh"
          >
            <i class="fas fa-sync me-2"></i> Refresh
          </button>
        </div>
      </div>

      <!-- Main Banner Content -->
      <div v-else class="banner-main position-relative">
        <!-- Swiper Container -->
        <div 
          ref="swiperContainer" 
          class="swiper bannerSwiper"
          :class="{ 'swiper-initialized': swiperInitialized }"
        >
          <div class="swiper-wrapper">
            <!-- Banner Slides -->
            <div 
              v-for="(banner, index) in banners" 
              :key="`banner-${banner.id}-${index}`" 
              class="swiper-slide"
            >
              <div class="banner-slide position-relative">
                <!-- Background Image -->
                <img 
                  :src="banner.image" 
                  :alt="banner.title || `Banner ${index + 1}`"
                  class="api-bg position-absolute inset-0 w-100 h-100 object-fit-cover"
                  loading="lazy"
                  @error="handleImageError"
                />

                <!-- Overlay -->
                <div class="banner-overlay position-absolute inset-0 w-100 h-100"></div>

                <!-- Content -->
                <div class="banner-content position-relative z-1 h-100 d-flex align-items-center">
                  <div class="container container-lg">
                    <div class="row justify-content-center">
                      <div class="col-lg-10 col-xl-8 text-center">
                        <div class="banner-text-wrapper">
                          <span class="banner-subtitle fw-semibold text-white text-uppercase mb-3 d-block">
                            {{ banner.description || 'Save up to 50% off on your first order' }}
                          </span>
                          <h1 class="banner-title text-white mb-4">
                            <div class="title-line">{{ banner.title || 'Daily Grocery Order and' }}</div>
                            <div class="title-line">
                              Get <span class="text-main-600">Express</span> Delivery
                            </div>
                          </h1>

                          <NuxtLink to="/shop-all">
                            <div class="banner-actions mt-5">
                              <button 
                                type="button"
                                class="btn btn-primary btn-lg px-5 py-3 fw-semibold"
                              >
                                Shop Now <i class="fas fa-arrow-right ms-2"></i>
                              </button>
                            </div>
                          </NuxtLink>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- <div class="swiper-pagination"></div>

          <div class="swiper-button-next"></div>
          <div class="swiper-button-prev"></div> -->
        </div>

        <!-- Revalidation Indicator -->
        <div 
          v-if="isValidating" 
          class="revalidation-indicator position-absolute top-0 end-0 m-3"
        >
          <div class="spinner-border spinner-border-sm text-white" role="status">
            <span class="visually-hidden">Updating...</span>
          </div>
          <span class="visually-hidden">Updating banners...</span>
        </div>

        <!-- Data Status Badge (for debugging) -->
        <div 
          v-if="isDev" 
          class="data-status position-absolute bottom-0 start-0 m-2"
        >
          <span class="badge" :class="statusClass">{{ status }}</span>
          <span class="badge bg-info ms-1">{{ banners?.length || 0 }} items</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed, nextTick } from 'vue'
import type { Swiper as SwiperType } from 'swiper'
import type { SwiperOptions } from 'swiper/types'
import { useBanners, type BannerItem } from '~/composables/useBanners'

const config = useRuntimeConfig() 
const API_URL = config.public.api.Media

// Use SWR composable
const { 
  banners, 
  isLoading, 
  isError, 
  isValidating, 
  refresh, 
  isEmpty,
  status,
  error 
} = useBanners(API_URL)

// Refs
const swiperInstance = ref<SwiperType | null>(null)
const swiperContainer = ref<HTMLElement | null>(null)
const swiperInitialized = ref(false)

// Check if in development mode (fix for import.meta error)
const isDev = process.dev || process.env.NODE_ENV === 'development'

// Computed
const statusClass = computed(() => {
  switch (status.value) {
    case 'loading': return 'bg-warning'
    case 'error': return 'bg-danger'
    case 'empty': return 'bg-secondary'
    case 'success': return 'bg-success'
    default: return 'bg-dark'
  }
})    

// Handle refresh button click
const handleRefresh = () => {
  refresh()
}

// Handle image loading errors
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  console.warn(`Failed to load banner image: ${img.src}`)
  
  // Use fallback image
  img.src = '/images/fallback-banner.jpg'
  
  // Prevent infinite loops
  img.onerror = null
}

// Initialize Swiper
const initializeSwiper = async () => {
  // Only run on client side
  if (typeof window === 'undefined' || !swiperContainer.value || !banners.value?.length) {
    return
  }

  try {
    // Dynamic imports for Swiper
    const SwiperModule = await import('swiper')
    const { 
      Autoplay, 
      EffectFade, 
      Pagination, 
      Navigation,
      Keyboard 
    } = await import('swiper/modules')
    
    const Swiper = SwiperModule.default

    // Destroy existing instance
    if (swiperInstance.value) {
      swiperInstance.value.destroy(true, true)
      swiperInstance.value = null
    }

    // Initialize new Swiper instance
    const swiperOptions: SwiperOptions = {
      modules: [Autoplay, EffectFade, Pagination, Navigation, Keyboard],
      loop: true,
      effect: 'fade' as const,
      fadeEffect: {
        crossFade: true
      },
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
        waitForTransition: true,
      },
      speed: 1000,
      keyboard: {
        enabled: true,
        onlyInViewport: true,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: true,
        dynamicMainBullets: 3,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      watchOverflow: true,
      grabCursor: true,
      breakpoints: {
        320: {
          spaceBetween: 0
        },
        768: {
          spaceBetween: 0
        },
        1024: {
          spaceBetween: 0
        }
      },
      on: {
        init: function (swiper) {
          swiperInitialized.value = true
          console.log('Swiper initialized with', swiper.slides.length, 'slides')
        },
        destroy: function () {
          swiperInitialized.value = false
        }
      }
    }

    swiperInstance.value = new Swiper(swiperContainer.value, swiperOptions)

  } catch (error) {
    console.error('Failed to initialize Swiper:', error)
  }
}

// Watch for banner data changes
watch(
  () => banners.value,
  (newBanners) => {
    if (newBanners && newBanners.length > 0) {
      // Use nextTick to ensure DOM is updated
      nextTick(() => {
        initializeSwiper()
      })
    } else if (swiperInstance.value) {
      swiperInstance.value.destroy(true, true)
      swiperInstance.value = null
    }
  },
  { deep: true, immediate: true }
)

// Handle window focus for revalidation
onMounted(() => {
  if (typeof window !== 'undefined') {
    const handleVisibilityChange = () => {
      if (!document.hidden && swiperInstance.value) {
        const autoplay = (swiperInstance.value as any).autoplay
        if (autoplay && autoplay.running) {
          autoplay.start()
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Auto-refresh every 5 minutes
    const refreshInterval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        refresh()
      }
    }, 5 * 60 * 1000) // 5 minutes

    onUnmounted(() => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      clearInterval(refreshInterval)
    })
  }
})

// Cleanup
onUnmounted(() => {
  if (swiperInstance.value) {
    swiperInstance.value.destroy(true, true)
    swiperInstance.value = null
  }
})
</script>

<style scoped>
.banner {
  min-height: 450px;
  position: relative;
  overflow: hidden;
  margin-bottom: 8px;
}

.banner-item {
  min-height: 450px;
}

/* Static Camera Background */
.static-camera-bg {
  z-index: 1;
  filter: brightness(0.7);
  animation: superSlowZoom 40s infinite alternate ease-in-out;
}

.static-camera-bg img {
  filter: blur(1px);
}

.banner-slide {
  min-height: 450px;
  height: 100%;
  position: relative;
  z-index: 2;
}

.api-bg {
  object-fit: cover;
  width: 100%;
  height: 100%;
  filter: brightness(0.8);
  animation: extremelySlowZoom 10s infinite alternate ease-in-out;
}

.banner-overlay {
  background: linear-gradient(135deg,
      rgba(0, 0, 0, 0.1) 0%,
      rgba(0, 0, 0, 0.1) 50%,
      rgba(0, 0, 0, 0.12) 100%);
  pointer-events: none;
  z-index: 1;
}

/* Content Styling */
.banner-content {
  min-height: 130px;
  z-index: 3;
}

.banner-text-wrapper {
  padding: 1.5rem;
  position: relative;
  animation: fadeInUp 1s ease;
  position: absolute;
  bottom: 20px;
}

.banner-subtitle {

  font-size: 1rem;
  letter-spacing: 2px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  margin-bottom: 0.75rem !important;
  opacity: 0.9;
}

.banner-title {
  font-size: 2.5rem;
  font-weight: 800;
  line-height: 1.2;
  text-shadow:
    0 4px 8px rgba(0, 0, 0, 0.4),
    0 8px 20px rgba(0, 0, 0, 0.3);
  margin-bottom: 1rem;
}

.title-line {
  display: block;
  margin-bottom: 0.5rem;
  animation: none !important;
  transform: none !important;
}

.banner-title .text-main-600 {
  color: #ff6b35 !important;
  position: relative;
  display: inline-block;
}

/* Stable underline - No animation */
.banner-title .text-main-600::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 100%;
  height: 3px;
  background: #ff6b35;
  transform: scaleX(1);
  animation: none;
}

/* Button Styling */
.banner-actions .btn-primary {
  background: linear-gradient(135deg, #ff6b35, #ff8e53);
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow:
    0 8px 20px rgba(255, 107, 53, 0.4),
    0 4px 10px rgba(0, 0, 0, 0.2);
  padding: 0.75rem 2rem;
}

.banner-actions .btn-primary:hover {
  transform: translateY(-3px);
  box-shadow:
    0 12px 25px rgba(255, 107, 53, 0.5),
    0 6px 15px rgba(0, 0, 0, 0.3);
  background: linear-gradient(135deg, #ff8e53, #ff6b35);
}

.banner-actions .btn-primary:active {
  transform: translateY(-1px);
}

/* Swiper Styles */
.bannerSwiper {
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 2;
}

.swiper-slide {
  height: auto;
  opacity: 0;
  transition: opacity 1.5s ease !important;
}

.swiper-slide-active {
  opacity: 1;
}

/* Swiper Pagination - All Grey Dots */
.swiper-pagination {
  bottom: 15px !important;
}

.swiper-pagination-bullet {
  width: 10px;
  height: 10px;
  background: rgba(255, 255, 255, 0.3) !important;
  opacity: 1;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.swiper-pagination-bullet-active {
  background: rgba(0, 0, 0, 0.7) !important;
  border-color: rgba(0, 0, 0, 0.9);
  transform: scale(1.2);
}

.swiper-pagination-bullet-active {
  background: green;
}

@keyframes superSlowZoom {
  0% {
    transform: scale(1);
  }

  100% {
    transform: scale(1.02);
  }
}

@keyframes extremelySlowZoom {
  0% {
    transform: scale(1);
  }

  100% {
    transform: scale(1.01);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive Design */
@media (max-width: 1200px) {

  .banner,
  .banner-item,
  .banner-slide,
  .banner-content {
    min-height: 350px;
  }

  .banner-title {
    font-size: 2rem;
  }
}

@media (max-width: 992px) {

  .banner,
  .banner-item,
  .banner-slide,
  .banner-content {
    min-height: 300px;
    /* Adjusted */
  }

  .banner-title {
    font-size: 1.8rem;
    /* Reduced */
  }

  .banner-subtitle {
    font-size: 0.9rem;
    letter-spacing: 1.5px;
  }

  .banner-actions .btn-primary {
    padding: 0.6rem 1.5rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 768px) {

  .banner,
  .banner-item,
  .banner-slide,
  .banner-content {
    min-height: 250px;
  }

  .banner-title {
    font-size: 1.5rem;
  }

  .banner-text-wrapper {
    padding: 1rem;
  }

  .banner-subtitle {
    font-size: 0.8rem;
    letter-spacing: 1px;
    margin-bottom: 0.5rem !important;
  }

  .swiper-pagination {
    bottom: 10px !important;
  }
}

@media (max-width: 576px) {

  .banner,
  .banner-item,
  .banner-slide,
  .banner-content {
    min-height: 200px;
  }

  .banner-title {
    font-size: 1.2rem;
  }

  .banner-subtitle {
    font-size: 0.7rem;
    letter-spacing: 0.5px;
  }

  .banner-actions .btn-primary {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
    margin-top: 0.5rem !important;
  }

  .banner-text-wrapper {
    padding: 0.75rem;
  }

  .swiper-pagination-bullet {
    width: 8px;
    height: 8px;
  }
}

@media (max-width: 375px) {

  .banner,
  .banner-item,
  .banner-slide,
  .banner-content {
    min-height: 180px;
  }

  .banner-title {
    font-size: 1rem;
    display: none;
  }

  .banner-subtitle {
    font-size: 0.65rem;
    display: none;
  }
}
.banner-loading,
.banner-error,
.banner-empty {
  min-height: 450px;
  z-index: 10;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  backdrop-filter: blur(5px);
}

.banner-error {
  background: linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%);
}

.banner-empty {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

/* Revalidation Indicator */
.revalidation-indicator {
  z-index: 20;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 20px;
  padding: 5px 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

/* Data Status (Debug) */
.data-status {
  z-index: 15;
  opacity: 0.8;
}

/* Swiper Improvements */
.swiper-initialized .swiper-slide {
  opacity: 0;
  transition: opacity 0.5s ease;
}

.swiper-initialized .swiper-slide-active,
.swiper-initialized .swiper-slide-duplicate-active {
  opacity: 1;
}

/* Accessibility Improvements */
/* .swiper-button-next:focus,
.swiper-button-prev:focus {
  outline: 2px solid #ff6b35;
  outline-offset: 2px;
} */

/* Performance Optimizations */
@media (prefers-reduced-motion: reduce) {
  .api-bg,
  .banner-text-wrapper,
  .swiper-button-next,
  .swiper-button-prev {
    animation: none !important;
    transition: none !important;
  }
  
  .swiper-slide {
    transition: opacity 0.3s ease !important;
  }
  
  .revalidation-indicator {
    animation: none !important;
  }
}

/* Dark Mode Support */
@media (prefers-color-scheme: dark) {
  .banner-loading,
  .banner-empty {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  }
  
  .banner-error {
    background: linear-gradient(135deg, #2c1810 0%, #3d2318 100%);
  }
}

/* CSS vendor prefix fix */
.banner-subtitle {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.banner-title {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .revalidation-indicator {
    padding: 3px 8px;
    font-size: 0.8rem;
  }
  
  .data-status {
    display: none; /* Hide debug info on mobile */
  }
}

@media (max-width: 576px) {
  .banner-subtitle {
    -webkit-line-clamp: 1;
    line-clamp: 1;
  }
  
  .banner-title {
    -webkit-line-clamp: 2;
    line-clamp: 2;
  }
}
</style>