<template>
  <header class="header bg-white border-bottom-0 box-shadow-3xl py-10 z-2">
    <div class="container container-lg">
      <nav class="header-inner d-flex justify-content-between gap-8">
        <div class="flex-align menu-category-wrapper position-relative">
          <!-- Category Dropdown Start -->
          <div class="category-dropdown-container position-relative">
            <button 
              ref="categoryButton"
              type="button" 
              class="category-button d-flex align-items-center gap-12 text-white bg-black px-20 py-16 rounded-6 hover-bg-success-700 transition-2"
              @click="toggleDropdown"
              :disabled="loadingCategories"
            >
              <span class="text-xl line-height-1"><i class="ph ph-squares-four"></i></span>
              <span class="button-text">{{ loadingCategories ? 'Loading...' : 'Browse Categories' }}</span>
              <span class="line-height-1 icon transition-2">
                <i :class="['ph', showDropdown ? 'ph-caret-up' : 'ph-caret-down', 'ph-bold']"></i>
              </span>
            </button>

            <!-- Dropdown Menu -->
            <div 
              v-if="showDropdown" 
              ref="dropdownRef"
              class="category-dropdown-menu"
              @click.stop
            >
              <!-- Loading State -->
              <div v-if="loadingCategories" class="dropdown-loading">
                <div class="spinner-border text-main-600" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-12 text-gray-600">Loading categories...</p>
              </div>
              
              <!-- Categories Content -->
              <div v-else-if="categories.length > 0" class="dropdown-content">
                <!-- All Categories -->
                <NuxtLink 
                  to="/product/shop-all"
                  class="dropdown-item all-categories"
                  @click="closeDropdown"
                >
                  <div class="item-icon">
                    <i class="ph ph-grid-nine"></i>
                  </div>
                  <div class="item-text">
                    <span class="item-title">All Categories</span>
                    <span class="item-count">({{ totalProductsCount }})</span>
                  </div>
                </NuxtLink>
                
                <div class="dropdown-divider"></div>
                
                <!-- Categories List -->
                <div class="categories-list">
                  <NuxtLink 
                    v-for="category in categories" 
                    :key="category.id"
                    :to="getCategoryLink(category)" 
                    class="dropdown-item"
                    @click="handleCategoryClick(category)"
                  >
                    <div class="item-icon">
                      <img 
                        :src="getCategoryImage(category)" 
                        :alt="category.name"
                        @error="handleImageError"
                        loading="lazy"
                        class="category-img"
                      >
                    </div>
                    <div class="item-text">
                      <span class="item-title">{{ category.name }}</span>
                      <span class="item-count">({{ category._count?.products || 0 }})</span>
                    </div>
                  </NuxtLink>
                </div>
              </div>
              
              <!-- No Categories -->
              <div v-else class="dropdown-empty">
                <i class="ph ph-folder-open text-4xl text-gray-300 mb-12"></i>
                <p class="text-gray-600">No categories found</p>
              </div>
            </div>
          </div>

          <!-- Menu Start -->
          <div class="header-menu d-lg-block d-none">
            <ul class="nav-menu flex-align">
              <li class="nav-menu__item">
                <NuxtLink 
                  to="/" 
                  class="nav-menu__link text-heading-two"
                  :class="{ 'active': isActiveLink('/') }"
                  @click="setActiveLink('home')"
                  prefetch
                >
                  Home
                </NuxtLink>
              </li>
              <li class="nav-menu__item">
                <NuxtLink 
                  to="/product/shop-all"
                  class="nav-menu__link text-heading-two"
                  :class="{ 'active': isActiveLink('/product') || isActiveLink('/shop') }"
                  @click="setActiveLink('shop')"
                  prefetch
                >
                  Shop
                </NuxtLink>
              </li>
              <li class="nav-menu__item">
                <NuxtLink 
                  to="/become-a-seller" 
                  class="nav-menu__link text-heading-two"
                  :class="{ 'active': isActiveLink('/become-a-seller') }"
                  @click="setActiveLink('become-a-seller')"
                  prefetch
                >
                  Become a Seller
                </NuxtLink>
              </li>
              <li class="nav-menu__item">
                <NuxtLink 
                  to="/person/blogs" 
                  class="nav-menu__link text-heading-two"
                  :class="{ 'active': isBlogActive }"
                  @click="setActiveLink('blogs')"
                  prefetch
                >
                  Blog
                </NuxtLink>
              </li>
              <li class="nav-menu__item">
                <NuxtLink 
                  to="/contact" 
                  class="nav-menu__link text-heading-two"
                  :class="{ 'active': isActiveLink('/contact') }"
                  @click="setActiveLink('contact')"
                  prefetch
                >
                  Contact Us
                </NuxtLink>
              </li>
            </ul>
          </div>
        </div>

        <!-- Header Right start -->
        <div class="header-right flex-align gap-20">
          <!-- Phone Contact - Hidden below 550px -->
          <a href="tel:+(2)871382023" class="phone-contact d-flex align-items-center gap-16 phone-visible"> 
            <span class="d-flex phone-icon-wrapper">
              <img src="/assets/images/icon/mobile.png" alt="Mobile Icon" class="phone-icon-dark">
            </span>
            <span class="phone-text">
              <span class="d-block text-heading fw-medium phone-help-text">Need Help! Call Us</span>
              <span class="d-block fw-bold text-main-600 hover-text-decoration-underline phone-number">+2 871 382 023</span>
            </span>
          </a>
          
          <!-- Mobile Menu Toggle - Always hamburger, no cross -->
          <div class="position-relative d-lg-none">
            <button 
              type="button" 
              class="toggle-mobileMenu ms-3n text-gray-800 text-4xl d-flex align-items-center justify-content-center w-48 h-48 rounded-8 hover-bg-gray-100 transition-2"
              @click="toggleMobileMenu"
            >
              <i class="ph text-2xl ph-list"></i>
            </button>
          </div>
        </div>
      </nav>
    </div>

    <!-- Mobile Menu Overlay -->
    <div 
      v-if="showMobileMenu" 
      class="mobile-overlay"
      @click="closeMobileMenu"
    ></div>

    <!-- Mobile Menu Sidebar -->
    <div 
      v-if="showMobileMenu" 
      ref="mobileMenuRef"
      class="mobile-menu-sidebar"
      :class="{ 'mobile-menu-show': showMobileMenu }"
      @click.stop
    > 
      <div class="mobile-menu-header bg-main-600 text-white px-26 py-20">
  <div class="d-flex align-items-center justify-content-between">
    
    <!-- Logo -->
    <img 
      src="/assets/images/logo/logo.png"
      alt="Logo"
      class="mobile-logo"
    />

    <!-- Close Button -->
    <button @click="closeMobileMenu" class="mobile-close-btn">
