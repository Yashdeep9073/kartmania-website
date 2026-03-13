<!-- components/PromotionalBanner.vue -->
<template>
  <section v-if="!loading && promotionalBanners.length > 0" class="promotional-banner pb-12 pb-sm-16 pb-md-20 pt-6 pt-sm-8 pt-md-12 pt-lg-20">
    <div class="container container-lg px-4 px-sm-5 px-md-4">
      <div v-if="loading && showStaticFallback === false" class="text-center py-30 py-md-40">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <div v-else-if="error && showStaticFallback === false" class="text-center py-30 py-md-40">
        <div class="alert alert-danger px-3 px-md-4 py-3">
          {{ error }}
        </div>
      </div>

      <div v-else class="row gy-3 gy-sm-4 gy-md-4 gy-lg-5">
        
        <!-- Dynamic Banners from API -->
        <div
          v-for="(banner, index) in promotionalBanners"
          :key="banner.id"
          :class="getColumnClasses(index)"
        >
          <NuxtLink :to="banner.slug ? `/shop-all?offer=${banner.slug}` : (banner.category ? `/shop-all?category=${banner.category}` : '/shop-all')" class="promotional-banner-item position-relative rounded-12 rounded-sm-16 rounded-md-20 rounded-lg-24 overflow-hidden z-1 py-40 py-sm-48 py-md-64 py-lg-76 ps-24 ps-sm-32 ps-md-48 ps-lg-64 pe-16 pe-sm-24 pe-md-40 pe-lg-48 h-100 d-flex flex-column justify-content-end">
            <img
              :src="banner.image"
              :alt="banner.title"
              class="position-absolute top-0 start-0 w-100 h-100 object-fit-cover z-n1"
              loading="lazy"
              decoding="async"
              @error="handleImageError"
            >
            <div class="promotional-banner-item__content position-relative z-2">
              <h6 class="promotional-banner-item__title fw-bold mb-2 mb-sm-3 mb-md-4 mb-lg-4 text-sm text-sm-md text-md-lg text-lg-2xl">{{ banner.title }}</h6>
              <div class="d-flex align-items-center gap-2 gap-sm-3 gap-md-4 gap-lg-8">
                <span class="text-heading fst-italic text-xs text-sm-sm text-md-base">From</span>
                <h6 class="text-danger-600 mb-0 fw-bold text-sm text-sm-md text-md-base text-lg-xl">{{ banner.price }}</h6>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

// Props for dynamic category filtering
const props = defineProps({
  category: { type: String, default: '' }
})

const config = useRuntimeConfig() 
const API_URL = `${config.public.api.offers}?offerType=CATEGORY` 

interface OfferData {
  id: number
  title: string
  description: string
  image: string
  category: string 
  isDeleted: boolean
  createdAt: string
  updatedAt: string
  price?: string // Optional price field for API data
  slug?: string // Offer slug for dynamic routing
  discountType?: string // Discount type (PERCENTAGE, FIXED)
  discountValue?: number // Discount value
  startDate?: string // Offer start date
  endDate?: string // Offer end date
  offerType?: string // Offer type (FLASH_SALE, LIMITED, etc.)
  isActive?: boolean // Whether offer is active
  isFeatured?: boolean // Whether offer is featured
  priority?: number // Display priority
}

interface StaticBanner {
  id: number
  title: string
  description: string
  image: string
  price: string
  category?: string // Optional category for static banners
  slug?: string // Optional slug for static banners
}

interface ApiResponse {
  message: string
  data: OfferData[] // Changed from BannerData[] to OfferData[]
}

// Reactive state
const promotionalBanners = ref<OfferData[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const showStaticFallback = ref(false)

// Responsive breakpoints
const screenWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1024)

// Determine required banners based on screen size
const requiredBanners = computed(() => {
  if (screenWidth.value < 576) return 2 // Small mobile: 2 banners
  if (screenWidth.value < 768) return 4 // Mobile: 4 banners (2x2 grid)
  if (screenWidth.value < 992) return 4 // Tablet: 4 banners (2x2 grid)
  return 4 // Desktop: 4 banners
})

