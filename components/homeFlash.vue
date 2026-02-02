<template>
  <div class="flash-sales">
    <div class="container container-lg">
      <!-- Section Heading -->
      <div class="section-heading">
        <div class="flex-between flex-wrap gap-8"> 
          <h5 class="mb-0">Flash Sales Today</h5>
          
          <div v-if="!loading && activeOffer" class="flex-align gap-16">
            <div class="offer-badge">
              {{ activeOffer.discountValue }}% OFF   
            </div>
            <div class="offer-timer">
              Ends: {{ formatDate(activeOffer.endDate) }} 
            </div>
          </div>
          
          <div v-else class="offer-placeholder">
            Special Offers 
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-container">  
        <div class="loading-spinner"></div>
        <p>Loading flash sales...</p> 
      </div>

      <!-- Content -->
      <div v-else class="flash-sales-content">
        <!-- Swiper Container -->
        <div class="swiper-container-wrapper">
          <div ref="swiperContainer" class="product-swiper">
            <div class="swiper-wrapper">
              <div 
                v-for="(product, index) in displayProducts" 
                :key="product.id"
                class="swiper-slide"
              >
                <div class="product-card"> 
                  <button 
                    class="add-cart-btn"
                    @click="addToCart(product)"
                  >
                    Add <i class="ph ph-shopping-cart"></i> 
                  </button>

                  <NuxtLink 
                    :to="`/shop-all/--${product.id}`" 
                    class="product-image-container"
                  >
                    <img
                      :src="getProductImage(product)"
                      :alt="product.name"
                      class="product-image"
                      @error="handleImageError($event, index)" 
                      loading="lazy"
                      width="280"
                      height="210"
                    />
                  </NuxtLink> 
                  
                  <div class="product-content">
                    <div class="price-review-row">
                      <div class="price-section">
                        <span class="current-price">
                          ₹{{ calculateDiscountedPrice(product) }}
                          <span class="per-unit">/Qty</span>
                        </span>
                        <span class="original-price" v-if="activeOffer?.discountValue">
                          ₹{{ product.price }}
                        </span>
                      </div>

                      <div class="review-section">
                        <span class="rating">4.8</span>
                        <i class="ph-fill ph-star rating-star"></i>
                        <span class="review-count">(17k)</span>
                      </div>
                    </div>

                    <h6 class="product-title">
                      <NuxtLink  
                        :to="`/product/${product.id}`" 
                        class="product-link"
                      >
                        {{ product.name }}
                      </NuxtLink>
                    </h6>

                    <!-- Progress Bar -->
                    <div class="progress-section">
                      <div class="progress-info">
                        <span>Sold: {{ getRandomSoldPercentage() }}%</span>
                        <span>Available: {{ getRandomAvailable() }}</span>
                      </div>
                      <div class="progress-bar">
                        <div 
                          class="progress-fill" 
                          :style="{ width: getRandomSoldPercentage() + '%' }"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Navigation Buttons -->
          <div class="navigation-buttons" v-if="displayProducts.length > 0">
            <button
              type="button"
              class="nav-btn prev-btn"
              @click="slidePrev"
            >
              <i class="ph ph-caret-left"></i>
            </button>
            <button
              type="button"
              class="nav-btn next-btn"
              @click="slideNext"
            >
              <i class="ph ph-caret-right"></i>
            </button>
          </div>
        </div>

        <!-- No Products -->
        <div v-if="!loading && displayProducts.length === 0" class="empty-state">
          <i class="ph ph-lightning"></i>
          <p>No flash sale products available</p>
          <p>Check back later for exciting offers!</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue'

const config = useRuntimeConfig()
const API_URL = config.public.api.offers

// Refs
const swiperInstance = ref(null)
const swiperContainer = ref(null)
const loading = ref(true)
const activeOffer = ref(null)