<i class="ph ph-x text-xl fw-bold"></i>
    </button>

  </div>
</div>

      
      <div class="mobile-menu-content py-12 px-16">
        <NuxtLink to="/" class="mobile-menu-item"
          :class="{ 'active-mobile': isActiveLink('/') }"
          @click="closeMobileMenu">
          <div class="menu-icon">
            <i class="ph ph-house"></i>
          </div>
          <div class="menu-text">
            <span class="item-title">Home</span>
            <span class="item-subtitle">Main Dashboard</span>
          </div>
        </NuxtLink>
        
        <NuxtLink to="/product/shop-all" class="mobile-menu-item"
          :class="{ 'active-mobile': isActiveLink('/product') || isActiveLink('/shop') }"
          @click="closeMobileMenu">
          <div class="menu-icon">
            <i class="ph ph-shopping-cart"></i>
          </div>
          <div class="menu-text">
            <span class="item-title">Shop</span>
            <span class="item-subtitle">Browse Products</span>
          </div>
        </NuxtLink>
        
        <NuxtLink to="/person" class="mobile-menu-item"
          :class="{ 'active-mobile': isBlogActive }"
          @click="closeMobileMenu">
          <div class="menu-icon">
            <i class="ph ph-newspaper"></i>
          </div>
          <div class="menu-text">
            <span class="item-title">Blog</span>
            <span class="item-subtitle">Latest Articles</span>
          </div>
        </NuxtLink>
        
        <button @click="callPhone" class="mobile-menu-item phone-item">
          <div class="menu-icon">
            <i class="ph ph-phone"></i>
          </div>
          <div class="menu-text">
            <span class="item-title">Call Us</span>
            <span class="item-subtitle">+2 871 382 023</span>
          </div>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from 'vue'
