<template>
  <section class="brand">
    <div class="container container-lg">
      <div class="brand-inner rounded-16">

        <!-- HEADER -->
        <div class="section-heading flex-between flex-wrap gap-8">
          <h5 class="mb-0">Shop by Brands</h5>

          <div class="flex-align gap-12">
            <NuxtLink
              to="/shop-all"
              class="text-sm fw-medium text-gray-700 hover-text-main-600"
            >
              View All
            </NuxtLink>

            <div class="flex-align gap-6">
              <button class="brand-prev nav-btn">
                <i class="ph ph-caret-left"></i>
              </button>
              <button class="brand-next nav-btn">
                <i class="ph ph-caret-right"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- LOADING -->
        <div v-if="loading" class="text-center py-40">
          <div class="spinner"></div>
          <p class="mt-2 text-gray-600">Loading brands...</p>
        </div>

        <!-- ERROR -->
        <div v-else-if="error" class="text-center py-40 text-red-600">
          {{ error }}
        </div>

        <!-- SLIDER -->
        <ClientOnly>
          <Swiper
            v-if="brands.length"
            :modules="[Navigation]"
            :slides-per-view="6"
            :space-between="20"
            :navigation="{
              nextEl: '.brand-next',
              prevEl: '.brand-prev'
            }"
            :breakpoints="{
              320: { slidesPerView: 2 },
              576: { slidesPerView: 3 },
              768: { slidesPerView: 4 },
              992: { slidesPerView: 5 },
              1200: { slidesPerView: 6 }
            }"
          >
            <SwiperSlide
              v-for="brand in brands"
              :key="brand.id"
            >
              <NuxtLink
                :to="`/shop-all?brand=${encodeURIComponent(brand.name)}`"
                class="brand-item"
              >
                <NuxtImg
                  :src="brand.logo"
                  :alt="brand.name"
                  width="180"
                  height="100"
                  loading="lazy"
                  class="brand-logo"
                />
              </NuxtLink>
            </SwiperSlide>
          </Swiper>
        </ClientOnly>

      </div>
    </div>
  </section>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'

const brands = ref([])
const loading = ref(true)
const error = ref(null)

const fetchBrands = async () => {
  try {
    const res = await $fetch(
      'https://kartmania-api.vibrantick.org/common/brand/read',
      { timeout: 8000 }
    )

    if (res?.data) {
      brands.value = res.data
    } else {
      error.value = 'No brands found'
    }
  } catch (err) {
    console.error(err)
    error.value = 'Failed to load brands'
  } finally {
    loading.value = false
  }
}

onMounted(fetchBrands)
</script>





<style scoped>
.swiper-container {
  overflow: hidden;
  position: relative;
  padding: 0px;
}

.swiper-slide {
  height: auto;
  display: flex;
}

.brand-prev,
.brand-next {
  z-index: 10;
  width: 40px;
  height: 40px;
  background: transparent;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.3s ease;
}

.brand-prev:hover,
.brand-next:hover {
  background-color: #3b82f6; 
  color: white;
  border-color: #3b82f6;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.brand-logo {
  width: 100%;
  height: 120px;
  object-fit: contain;
  padding: 20px;
  background: white;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #f0f0f0;
}

.brand-logo:hover {
  transform: translateY(-5px) scale(1.03);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border-color: #3b82f6;
}

.brand-logo.error-image {
  padding: 30px 20px;
  background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
}

.brand-item {
  background: transparent;
  border-radius: 16px;
  padding: 10px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.brand-item:hover {
  transform: translateY(-2px);
}

/* Loading spinner */
.spinner {
  display: inline-block;
  width: 50px;
  height: 50px;
  border: 3px solid rgba(59, 130, 246, 0.1);
  border-radius: 50%;
  border-top-color: #3b82f6;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Button styles */
.btn-retry {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border: none;
  cursor: pointer;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
  transition: all 0.3s ease;
}

.btn-retry:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
}

/* Empty and error states */
.empty-icon,
.error-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #f9fafb;
  margin: 0 auto 20px;
}

.error-icon {
  background: #fef2f2;
}

.empty-icon {
  background: #f9fafb;
}
@media(max-width:1600px){
   .brand { 
  padding-top: 20px;
  }
  
  .brand-inner {
    padding: 11px; 
  }
}
/* Responsive adjustments */
@media (max-width: 768px) {
  .brand {
    padding: 5px 0; 
  }
  
  /* .brand-inner {
    padding: 16px;
  } */
  
  .brand-logo {
    height: 100px;
    padding: 15px;
  }
}

@media (max-width: 576px) {
  .brand-logo {
    height: 80px;
    padding: 10px;
  }
  
  .brand-prev,
  .brand-next {
    width: 36px;
    height: 36px;
  }
}
</style>