// Static products for fallback
const staticProducts = [
  {
    id: 1,
    name: "Taylor Farms Broccoli Florets Vegetables",
    price: "28.99",
    finalPrice: 14.99,
    discount: 48,
    image: "/assets/images/thumbs/product-img26.png",
    soldPercentage: 65,
    available: 24,
    rating: 4.8,
    reviewCount: 17000
  },
  {
    id: 2,
    name: "Fresh Organic Avocados",
    price: "34.99",
    finalPrice: 19.99,
    discount: 43,
    image: "/assets/images/thumbs/product-img27.png",
    soldPercentage: 52,
    available: 32,
    rating: 4.7,
    reviewCount: 12500
  },
  {
    id: 3,
    name: "Organic Strawberries Pack",
    price: "24.99",
    finalPrice: 12.99,
    discount: 48,
    image: "/assets/images/thumbs/product-img28.png",
    soldPercentage: 78,
    available: 18,
    rating: 4.9,
    reviewCount: 8900
  },
  {
    id: 4,
    name: "Fresh Spinach Leaves",
    price: "18.99",
    finalPrice: 9.99,
    discount: 47,
    image: "/assets/images/thumbs/product-img29.png",
    soldPercentage: 45,
    available: 45,
    rating: 4.6,
    reviewCount: 11200
  },
  {
    id: 5,
    name: "Organic Carrots Bundle",
    price: "14.99",
    finalPrice: 7.99,
    discount: 47,
    image: "/assets/images/thumbs/product-img30.png",
    soldPercentage: 71,
    available: 29,
    rating: 4.8,
    reviewCount: 7600
  },
  {
    id: 6,
    name: "Fresh Bell Peppers Mix",
    price: "22.99",
    finalPrice: 11.99,
    discount: 48,
    image: "/assets/images/thumbs/product-img13.png",
    soldPercentage: 83,
    available: 17,
    rating: 4.7,
    reviewCount: 9400
  },
  {
    id: 7,
    name: "Organic Tomatoes Pack",
    price: "16.99",
    finalPrice: 8.99,
    discount: 47,
    image: "/assets/images/thumbs/product-img3.png",
    soldPercentage: 92,
    available: 8,
    rating: 4.9,
    reviewCount: 6800
  }
]

// Helper functions
const formatDate = (dateString) => {
  if (!dateString) return 'Soon'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  } catch (error) {
    return 'Soon'
  }
}

const getProductImage = (product) => {
  // Handle API product structure
  if (product.product?.images?.[0]?.imageUrl) {
    return product.product.images[0].imageUrl
  }
  // Handle static product structure
  if (product.image) {
    return product.image
  }
  // Fallback image
  return "/assets/images/thumbs/product-img26.png"
}

const calculateDiscountedPrice = (productItem) => {
  // If we have an active offer with discount
  if (activeOffer.value?.discountType === 'PERCENTAGE' && activeOffer.value?.discountValue) {
    const price = parseFloat(productItem.product?.price || productItem.price || 0)
    const discount = activeOffer.value.discountValue
    const discountedPrice = price - (price * discount / 100)
    return discountedPrice.toFixed(2)
  }
  
  // If no discount or other discount types
  return parseFloat(productItem.product?.price || productItem.price || 0).toFixed(2)
}

const getRandomSoldPercentage = () => {
  return Math.floor(Math.random() * 30) + 50 // 50-80%
}

const getRandomAvailable = () => {
  return Math.floor(Math.random() * 30) + 10 // 10-40
}

const handleImageError = (event, index) => {
  const img = event.target
  const fallbackImages = [ 
    "/assets/images/thumbs/product-img26.png", 
    "/assets/images/thumbs/product-img27.png",
    "/assets/images/thumbs/product-img28.png",
    "/assets/images/thumbs/product-img29.png",
    "/assets/images/thumbs/product-img30.png",
    "/assets/images/thumbs/product-img13.png",
    "/assets/images/thumbs/product-img3.png"
  ]
  img.src = fallbackImages[index % fallbackImages.length] 
  img.onerror = null 
}  

const addToCart = (product) => {
  // Implement cart logic
  const productData = product.product || product
  console.log('Adding to cart:', productData.name, productData.id)
}

// Computed property for display products
const displayProducts = computed(() => {
  if (activeOffer.value?.products && activeOffer.value.products.length > 0) {
    return activeOffer.value.products
      .map(item => ({
        ...item,
        name: item.product?.name || item.name,
        price: item.product?.price || item.price,
        images: item.product?.images || item.images
      }))
      .slice(0, 7)
  }
  return staticProducts
})