import { useRouter, useRoute } from '#imports'

const router = useRouter()
const route = useRoute()

// State
const showDropdown = ref(false)
const showMobileMenu = ref(false)
const activeLink = ref('')
const categories = ref([])
const loadingCategories = ref(false)
const totalProductsCount = ref(0)
const dropdownRef = ref(null)
const mobileMenuRef = ref(null)
const categoryButton = ref(null)

// Computed property to check if blog is active
const isBlogActive = computed(() => {
  const path = route.path
  return path === '/person' || 
         path.startsWith('/person/') || 
         path === '/blogs' || 
         path.startsWith('/blogs/') ||
         path === '/blog' || 
         path.startsWith('/blog/')
})

// Helper function to check active link
const isActiveLink = (path) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}

// Fetch categories from API
const fetchCategories = async () => {
  try {
    loadingCategories.value = true
    console.log('Fetching categories from API...')
    
    const response = await fetch('https://kartmania-api.vibrantick.org/common/product-category/read')
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    console.log('API Response:', data)
    
    if (data.data && Array.isArray(data.data)) {
      categories.value = data.data
      console.log('Categories loaded:', categories.value.length)
      
      totalProductsCount.value = data.data.reduce((sum, category) => {
        return sum + (category._count?.products || 0)
      }, 0)
      console.log('Total products count:', totalProductsCount.value)
    } else {
      console.warn('No categories data found in response')
      categories.value = []
    }
  } catch (error) {
    console.error('Error fetching categories:', error)
    categories.value = []
  } finally {
    loadingCategories.value = false
  }
}

// Get category image with fallback
const getCategoryImage = (category) => {
  if (category.logo) return category.logo
  if (category.image) return category.image
  return '/assets/images/category-placeholder.png'
}

// Get category link for shop-all page
const getCategoryLink = (category) => {
  return `/product/shop-all?category=${encodeURIComponent(category.name)}`
}

// Handle category click
const handleCategoryClick = (category) => {
  console.log('Category clicked:', category.name)
  closeDropdown()
}

// Set active link
const setActiveLink = (link) => {
  activeLink.value = link
}

// Toggle category dropdown
const toggleDropdown = async () => {
  console.log('Toggle dropdown clicked, current state:', showDropdown.value)
  
  if (showMobileMenu.value) {
    showMobileMenu.value = false
    enableBodyScroll()
  }
  
  showDropdown.value = !showDropdown.value
  
  if (showDropdown.value) {
    disableBodyScroll()
    if (categories.value.length === 0) {
      console.log('Fetching categories...')
      fetchCategories()
    }
    await nextTick()
    positionDropdown()
  } else {
    enableBodyScroll()
    resetDropdownPosition()
  }
}

// Position dropdown under button
const positionDropdown = () => {
  if (dropdownRef.value && categoryButton.value) {
    const buttonRect = categoryButton.value.getBoundingClientRect()
    const dropdown = dropdownRef.value
    dropdown.style.position = 'fixed'
    dropdown.style.top = `${buttonRect.bottom + 8}px`
    dropdown.style.left = `${buttonRect.left}px`
    dropdown.style.width = `${buttonRect.width}px`
    dropdown.style.minWidth = '200px'
    dropdown.style.maxWidth = '320px'
  }
}