// Update screen width on resize
if (typeof window !== 'undefined') {
  onMounted(() => {
    const updateWidth = () => screenWidth.value = window.innerWidth
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  })
}

// Get column classes based on index and screen size
const getColumnClasses = (index: number): string => {
  // Mobile: 2 columns for better visual appeal
  // Tablet: 2 columns for comfortable touch targets
  // Desktop: 4 columns for full utilization
  return 'col-6 col-sm-6 col-md-4 col-lg-3'
}

// Fetch offer data from API
const fetchPromotionalBanners = async () => {
  try {
    loading.value = true
    error.value = null
    showStaticFallback.value = false

    const result: ApiResponse = await $fetch(API_URL, {
      method: 'GET',
      params: {
        isActive: true,
        // Filter by offerType if category is specified
        ...(props.category && { offerType: props.category.toUpperCase() })
      },
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 8000,
      retry: 2,
    })

    //console.log('🔍 [HomePromotion] Raw API response:', result)
    //console.log('🔍 [HomePromotion] API URL:', API_URL)
    //console.log('🔍 [HomePromotion] API data length:', result?.data?.length || 0)

    if (result?.data && Array.isArray(result.data)) {
      //console.log('🔍 [HomePromotion] Raw API data:', result.data)
      
      // Log the first offer structure in detail
      if (result.data.length > 0) {
        //console.log('🔍 [HomePromotion] First offer structure:', JSON.stringify(result.data[0], null, 2))
      }
      
      // TEMP: Bypass filtering to test display logic
      const validOffers = result.data
        .map((offer: any) => {
          //console.log('🔍 [HomePromotion] Processing offer for display:', offer)
          return {
            id: offer.id,
            title: offer.name || offer.title || '',
            description: offer.description || '',
            image: offer.image || (offer.images?.[0]?.imageUrl) || '',
            category: offer.offerType?.toLowerCase() || 'general',
            slug: offer.slug || '',
            discountType: offer.discountType,
            discountValue: offer.discountValue,
            startDate: offer.startDate,
            endDate: offer.endDate,
            offerType: offer.offerType,
            isActive: offer.isActive,
            isFeatured: offer.isFeatured,
            priority: offer.priority,
            isDeleted: offer.isDeleted,
            createdAt: offer.createdAt || new Date().toISOString(),
            updatedAt: offer.updatedAt || new Date().toISOString(),
            price: offer.discountValue ? (offer.discountType === 'PERCENTAGE' ? `${offer.discountValue}% OFF` : `₹${offer.discountValue}`) : undefined
          }
        })
        .sort((a, b) => a.id - b.id)

      //console.log(`🔍 [HomePromotion] Filtered valid offers count: ${validOffers.length}`)
      //console.log(`🔍 [HomePromotion] showStaticFallback before: ${showStaticFallback.value}`)
      //console.log(`🔍 [HomePromotion] promotionalBanners length: ${promotionalBanners.value.length}`)
      
      if (validOffers.length > 0) {
        promotionalBanners.value = validOffers
        showStaticFallback.value = false
        //console.log(`✅ [HomePromotion] Loaded ${validOffers.length} offers`)
        //console.log(`🔍 [HomePromotion] showStaticFallback after: ${showStaticFallback.value}`)
      } else {
        showStaticFallback.value = true
        //console.log('⚠️ [HomePromotion] No offers available, using static data')
        //console.log(`🔍 [HomePromotion] showStaticFallback after: ${showStaticFallback.value}`)
      }
    } else {
      showStaticFallback.value = true
      //console.log('⚠️ [HomePromotion] Invalid API response, using static data')
    }
  } catch (err: any) {
    console.error('❌ [HomePromotion] API fetch failed:', err)
    showStaticFallback.value = true
    error.value = null
  } finally {
    loading.value = false
  }
}

// Fetch data on component mount
onMounted(() => {
  // Try to fetch from API, but immediately show static banners if fails
  fetchPromotionalBanners()
  
  // Set a timeout to show static banners if API is taking too long
  setTimeout(() => {
    if (loading.value) {
      showStaticFallback.value = true
      loading.value = false
    }
  }, 3000) // Show static after 3 seconds if API is slow
})