// Fetch offers using $fetch
const fetchOffers = async () => {
  try {
    console.log('Fetching offers from:', API_URL)
    
    const response = await $fetch(API_URL, {
      method: 'GET',
      params: {
        offerType: 'FLASH_SALE', 
        isActive: true
      },
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 5000,
    })
    
    console.log('API Response:', response)
    
    if (response && response.data && response.data.length > 0) {
      // Find first active offer
      const activeOfferData = response.data.find(offer => offer.isActive)
      
      if (activeOfferData) {
        activeOffer.value = activeOfferData
        console.log('Active offer found:', activeOfferData.name)
      } else {
        console.log('No active offers found')
      }
    } else {
      console.log('No offers data in response')
    }
  } catch (error) {
    console.error('Error fetching offers:', error)
    console.log('Using static products for flash sales')
  } finally {
    loading.value = false
  }
}

// Initialize Swiper
const initSwiper = async () => {
  if (!swiperContainer.value || displayProducts.value.length === 0) return
  
  try {
    const SwiperModule = await import('swiper')
    const { Navigation, Autoplay } = await import('swiper/modules')
    
    const Swiper = SwiperModule.default
    
    swiperInstance.value = new Swiper(swiperContainer.value, {
      modules: [Navigation, Autoplay],
      loop: displayProducts.value.length > 4,
      slidesPerView: 5,
      spaceBetween: 16,
      centeredSlides: false,
      grabCursor: true,
      speed: 600,
      
      navigation: {
        nextEl: '.next-btn',
        prevEl: '.prev-btn',
        disabledClass: 'nav-btn-disabled'
      },
      
      autoplay: {
        delay: 3000,
        disableOnInteraction: true,
        pauseOnMouseEnter: true
      },
      
      breakpoints: {
        320: {
          slidesPerView: 1,
          spaceBetween: 12
        },
        400: {
          slidesPerView: 1.5,
          spaceBetween: 12
        },
        480: {
          slidesPerView: 2,
          spaceBetween: 12
        },
        576: {
          slidesPerView: 2.5,
          spaceBetween: 14
        },
        640: {
          slidesPerView: 3,
          spaceBetween: 14
        },
        768: {
          slidesPerView: 3,
          spaceBetween: 16
        },
        900: {
          slidesPerView: 4,
          spaceBetween: 16
        },
        1024: {
          slidesPerView: 4,
          spaceBetween: 16
        },
        1200: {
          slidesPerView: 5,
          spaceBetween: 16
        },
        1400: {
          slidesPerView: 5,
          spaceBetween: 16
        }
      },
      
      on: {
        init: function() {
          console.log('Swiper initialized successfully')
        }
      }
    })

  } catch (error) {
    console.error('Error initializing Swiper:', error)
  }
}

const slideNext = () => {
  swiperInstance.value?.slideNext()
}

const slidePrev = () => {
  swiperInstance.value?.slidePrev()
}

// Lifecycle
onMounted(async () => {
  await fetchOffers()
  await nextTick()
  initSwiper()
})

onUnmounted(() => {
  if (swiperInstance.value) {
    swiperInstance.value.destroy(true, true)
    swiperInstance.value = null
  }
})
</script>

<style scoped>
.flash-sales {
  padding: 60px 0;
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
}