// Reset dropdown position
const resetDropdownPosition = () => {
  if (dropdownRef.value) {
    const dropdown = dropdownRef.value
    dropdown.style.position = ''
    dropdown.style.top = ''
    dropdown.style.left = ''
    dropdown.style.width = ''
    dropdown.style.minWidth = ''
    dropdown.style.maxWidth = ''
  }
}

// Close dropdown
const closeDropdown = () => {
  console.log('Closing dropdown')
  showDropdown.value = false
  enableBodyScroll()
  resetDropdownPosition()
}

// Toggle mobile menu
const toggleMobileMenu = () => {
  if (showDropdown.value) {
    showDropdown.value = false
    enableBodyScroll()
    resetDropdownPosition()
  }
  
  showMobileMenu.value = !showMobileMenu.value
  
  if (showMobileMenu.value) {
    disableBodyScroll()
  } else {
    enableBodyScroll()
  }
}

// Close mobile menu
const closeMobileMenu = () => {
  showMobileMenu.value = false
  enableBodyScroll()
}

// Handle phone call
const callPhone = () => {
  const phoneNumber = '+2871382023'
  if (confirm(`Call ${phoneNumber}?`)) {
    window.location.href = `tel:${phoneNumber.replace(/\D/g, '')}`
  }
  closeMobileMenu()
}

// Handle image error
const handleImageError = (event) => {
  event.target.src = '/assets/images/placeholder.jpg'
}

// Disable body scroll
const disableBodyScroll = () => {
  document.body.style.overflow = 'hidden'
  document.body.style.position = 'fixed'
  document.body.style.width = '100%'
  document.body.style.height = '100%'
}

// Enable body scroll
const enableBodyScroll = () => {
  document.body.style.overflow = ''
  document.body.style.position = ''
  document.body.style.width = ''
  document.body.style.height = ''
}

// Close dropdowns when clicking outside
const handleClickOutside = (event) => {
  const dropdown = dropdownRef.value
  const dropdownButton = categoryButton.value
  const mobileMenu = mobileMenuRef.value
  const mobileMenuButton = document.querySelector('.toggle-mobileMenu')
  
  if (dropdown && dropdownButton && 
      !dropdown.contains(event.target) && 
      !dropdownButton.contains(event.target) &&
      showDropdown.value) {
    closeDropdown()
  }
  
  if (mobileMenu && mobileMenuButton && 
      !mobileMenu.contains(event.target) && 
      !mobileMenuButton.contains(event.target) &&
      showMobileMenu.value) {
    closeMobileMenu()
  }
}

// Update active link when route changes
watch(() => route.path, (newPath) => {
  console.log('Route changed to:', newPath)
  
  if (newPath === '/') {
    activeLink.value = 'home'
  } else if (newPath.includes('/product') || newPath.includes('/shop')) {
    activeLink.value = 'shop'
  } else if (newPath.includes('/seller')) {
    activeLink.value = 'seller'
  } else if (isBlogActive.value) {
    activeLink.value = 'blog'
  } else if (newPath.includes('/contact')) {
    activeLink.value = 'contact'
  } else {
    activeLink.value = ''
  }
  
  closeDropdown()
  closeMobileMenu()
})

// Lifecycle hooks
onMounted(() => {
  console.log('Header component mounted')
  
  document.addEventListener('click', handleClickOutside)
  
  if (route.path === '/') {
    activeLink.value = 'home'
  } else if (route.path.includes('/product') || route.path.includes('/shop')) {
    activeLink.value = 'shop'
  } else if (route.path.includes('/seller')) {
    activeLink.value = 'seller'
  } else if (isBlogActive.value) {
    activeLink.value = 'blog'
  } else if (route.path.includes('/contact')) {
    activeLink.value = 'contact'
  }
})

// Cleanup
onUnmounted(() => {
  console.log('Header component unmounted')
  document.removeEventListener('click', handleClickOutside)
  enableBodyScroll() // Ensure scroll is enabled when component unmounts
  resetDropdownPosition()
})
</script>