// Handle image errors with fallback
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  if (!img.dataset.fallbackSet) {
    img.dataset.fallbackSet = 'true'
    img.src = '/assets/images/nowcategory/festivel.jpg'
  }
}

// Optional: Retry API in background (but keep showing static banners)
onMounted(() => {
  const retryInterval = setInterval(() => {
    if (!showStaticFallback.value) {
      clearInterval(retryInterval)
      return
    }
    // Retry API in background every 30 seconds
    fetchPromotionalBanners().then(() => {
      // If API succeeds now, update banners
      if (promotionalBanners.value.length >= requiredBanners.value) {
        showStaticFallback.value = false
      }
    })
  }, 30000)
  
  return () => clearInterval(retryInterval)
})
</script>

<style scoped>
/* Keep all your existing styles */
.promotional-banner-item {
  background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  display: block;
  text-decoration: none;
  color: inherit;
  min-height: 180px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.promotional-banner-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(79, 70, 229, 0.08) 0%, rgba(124, 58, 237, 0.08) 100%); 
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 0;
}

.promotional-banner-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.04);  
  border-color: rgba(79, 70, 229, 0.3);
}

.promotional-banner-item:hover::before {
  opacity: 1;
}

.promotional-banner-item__content {
  position: relative;
  z-index: 2;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
}

.promotional-banner-item__title {
  font-weight: 800;
  color: #1e293b;
  line-height: 1.2;
  margin-bottom: 0;
  letter-spacing: -0.025em;
}

.promotional-banner-item img {
  transition: transform 0.5s ease;
  min-height: 100%;
  object-position: center;
}

.promotional-banner-item:hover img {
  transform: scale(1.05);
}

.promotional-banner-item:hover {
  border-color: #830622;
  box-shadow: 0 4px 20px rgba(202, 45, 82, 0.2);
}

.text-danger-600 {
  color: #dc2626 !important;
  font-weight: 800;
  letter-spacing: -0.025em;
}

.text-heading {
  color: #64748b;
}

/* Loading spinner */
.spinner-border {
  width: 2.5rem;
  height: 2.5rem;
}

/* Enhanced Responsive Design */

/* Desktop (≥1200px) */
@media (min-width: 1200px) {
  .promotional-banner-item__title {
    margin-bottom: 16px;
  }
}

/* Tablet (≥768px) */
@media (max-width: 1199px) and (min-width: 768px) {
  .promotional-banner {
    padding-top: 40px !important;
  }

  .promotional-banner-item {
    margin-bottom: 16px;
  }
}

/* Mobile (≥576px) */
@media (max-width: 767px) and (min-width: 576px) {
  .col-6 {
    flex: 0 0 auto;
    width: 50%;
  }
}

/* Small Mobile (<576px) */
@media (max-width: 575px) {
  .promotional-banner {
    padding-top: 24px !important;
    padding-bottom: 48px !important;
  }
  
  .promotional-banner-item {
    margin-bottom: 12px;
    min-height: 160px;
    border-radius: 12px !important;
  }
  
  .promotional-banner-item__title {
    font-size: 0.875rem !important;
    line-height: 1.2;
    margin-bottom: 8px !important;
  }
  
  .text-heading {
    font-size: 0.75rem !important;
  }
  
  .text-danger-600 {
    font-size: 0.875rem !important;
  }
}

/* Extra Small Mobile (<400px) */
@media (max-width: 399px) {
  .container-lg {
    padding-left: 16px !important;
    padding-right: 16px !important;
  }
  
  .promotional-banner-item {
    padding: 32px 20px !important;
    margin-bottom: 10px;
    min-height: 140px;
  }
  
  .promotional-banner-item__title {
    font-size: 0.8125rem !important;
    line-height: 1.1;
    margin-bottom: 6px !important;
  }
  
  .text-heading {
    font-size: 0.6875rem !important;
  }
  
  .text-danger-600 {
    font-size: 0.8125rem !important;
  }
}

@media (hover: none) and (pointer: coarse) {
  .promotional-banner-item:hover {
    transform: none;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
  
  .promotional-banner-item:active {
    transform: scale(0.98);
    box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.15), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
  }
} 
</style> 