.container-lg {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

/* Section Heading */
.section-heading {
  margin-bottom: 32px;
}

.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.flex-wrap {
  flex-wrap: wrap;
}

.gap-8 {
  gap: 8px;
}

h5 {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.flex-align {
  display: flex;
  align-items: center;
}

.gap-16 {
  gap: 16px;
}

/* Offer Badge */
.offer-badge {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #92400e;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  border: 2px solid #fbbf24;
}

.offer-timer {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}

.offer-placeholder {
  font-size: 14px;
  color: #94a3b8;
  font-style: italic;
}

/* Loading State */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  text-align: center;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 3px solid #e2e8f0;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Flash Sales Content */
.flash-sales-content {
  position: relative;
}

/* Swiper Container Wrapper */
.swiper-container-wrapper {
  position: relative;
  padding: 0 40px;
  overflow: hidden;
}

/* Swiper */
.product-swiper {
  width: 100%;
  overflow: hidden;
}

.swiper-wrapper {
  display: flex;
  transition-timing-function: ease-out;
  box-sizing: border-box;
}

.swiper-slide {
  height: auto;
  display: flex;
  flex-shrink: 0;
  transition: transform 0.3s ease;
}

/* Product Card */
.product-card {
  background: white;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  min-width: 0;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 
              0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border-color: #3b82f6;
}

/* Add to Cart Button */
.add-cart-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  opacity: 0;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  z-index: 2;
}

.product-card:hover .add-cart-btn {
  opacity: 1;
  transform: translateY(0);
}

.add-cart-btn:hover {
  background: #3b82f6;
  color: white;
}

/* Product Image */
.product-image-container {
  display: block;
  overflow: hidden;
  border-bottom: 1px solid #f1f5f9;
  background: #f8fafc;
  flex-shrink: 0;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: contain;
  padding: 24px;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

/* Product Content */
.product-content {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}

.price-review-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  flex-shrink: 0;
}

.price-section {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.current-price {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
}

.per-unit {
  font-size: 14px;
  font-weight: 400;
  color: #64748b;
}

.original-price {
  font-size: 14px;
  color: #94a3b8;
  text-decoration: line-through;
}

.review-section {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.rating {
  font-size: 14px;
  font-weight: 600;
  color: #475569;
}

.rating-star {
  color: #f59e0b;
  font-size: 14px;
}

.review-count {
  font-size: 14px;
  color: #64748b;
}

/* Product Title */
.product-title {
  margin: 0 0 16px 0;
  flex-shrink: 0;
  line-height: 1.4;
}

.product-link {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  text-decoration: none;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
  max-height: 3em;
}

.product-link:hover {
  color: #3b82f6;
}

/* Progress Section */
.progress-section {
  margin-top: auto;
  flex-shrink: 0;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: 12px;
  color: #64748b;
}

.progress-bar {
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%);
  border-radius: 3px;
  transition: width 0.3s ease;
}

/* Navigation Buttons */
.navigation-buttons {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  pointer-events: none;
  z-index: 10;
}

.nav-btn {
  width: 40px;
  height: 40px;
  border: 1px solid #e2e8f0;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #64748b;
  transition: all 0.3s ease;
  pointer-events: all;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.nav-btn:hover {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
  transform: scale(1.1);
}

.nav-btn-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #64748b;
  background: white;
  border-radius: 16px;
  border: 1px dashed #e2e8f0;
}

.empty-state i {
  font-size: 48px;
  color: #cbd5e1;
  margin-bottom: 16px;
}

.empty-state p:first-of-type {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #475569;
}

.empty-state p:last-of-type {
  font-size: 14px;
  color: #94a3b8;
}

/* Responsive */
@media (max-width: 768px) {
  .flash-sales {
    padding: 40px 0;
  }
  
  h5 {
    font-size: 20px;
  }
  
  .flex-between {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .swiper-container-wrapper {
    padding: 0 30px;
  }
  
  .product-image-container {
    min-height: 160px;
  }
  
  .product-image {
    height: 160px;
    padding: 16px;
  }
  
  .product-content {
    padding: 16px;
  }
  
  .current-price {
    font-size: 16px;
  }
  
  .product-link {
    font-size: 14px;
    max-height: 2.8em;
  }
  
  .nav-btn {
    width: 36px;
    height: 36px;
  }
}

@media (max-width: 480px) {
  .flash-sales {
    padding: 32px 0;
  }
  
  .swiper-container-wrapper {
    padding: 0 20px;
  }
  
  .product-image-container {
    min-height: 140px;
  }
  
  .product-image {
    height: 140px;
    padding: 12px;
  }
  
  .add-cart-btn {
    padding: 6px 12px;
    font-size: 12px;
  }
  
  .nav-btn {
    width: 32px;
    height: 32px;
    font-size: 14px;
  }
  
  .product-link {
    font-size: 13px;
    max-height: 2.6em;
  }
}

/* Fix for Swiper layout */
:deep(.swiper-slide) {
  height: auto !important;
}

:deep(.swiper-slide > *) {
  height: 100% !important;
  width: 100% !important;
}
</style>