<style scoped>
  .mobile-logo {
  height: 36px;       /* apne design ke hisaab se change kar sakte ho */
  width: auto;
  object-fit: contain;
}

/* ==================== BASE STYLES ==================== */
.header {
  position: relative;
  z-index: 1000;
  width: 100%;
}

.menu-category-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  gap: 30px;
}

/* ==================== CATEGORY DROPDOWN FIXES ==================== */
.category-dropdown-container {
  position: relative;
  display: inline-block;
}

.category-button {
  position: relative;
  z-index: 1001;
  white-space: nowrap;
}

.category-dropdown-menu {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  max-height: 400px;
  overflow: hidden;
  z-index: 99999 !important;
  animation: dropdownSlide 0.3s ease;
  transform-origin: top center;
}

@keyframes dropdownSlide {
  from {
    opacity: 0;
    transform: translateY(-10px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Dropdown Loading */
.dropdown-loading {
  padding: 40px 20px;
  text-align: center;
}

/* Dropdown Content */
.dropdown-content {
  padding: 8px 0;
}

/* Dropdown Items */
.dropdown-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  text-decoration: none;
  color: #374151;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
  cursor: pointer;
}

.dropdown-item:hover {
  background: #f9fafb;
  border-left-color: #000000;
}

.dropdown-item.all-categories {
  background: #f3f4f6;
  font-weight: 600;
  margin-bottom: 4px;
}

.dropdown-item.all-categories:hover {
  background: #e5e7eb;
}

/* Item Icon */
.item-icon {
  width: 32px;
  height: 32px;
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.item-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
}

.all-categories .item-icon {
  background: #000000;
  color: white;
  border-radius: 8px;
  padding: 6px;
}

/* Item Text */
.item-text {
  flex: 1;
  min-width: 0;
}

.item-title {
  display: block;
  font-weight: 500;
  font-size: 14px;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-count {
  font-size: 12px;
  color: #6b7280;
  margin-left: 4px;
}

/* Dropdown Divider */
.dropdown-divider {
  height: 1px;
  background: #e5e7eb;
  margin: 8px 20px;
}

/* Categories List */
.categories-list {
  max-height: 300px;
  overflow-y: auto;
  padding-right: 4px;
}

.categories-list::-webkit-scrollbar {
  width: 6px;
}

.categories-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.categories-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 10px;
}

.categories-list::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* Dropdown Empty */
.dropdown-empty {
  padding: 40px 20px;
  text-align: center;
}

/* ==================== NAVIGATION MENU ==================== */
.header-menu {
  margin-left: 30px;
}

.nav-menu {
  display: flex;
  gap: 30px;
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-menu__item {
  position: relative;
}

.nav-menu__link {
  position: relative;
  text-decoration: none !important;
  color: #000000 !important;
  transition: all 0.2s ease;
  padding: 8px 16px;
  display: inline-block;
  font-weight: 500;
  font-size: 15px;
  white-space: nowrap;
}

.nav-menu__link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 16px;
  right: 16px;
  height: 2px;
  background: #000000;
  transform: scaleX(0);
  transition: transform 0.3s ease;
  transform-origin: center;
}

.nav-menu__link:hover::after {
  transform: scaleX(1);
}

.nav-menu__link.active {
  color: #000000 !important;
  font-weight: 700 !important;
}

.nav-menu__link.active::after {
  transform: scaleX(1);
  background: #000000;
}

/* ==================== PHONE CONTACT ENHANCEMENTS ==================== */
.phone-contact {
  text-decoration: none;
  transition: all 0.2s ease;
  max-width: 200px;
  flex-shrink: 1;
}

.phone-contact:hover {
  text-decoration: none;
}

.phone-icon-wrapper {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.phone-icon-dark {
  width: 28px;
  height: 28px;
  filter: brightness(0.7) contrast(1.2);
  transition: all 0.2s ease;
}

.phone-contact:hover .phone-icon-dark {
  filter: brightness(0.5) contrast(1.3);
}

.phone-text {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  text-overflow: ellipsis;
}

.phone-help-text {
  font-size: 0.875rem !important;
  color: #374151 !important;
  font-weight: 500 !important;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.phone-number {
  font-size: 1rem !important;
  color: #000000 !important;
  font-weight: 700 !important;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ==================== MOBILE MENU OVERLAY ==================== */
.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99998;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.mobile-overlay.show {
  opacity: 1;
  visibility: visible;
}

/* ==================== MOBILE MENU SIDEBAR ==================== */
.mobile-menu-sidebar {
  position: fixed;
  top: 0;
  left: -100%;
  width: 280px;
  height: 100vh;
  background: white;
  box-shadow: 5px 0 20px rgba(0, 0, 0, 0.1);
  z-index: 99999 !important;
  transition: left 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  overflow-y: auto;
  border-right: 1px solid #e5e7eb;
}

.mobile-menu-sidebar.mobile-menu-show {
  left: 0;
}

.mobile-menu-header {
  padding: 3.0rem 1.25rem;
  background: linear-gradient(135deg, #fffadf 0%, #fff7f7 100%);
  color: white;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: sticky;
  top: 0;
  z-index: 10;
}

.mobile-menu-header h3 {
  margin: 0;
  font-size: 1.125rem;
  letter-spacing: 0.5px;
}

.mobile-close-btn {
  background: rgba(83, 131, 29, 0.984);
  border: none;
  width: 44px;
  height: 30px;
  border-radius: 50%;
  color: rgb(247, 246, 246);
  cursor: pointer;
  display: flex;
  position: relative;
  left: 10px;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.mobile-close-btn:hover {
  background: rgba(67, 177, 7, 0.25);

}

.mobile-menu-content {
  padding: 1.5rem 1.25rem;
  flex: 1;
}

.mobile-menu-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0.75rem;
  text-decoration: none;
  color: #374151;
  border-radius: 12px;
  margin-bottom: 0.5rem;
  width: 100%;
  background: transparent;
  border: none;
  text-align: left;
  transition: all 0.25s ease;
  border-left: 4px solid transparent;
  font-family: inherit;
  cursor: pointer;
}

.mobile-menu-item:hover {
  background: linear-gradient(90deg, #f8fafc 0%, #f1f5f9 100%);
  border-left-color: #000000;
  transform: translateX(4px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.mobile-menu-item.active-mobile {
  background: linear-gradient(90deg, #e0f2fe 0%, #b9f5d0 100%);
  border-left-color: #000000;
  color: #000000;
  font-weight: 600;
}

.menu-icon {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #475569;
  flex-shrink: 0;
  font-size: 1.125rem;
  transition: all 0.25s ease;
}

.mobile-menu-item:hover .menu-icon,
.mobile-menu-item.active-mobile .menu-icon {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  color: #000000;
  transform: scale(1.05);
}

.menu-text {
  flex: 1;
}

.item-title {
  font-weight: 600;
  font-size: 0.95rem;
  display: block;
  color: #111827;
  letter-spacing: 0.25px;
}

.item-subtitle {
  font-size: 0.8rem;
  color: #64748b;
  display: block;
  font-weight: 400;
}

.phone-item .menu-icon {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #92400e;
}

.phone-item:hover .menu-icon {
  background: linear-gradient(135deg, #fefce8 0%, #fef3c7 100%);
  color: #b45309;
}

/* ==================== RESPONSIVE FIXES ==================== */

/* Hide phone below 550px */
@media (max-width: 549px) {
  .phone-visible {
    display: none !important;
  }
}

/* Desktop (992px and above) */
@media (min-width: 992px) {
  .header-menu {
    display: block !important;
  }
  
  .mobile-menu-sidebar,
  .mobile-overlay {
    display: none !important;
  }
  
  .phone-contact {
    gap: 20px;
    max-width: none;
  }
  
  .phone-icon-wrapper {
    width: 48px;
    height: 48px;
  }
  
  .phone-icon-dark {
    width: 32px;
    height: 32px;
  }
  
  .phone-help-text {
    font-size: 1rem !important;
  }
  
  .phone-number {
    font-size: 1.125rem !important;
  }
}

/* Tablet (768px - 991px) */
@media (max-width: 991px) and (min-width: 768px) {
  .header-menu {
    display: none !important;
  }
  
  .nav-menu {
    gap: 20px;
  }
  
  .nav-menu__link {
    font-size: 14px;
    padding: 6px 12px;
  }
  
  .mobile-menu-sidebar {
    width: 320px;
  }
  
  /* Responsive: Phone section compact on tablet */
  .phone-contact {
    gap: 12px;
    padding: 6px 10px;
    background: rgba(248, 250, 252, 0.5);
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    max-width: 180px;
  }
  
  .phone-icon-wrapper {
    width: 40px;
    height: 40px;
  }
  
  .phone-icon-dark {
    width: 28px;
    height: 28px;
  }
  
  .phone-help-text {
    font-size: 0.8rem !important;
  }
  
  .phone-number {
    font-size: 0.95rem !important;
  }
}

/* Mobile (up to 767px) */
@media (max-width: 767px) {
  .header-inner {
    gap: 0.5rem;
  }
  
  .header-menu {
    display: none !important;
  }
  
  .header-right {
    gap: 8px;
  }
  
  .categories-list {
    max-height: 40vh;
  }
  
  .dropdown-item {
    padding: 10px 16px;
  }
  
  .category-button {
    padding: 12px 16px;
    font-size: 14px;
  }
  
  .mobile-menu-sidebar {
    width: 280px;
  }
  
  /* On small mobile, phone hidden below 550px, hamburger last (only item) */
}

/* Mobile Portrait (up to 575px) - sm breakpoint */
@media (max-width: 575px) {
  .categories-list {
    max-height: 50vh;
  }
  
  .nav-menu__link {
    font-size: 13px;
    padding: 4px 10px;
  }
  
  .mobile-menu-sidebar {
    width: 260px;
  }
  
  .mobile-menu-content {
    padding: 1.25rem 1rem;
  }
  
  .mobile-menu-item {
    padding: 0.875rem 0.5rem;
    margin-bottom: 0.375rem;
  }
  
  /* Phone visible on 550px+, compact */
  .phone-contact {
    gap: 8px;
    padding: 4px 8px;
    max-width: 150px;
  }
  
  .phone-icon-wrapper {
    width: 36px;
    height: 36px;
  }
  
  .phone-icon-dark {
    width: 24px;
    height: 24px;
  }
  
  .phone-help-text {
    font-size: 0.75rem !important;
    display: none;
  }
  
  .phone-number {
    font-size: 0.85rem !important;
  }
}

/* Extra Small Devices (up to 375px) */
@media (max-width: 375px) {
  .dropdown-item {
    padding: 8px 12px;
  }
  
  .item-title {
    font-size: 13px;
  }
  
  .item-count {
    font-size: 11px;
  }
  
  .mobile-menu-sidebar {
    width: 240px;
  }
  
  .header-right {
    gap: 0.25rem;
  }
  
  .phone-contact {
    gap: 4px;
    padding: 2px 6px;
    max-width: 120px;
  }
  
  .phone-icon-wrapper {
    width: 32px;
    height: 32px;
  }
  
  .phone-icon-dark {
    width: 22px;
    height: 22px;
  }
  
  .phone-number {
    font-size: 0.8rem !important;
  }
  
  .category-button {
    padding: 10px 14px;
    font-size: 13px;
  }
  
  .button-text {
    font-size: 13px;
  }
}

/* Prevent body scroll when menu is open */
body.no-scroll {
  overflow: hidden !important;
  position: fixed !important;
  width: 100% !important;
  height: 100% !important;
}

/* Smooth scroll for sidebar content */
.mobile-menu-content {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 #f1f5f9;
}

.mobile-menu-content::-webkit-scrollbar {
  width: 4px;
}

.mobile-menu-content::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 10px;
}

.mobile-menu-content::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

.mobile-menu-content::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>