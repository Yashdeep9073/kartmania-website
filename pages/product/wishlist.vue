<template>
  <div class="pt-20">
    <WishlistBreakcrumb/>
  </div>
  <section class="wishlist py-80">
    <div class="container container-lg">
      <div v-if="loading" class="text-center py-80">
        <div class="spinner-border text-main-600" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-16">Loading wishlist...</p>
      </div>
      <div v-else-if="wishlistStore.count === 0" class="text-center py-80">
        <div class="empty-wishlist">
          <i class="ph ph-heart text-6xl text-gray-300 mb-24 d-block"></i>
          <h4 class="text-2xl fw-bold mb-16">Your wishlist is empty</h4>
          <p class="text-gray-600 mb-32">You haven't added any products to your wishlist yet.</p>
          <NuxtLink to="/products" class="btn btn-main py-16 px-32 rounded-8">
            <i class="ph ph-shopping-cart me-8"></i>
            Start Shopping
          </NuxtLink>
        </div>
      </div>
      <div v-else class="row g-4">
        <!-- Wishlist Products Grid -->
    <div class="col-12">
  <div class="flex-between mb-32">
    <h3 class="text-2xl fw-bold">My Wishlist</h3>
    <span class="text-gray-600">{{ wishlistStore.count }} items</span>
  </div>

  <div class="row g-4">
    <div
      v-for="product in wishlistStore.items"
      :key="getProductId(product)"
      class="col-xl-3 col-lg-4 col-md-6"
    >
      <div class="product-card-compact border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
        <!-- Compact Image + Heart -->
        <div class="relative">
          <NuxtLink :to="getProductLink(product)" class="block">
            <div class="aspect-square bg-gray-50 overflow-hidden">
              <img
                :src="getPrimaryImage(product)"
                :alt="getProductName(product)"
                class="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                loading="lazy"
              />
            </div>

            <!-- Badges - Smaller & compact -->
            <div class="absolute top-2 left-2 flex flex-col gap-1 z-10">
              <span
                v-if="getProductStock(product) <= getProductAlertThreshold(product) && getProductStock(product) > 0"
                class="inline-block bg-amber-600 text-white text-[10px] font-medium px-2 py-0.5 rounded-full shadow-sm"
              >
                Low
              </span>
              <span
                v-else-if="getDiscountValue(product) > 0"
                class="inline-block bg-red-600 text-black text-[10px] font-medium px-2 py-0.5 rounded-full shadow-sm"
              >
                -{{ getDiscountValue(product) }}%
              </span>
              <span
                v-else-if="getProductStock(product) <= 0"
                class="inline-block bg-gray-700 text-white text-[10px] font-medium px-2 py-0.5 rounded-full shadow-sm"
              >
                Out
              </span>
            </div>
          </NuxtLink>

          <!-- Small Heart Button -->
          <button
            type="button"
            class="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-red-50 text-gray-700 hover:text-red-600 transition-all duration-300 z-20"
            @click="removeFromWishlist(product)"
            title="Remove from wishlist"
          >
            <i class="ph ph-heart text-base"></i>
          </button>
        </div>

        <!-- Compact Info -->
        <div class="p-3 flex flex-col flex-grow">
          <!-- Name -->
          <h6 class="text-sm font-semibold mb-1 line-clamp-2 min-h-[2.5rem] hover:text-main-600 transition-colors">
            <NuxtLink :to="getProductLink(product)">
              {{ getProductName(product) }}
            </NuxtLink>
          </h6>

          <!-- Price - Very compact -->
          <div class="flex items-center gap-2 mb-2">
            <span class="text-lg font-bold text-gray-900">
              ₹{{ formatPrice(getDiscountedPrice(product)) }}
            </span>
            <span
              v-if="getDiscountValue(product) > 0"
              class="text-xs text-gray-400 line-through"
            >
              ₹{{ formatPrice(getOriginalPrice(product)) }}
            </span>
          </div>

          <!-- Quick Add to Cart -->
          <button
            type="button"
            class="w-full py-2 px-3 bg-main-600 text-white text-sm font-medium rounded-lg hover:bg-main-700 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed"
            @click="openAddToCartModal(product)"
            :disabled="getProductStock(product) <= 0"
          >
            <i class="ph ph-shopping-cart text-base"></i>
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
        <!-- Sidebar Actions -->
        <div class="col-12">
          <div class="border border-gray-100 rounded-12 p-32 mt-32 bg-gray-50">
            <div class="row g-4">
              <div class="col-md-6">
                <!-- <button
                  type="button"
                  class="btn btn-outline-main border-2 w-100 py-16 rounded-12 flex-align justify-content-center gap-12 hover:bg-main-600 hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  @click="openBulkAddModal"
                  :disabled="!hasInStockItems"
                >
                  <i class="ph ph-shopping-cart"></i>
                  Add All to Cart
                </button> -->
              </div>
              <div class="col-md-6">
          <button
  type="button"
  class="btn bg-danger-50 text-danger-700 border border-danger-200
         w-100 py-14 rounded-12 flex-align justify-content-center gap-10
         hover:bg-danger-100 transition-all duration-300"
  @click="clearWishlist"
>
  <i class="ph ph-trash text-lg"></i>
  <span class="fw-semibold">Clear Wishlist</span>
</button>

              </div>
            </div>
           
            <!-- Cart Summary -->
            <div v-if="cartSummary && cartSummary.itemCount > 0" class="mt-24 pt-24 border-t border-gray-200">
              <div class="flex-between mb-8">
                <span class="text-sm text-gray-600">Your cart has:</span>
                <span class="text-sm font-semibold">{{ cartSummary.itemCount }} items</span>
              </div>
              <div class="flex-between">
                <span class="text-sm text-gray-600">Total:</span>
                <span class="text-lg font-bold text-main-600">₹{{ formatPrice(cartSummary.totalPrice) }}</span>
              </div>
              <NuxtLink to="/cart" class="btn btn-main w-100 mt-16">
                <i class="ph ph-shopping-cart me-8"></i> View Cart
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
 
  <!-- Add to Cart Modal -->
  <div v-if="showAddToCartModal" class="modal-overlay" @click.self="closeAddToCartModal">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Add to Cart - {{ selectedProductName }}</h5>
        <button @click="closeAddToCartModal" class="close-btn">&times;</button>
      </div>
     
      <div class="modal-body">
        <!-- Product Info with Main Image -->
        <div class="product-info mb-24">
          <div class="flex items-start gap-16">
            <div class="flex-shrink-0">
              <!-- Main Product Image - Changes based on selected color -->
              <div class="main-image-container mb-16">
                <img
                  :src="getCurrentMainImage()"
                  :alt="selectedProductName"
                  class="w-80 h-80 object-cover rounded-xl shadow-lg border border-gray-200 transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                />
               
                <!-- Image Navigation if multiple images available -->
                <div v-if="selectedVariantImages.length > 1" class="flex gap-8 mt-12 justify-center">
                  <button
                    v-for="(img, index) in selectedVariantImages.slice(0, 4)"
                    :key="index"
                    @click="setActiveImageIndex(index)"
                    :class="[
                      'w-12 h-12 rounded-lg overflow-hidden border-2 transition-all duration-300 hover:shadow-md',
                      activeImageIndex === index ? 'border-main-600 scale-110 shadow-md' : 'border-gray-300 hover:border-gray-400'
                    ]"
                  >
                    <img
                      :src="img"
                      :alt="`Image ${index + 1}`"
                      class="w-full h-full object-cover"
                    />
                  </button>
                </div>
              </div>
            </div>
            <div class="flex-1">
              <h6 class="text-lg font-semibold mb-8 leading-tight">{{ selectedProductName }}</h6>
              <div class="flex items-center gap-8 mb-8">
                <span class="text-xl font-bold text-main-600">
                  ₹{{ formatPrice(getDiscountedPrice(selectedProduct)) }}
                </span>
                <span
                  v-if="getDiscountValue(selectedProduct) > 0"
                  class="text-sm text-gray-500 line-through"
                >
                  ₹{{ formatPrice(getOriginalPrice(selectedProduct)) }}
                </span>
                <span
                  v-if="getDiscountValue(selectedProduct) > 0"
                  class="text-xs text-success-600 font-medium bg-success-50 px-12 py-4 rounded-full"
                >
                  Save {{ getDiscountValue(selectedProduct) }}%
                </span>
              </div>
              <div class="flex items-center gap-16 text-sm mb-8">
                <span class="text-gray-600">Stock: </span>
                <span :class="{
                  'text-success-600 font-medium': selectedProductStock > 0,
                  'text-danger-600 font-medium': selectedProductStock <= 0
                }">
                  {{ selectedProductStock > 0 ? `${selectedProductStock} available` : 'Out of stock' }}
                </span>
              </div>
             
              <!-- Selected Variant Display -->
              <div v-if="selectedColor || selectedSize" class="flex flex-wrap gap-8 mt-8">
                <span v-if="selectedColor" class="badge bg-blue-100 text-blue-800 border border-blue-200 px-12 py-4 rounded-full text-xs">
                  <i class="ph ph-palette me-2"></i>{{ selectedColor }}
                </span>
                <span v-if="selectedSize" class="badge bg-green-100 text-green-800 border border-green-200 px-12 py-4 rounded-full text-xs">
                  <i class="ph ph-ruler me-2"></i>{{ selectedSize }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <!-- Color Selection -->
        <div v-if="availableColors.length > 0" class="mb-24">
          <div class="flex-between mb-12">
            <h6 class="text-sm font-semibold">Select Color:</h6>
            <span class="text-xs text-gray-500">{{ selectedColor || 'Any' }}</span>
          </div>
          <div class="flex flex-wrap gap-12">
            <div
              v-for="color in availableColors"
              :key="color"
              @click="selectColor(color)"
              :class="[
                'color-option w-48 h-48 rounded-xl border-2 cursor-pointer transition-all duration-400 overflow-hidden relative group shadow-sm hover:shadow-md',
                selectedColor === color
                  ? 'border-main-600 scale-110 ring-2 ring-main-600/20'
                  : 'border-gray-300 hover:border-gray-400 hover:scale-105'
              ]"
              :title="color"
            >
              <!-- Show color image if available -->
              <div
                v-if="getColorImage(color)"
                class="w-full h-full"
              >
                <img
                  :src="getColorImage(color)"
                  :alt="color"
                  class="w-full h-full object-cover transition-transform duration-400 group-hover:scale-110"
                />
              </div>
              <div
                v-else
                class="w-full h-full flex items-center justify-center"
                :style="{ backgroundColor: getColorHex(color) }"
              >
                <span class="text-xs font-medium text-white">{{ color.charAt(0).toUpperCase() + color.slice(1) }}</span>
              </div>
             
              <!-- Check mark for selected color -->
              <div v-if="selectedColor === color" class="absolute top-2 right-2 bg-main-600 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                <i class="ph-fill ph-check text-sm"></i>
              </div>
             
              <!-- Color name on hover -->
              <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs py-2 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {{ color }}
              </div>
            </div>
          </div>
        </div>
        <!-- Size Selection -->
        <div v-if="availableSizes.length > 0" class="mb-24">
          <div class="flex-between mb-12">
            <h6 class="text-sm font-semibold">Select Size:</h6>
            <span class="text-xs text-gray-500">{{ selectedSize || 'Any' }}</span>
          </div>
          <div class="flex flex-wrap gap-12">
            <div
              v-for="size in availableSizes"
              :key="size"
              @click="selectSize(size)"
              :class="[
                'size-option px-20 py-12 rounded-xl border cursor-pointer transition-all duration-400 text-center min-w-60 group shadow-sm hover:shadow-md',
                selectedSize === size
                  ? 'bg-main-600 text-white border-main-600 scale-105 ring-1 ring-main-600/20'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:scale-105'
              ]"
              :title="size"
            >
              <span class="text-sm fw-medium">{{ size }}</span>
             
              <!-- Size guide info on hover -->
              <div v-if="getSizeGuide(size)" class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs py-2 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10 shadow-lg">
                {{ getSizeGuide(size) }}
                <div class="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          </div>
        </div>
        <!-- Quantity Selection - ALWAYS VISIBLE AND ENABLED IF STOCK > 0 -->
        <div class="mb-24">
          <div class="flex-between mb-12">
            <h6 class="text-sm font-semibold">Quantity:</h6>
            <div class="flex items-center gap-8">
              <span class="text-xs text-gray-500">Max: {{ getMaxQuantity() }}</span>
              <button
                type="button"
                @click="quantity = getMaxQuantity()"
                class="text-xs text-main-600 hover:text-main-800 font-medium underline transition-colors duration-200"
                v-if="getMaxQuantity() > 1"
              >
                Set to max
              </button>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <div class="border border-gray-200 rounded-full py-8 px-16 flex items-center bg-white shadow-sm">
              <button
                type="button"
                @click="decreaseQuantity"
                class="quantity__minus w-32 h-32 flex-center rounded-full hover:bg-gray-50 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                :disabled="quantity <= 1 || selectedProductStock <= 0"
              >
                <i class="ph ph-minus text-lg" :class="quantity <= 1 ? 'text-gray-400' : 'text-gray-700'"></i>
              </button>
              <input
                type="number"
                v-model.number="quantity"
                class="quantity__input border-0 text-center w-48 fw-bold text-gray-900 bg-transparent focus:outline-none focus:ring-2 focus:ring-main-500 focus:ring-opacity-30 rounded"
                :max="getMaxQuantity()"
                min="1"
                @input="validateQuantity"
                @focus="$event.target.select()"
                :disabled="selectedProductStock <= 0"
              />
              <button
                type="button"
                @click="increaseQuantity"
                class="quantity__plus w-32 h-32 flex-center rounded-full hover:bg-gray-50 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                :disabled="quantity >= getMaxQuantity() || selectedProductStock <= 0"
              >
                <i class="ph ph-plus text-lg" :class="quantity >= getMaxQuantity() ? 'text-gray-400' : 'text-gray-700'"></i>
              </button>
            </div>
           
            <!-- Stock Progress Bar -->
            <div class="w-48">
              <div class="text-xs text-gray-600 mb-2 text-center">Stock</div>
              <div class="progress h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  class="progress-bar h-full bg-gradient-to-r from-success-500 to-emerald-500 transition-all duration-700"
                  :style="{ width: getStockPercentage() + '%' }"
                ></div>
              </div>
              <div class="text-xs text-gray-700 text-center mt-1">
                {{ selectedVariantStock ?? selectedProductStock }} / {{ getMaxQuantity() }}
              </div>
            </div>
          </div>
         
          <!-- Quantity Quick Select -->
          <div v-if="selectedProductStock > 5" class="flex flex-wrap gap-8 mt-12 justify-center">
            <button
              v-for="qty in [1, 2, 3, 5, 10]"
              :key="qty"
              @click="quantity = Math.min(qty, getMaxQuantity())"
              :class="[
                'px-16 py-8 rounded-xl text-sm font-medium transition-all duration-300 shadow-sm',
                quantity === qty
                  ? 'bg-main-600 text-white shadow-md hover:shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
              ]"
              :disabled="qty > getMaxQuantity()"
            >
              {{ qty }}
            </button>
          </div>
        </div>
        <!-- Selected Variant Details -->
        <div v-if="selectedVariant || selectedColor || selectedSize" class="mb-24 p-16 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 shadow-sm">
          <h6 class="text-sm font-semibold mb-8 text-gray-700 flex items-center gap-8">
            <i class="ph ph-package text-main-600"></i>
            Selected Variant Details
          </h6>
          <div class="grid grid-cols-2 gap-16">
            <div class="space-y-8">
              <div v-if="selectedColor" class="flex items-center gap-8">
                <div class="w-6 h-6 rounded-full border border-gray-300" :style="{ backgroundColor: getColorHex(selectedColor) }"></div>
                <div>
                  <div class="text-xs text-gray-500">Color</div>
                  <div class="text-sm font-medium text-gray-800">{{ selectedColor }}</div>
                </div>
              </div>
             
              <div v-if="selectedSize" class="flex items-center gap-8">
                <i class="ph ph-ruler text-gray-500"></i>
                <div>
                  <div class="text-xs text-gray-500">Size</div>
                  <div class="text-sm font-medium text-gray-800">{{ selectedSize }}</div>
                </div>
              </div>
            </div>
           
            <div class="space-y-8">
              <div class="flex items-center gap-8">
                <i class="ph ph-barcode text-gray-500"></i>
                <div>
                  <div class="text-xs text-gray-500">SKU</div>
                  <div class="text-sm font-medium text-gray-800">{{ selectedVariant?.sku || selectedProduct?.mainProduct?.sku }}</div>
                </div>
              </div>
             
              <div class="flex items-center gap-8">
                <i class="ph ph-warehouse text-gray-500"></i>
                <div>
                  <div class="text-xs text-gray-500">Stock</div>
                  <div :class="[
                    'text-sm font-medium',
                    (selectedVariantStock ?? selectedProductStock) > 0 ? 'text-success-600' : 'text-danger-600'
                  ]">
                    {{ (selectedVariantStock ?? selectedProductStock) > 0 ? `${selectedVariantStock ?? selectedProductStock} available` : 'Out of stock' }}
                  </div>
                </div>
              </div>
            </div>
          </div>
         
          <!-- Price Summary -->
          <div class="mt-16 pt-16 border-t border-gray-200">
            <div class="flex justify-between items-center">
              <div>
                <div class="text-xs text-gray-500">Unit Price</div>
                <div class="text-lg font-bold text-main-600">
                  ₹{{ formatPrice(selectedVariantPrice || getDiscountedPrice(selectedProduct)) }}
                </div>
              </div>
              <div class="text-right">
                <div class="text-xs text-gray-500">Total ({{ quantity }} items)</div>
                <div class="text-xl font-bold text-gray-900">
                  ₹{{ formatPrice(getTotalPrice()) }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Error/Success Messages -->
        <div v-if="errorMessage" class="mb-16">
          <div class="alert alert-danger p-12 rounded-xl border border-red-200 bg-red-50">
            <div class="flex items-center gap-8">
              <i class="ph ph-warning-circle text-red-600"></i>
              <span class="text-red-700 text-sm">{{ errorMessage }}</span>
            </div>
          </div>
        </div>
        <div v-if="successMessage" class="mb-16">
          <div class="alert alert-success p-12 rounded-xl border border-green-200 bg-green-50">
            <div class="flex items-center gap-8">
              <i class="ph ph-check-circle text-green-600"></i>
              <span class="text-green-700 text-sm">{{ successMessage }}</span>
            </div>
          </div>
        </div>
        <!-- Actions -->
        <div class="flex gap-16">
          <button
            @click="confirmAddToCart"
            :class="[
              'btn flex-1 py-12 rounded-xl font-semibold transition-all duration-400 flex items-center justify-center gap-8 shadow-sm hover:shadow-lg active:scale-95',
              selectedProductStock > 0 ? 'btn-main hover:bg-main-700' : 'btn-secondary cursor-not-allowed opacity-50'
            ]"
            :disabled="selectedProductStock <= 0"
          >
            <i class="ph ph-shopping-cart"></i>
            Add to Cart (₹{{ formatPrice(getTotalPrice()) }})
          </button>
          <button
            @click="closeAddToCartModal"
            class="btn btn-outline-main border-2 py-12 px-24 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
          >
            Cancel
          </button>
        </div>
       
        <!-- Quick Actions -->
        <div class="flex gap-8 mt-16">
          <button
            @click="addToWishlist"
            :class="[
              'btn btn-outline-gray border border-gray-300 py-8 px-16 rounded-xl text-sm flex-1 hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-8 shadow-sm',
              isInWishlist(selectedProduct) ? 'text-danger-600 hover:text-danger-700' : ''
            ]"
          >
            <i class="ph" :class="isInWishlist(selectedProduct) ? 'ph-heart-fill' : 'ph-heart'"></i>
            {{ isInWishlist(selectedProduct) ? 'In Wishlist' : 'Add to Wishlist' }}
          </button>
          <NuxtLink
            :to="getProductLink(selectedProduct)"
            class="btn btn-outline-gray border border-gray-300 py-8 px-16 rounded-xl text-sm flex-1 hover:bg-gray-50 transition-all duration-300 text-center flex items-center justify-center gap-8 shadow-sm"
            @click="closeAddToCartModal"
          >
            <i class="ph ph-eye"></i>
            View Details
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
 
  <!-- Bulk Add Modal -->
  <div v-if="showBulkAddModal" class="modal-overlay" @click.self="closeBulkAddModal">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Add All to Cart</h5>
        <button @click="closeBulkAddModal" class="close-btn">&times;</button>
      </div>
     
      <div class="modal-body">
        <p class="text-gray-700 mb-24">
          You are about to add {{ inStockProducts.length }} products to your cart.
          Please select options for products with variants:
        </p>
        <div class="space-y-4 max-h-300 overflow-y-auto pr-2">
          <div
            v-for="product in productsWithVariants"
            :key="getProductId(product)"
            class="border border-gray-200 rounded-xl p-16 shadow-sm"
          >
            <div class="flex items-start gap-12 mb-12">
              <img
                :src="getProductImage(product)"
                :alt="getProductName(product)"
                class="w-60 h-60 object-cover rounded-lg"
              />
              <div class="flex-1">
                <h6 class="text-sm font-semibold mb-2">{{ getProductName(product) }}</h6>
                <div class="flex items-center gap-8">
                  <span class="text-sm font-bold text-main-600">
                    ₹{{ formatPrice(getDiscountedPrice(product)) }}
                  </span>
                  <span class="text-xs text-gray-600">
                    Stock: {{ getProductStock(product) }}
                  </span>
                </div>
              </div>
            </div>
            <!-- Color Selection for Bulk Add -->
            <div v-if="getAvailableColors(product).length > 0" class="mb-8">
              <label class="text-xs text-gray-600 mb-4 block">Color:</label>
              <select
                v-model="bulkSelections[getProductId(product)].color"
                class="w-full border border-gray-300 rounded-xl py-8 px-12 text-sm focus:ring-2 focus:ring-main-500 focus:ring-opacity-20 focus:border-main-600 transition-all duration-200"
              >
                <option value="">Select Color</option>
                <option v-for="color in getAvailableColors(product)" :key="color" :value="color">
                  {{ color }}
                </option>
              </select>
            </div>
            <!-- Size Selection for Bulk Add -->
            <div v-if="getAvailableSizes(product).length > 0">
              <label class="text-xs text-gray-600 mb-4 block">Size:</label>
              <select
                v-model="bulkSelections[getProductId(product)].size"
                class="w-full border border-gray-300 rounded-xl py-8 px-12 text-sm focus:ring-2 focus:ring-main-500 focus:ring-opacity-20 focus:border-main-600 transition-all duration-200"
              >
                <option value="">Select Size</option>
                <option v-for="size in getAvailableSizes(product)" :key="size" :value="size">
                  {{ size }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <div class="mt-24 pt-24 border-t border-gray-200">
          <div class="flex gap-16">
            <button
              @click="confirmBulkAddToCart"
              class="btn btn-main flex-1 py-12 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
            >
              <i class="ph ph-shopping-cart me-8"></i>
              Add All to Cart
            </button>
            <button
              @click="closeBulkAddModal"
              class="btn btn-outline-main border-2 py-12 px-24 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
 
  <WishlistShop/>
</template>
<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useProductStore } from '../../store/useProductStore'
import { useWishlistStore } from '../../store/useWishlistStore'
import { toKebabCase } from "../../utlis/toKebabCase"
import { encodeId } from "../../utlis/encode"
import WishlistBreakcrumb from '../../components/WishlistBreakcrumb.vue'
import WishlistShop from '../../components/WishlistShop.vue'
import Swal from 'sweetalert2'

useHead({
  title: "My Wishlist"
})
// Pinia Stores
const productStore = useProductStore()
const wishlistStore = useWishlistStore()
// Refs
const loading = ref(false)
// Add to Cart Modal State
const showAddToCartModal = ref(false)
const showBulkAddModal = ref(false)
const selectedProduct = ref(null)
const selectedProductName = ref('')
const selectedProductStock = ref(0)
const selectedColor = ref('')
const selectedSize = ref('')
const selectedVariant = ref(null)
const selectedVariantPrice = ref(0)
const selectedVariantStock = ref(0)
const selectedVariantImages = ref([]) // Images of selected variant
const activeImageIndex = ref(0) // Current image index
const quantity = ref(1)
const errorMessage = ref('')
const successMessage = ref('')
const bulkSelections = ref({})
// Computed properties
const hasInStockItems = computed(() => {
  return wishlistStore.items.some(product => getProductStock(product) > 0)
})
const inStockProducts = computed(() => {
  return wishlistStore.items.filter(product => getProductStock(product) > 0)
})
const productsWithVariants = computed(() => {
  return inStockProducts.value.filter(product => hasVariants(product))
})
const availableColors = computed(() => {
  if (!selectedProduct.value) return []
  return getAvailableColors(selectedProduct.value)
})
const availableSizes = computed(() => {
  if (!selectedProduct.value) return []
  return getAvailableSizes(selectedProduct.value)
})
const canAddToCart = computed(() => {
  // Simplified: Always allow if stock > 0, even without variant selection (use main product)
  return selectedProductStock.value > 0
})
const cartSummary = computed(() => {
  try {
    const cartData = localStorage.getItem('shopping_cart')
    if (!cartData) return { itemCount: 0, totalPrice: 0 }
   
    const cart = JSON.parse(cartData)
    const itemCount = cart.reduce((total, item) => total + item.quantity, 0)
    const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0)
   
    return { itemCount, totalPrice }
  } catch (error) {
    console.error('Error calculating cart summary:', error)
    return { itemCount: 0, totalPrice: 0 }
  }
})
// Helper functions from product store
const getProductName = (product) => productStore.getProductName(product)
const getProductImage = (product) => {
  const image = productStore.getProductImage(product)
  return image || '/assets/images/placeholder-product.jpg'
}
const getDiscountedPrice = (product) => {
  // Always use discounted price for cart
  return productStore.getDiscountedPrice(product)
}
const getOriginalPrice = (product) => productStore.getOriginalPrice(product)
const getProductStock = (product) => productStore.getProductStock(product)
const getProductCategory = (product) => productStore.getProductCategory(product)
const getProductId = (product) => productStore.getProductId(product)
const getProductRating = (product) => productStore.getProductRating(product) || 4.5
const getReviewCount = (product) => productStore.getReviewCount(product) || 0
const getColorHex = (color) => productStore.getColorHex(color)
const getProductDescription = (product) => {
return productStore.getDescription(product) || 'No description available'
}
const getDiscountValue = (product) => {
  return product?.mainProduct?.discountValue || 0
}
const getProductAlertThreshold = (product) => {
  return product?.mainProduct?.quantityAlertThreshold || 5
}
const formatPrice = (price) => {
  if (!price && price !== 0) return '0'
  return Number(price).toLocaleString('en-IN')
}
const getPrimaryImage = (product) => {
  return getProductImage(product)
}
const getProductLink = (product) => {
  const productName = toKebabCase(getProductName(product))
  const productId = product.groupId || getProductId(product)
 
  let url = `/product/${productName}--${productId}`
 
  // Add color query param if available
  const colors = getAvailableColors(product)
  if (colors.length > 0) {
    url += `?color=${encodeURIComponent(colors[0])}`
  }
 
  return url
}
const truncateDescription = (description, length = 60) => {
  if (!description) return 'No description available'
  return description.length > length
    ? description.substring(0, length) + '...'
    : description
}
const getTotalPrice = () => {
  if (!selectedProduct.value) return 0
  const price = selectedVariantPrice.value || getDiscountedPrice(selectedProduct.value)
  return price * quantity.value
}
// Image functions
const getCurrentMainImage = () => {
  if (selectedVariantImages.value.length > 0 && activeImageIndex.value < selectedVariantImages.value.length) {
    return selectedVariantImages.value[activeImageIndex.value]
  }
  return getProductImage(selectedProduct.value)
}
const setActiveImageIndex = (index) => {
  activeImageIndex.value = index
}
// Variant functions
const hasVariants = (product) => {
  const colors = getAvailableColors(product)
  const sizes = getAvailableSizes(product)
  return colors.length > 0 || sizes.length > 0
}
const getAvailableColors = (product) => {
  if (!product?.variants || !Array.isArray(product.variants)) return []
  const colors = product.variants
    .map(v => v?.attributes?.[0]?.color)
    .filter(Boolean)
  return [...new Set(colors)]
}
const getAvailableSizes = (product) => {
  if (!product?.variants || !Array.isArray(product.variants)) return []
  const sizes = product.variants
    .map(v => v?.attributes?.[0]?.size)
    .filter(Boolean)
  return [...new Set(sizes)]
}
const getColorImage = (color) => {
  if (!selectedProduct.value?.variants) return null
 
  // Find variant with this color to get its image
  const variant = selectedProduct.value.variants.find(v =>
    v?.attributes?.[0]?.color === color && v.images?.length > 0
  )
 
  if (variant?.images?.[0]?.imageUrl) {
    return variant.images[0].imageUrl
  }
 
  // If no variant image, try to get from main product
  return getProductImage(selectedProduct.value)
}
const getVariantImages = (color, size) => {
  if (!selectedProduct.value?.variants) return []
 
  // Find variant matching color and size
  const variant = selectedProduct.value.variants.find(v => {
    const variantColor = v?.attributes?.[0]?.color
    const variantSize = v?.attributes?.[0]?.size
   
    const colorMatch = !color || variantColor === color
    const sizeMatch = !size || variantSize === size
   
    return colorMatch && sizeMatch
  })
 
  if (variant?.images?.length > 0) {
    return variant.images.map(img => img.imageUrl).filter(Boolean)
  }
 
  // Fallback to main product images
  return selectedProduct.value.mainProduct?.images?.map(img => img.imageUrl).filter(Boolean) || []
}
const getSizeGuide = (size) => {
  const sizeGuide = {
    'XS': 'Extra Small - Fits chest 32-34"',
    'S': 'Small - Fits chest 34-36"',
    'M': 'Medium - Fits chest 38-40"',
    'L': 'Large - Fits chest 40-42"',
    'XL': 'Extra Large - Fits chest 42-44"',
    'XXL': '2XL - Fits chest 44-46"',
    'XXXL': '3XL - Fits chest 46-48"'
  }
  return sizeGuide[size] || ''
}
const getStockPercentage = () => {
  const stock = selectedVariantStock.value ?? selectedProductStock.value
  const maxStock = selectedProduct.value?.mainProduct?.maxStock || 100
  return Math.min((stock / maxStock) * 100, 100)
}
const findMatchingVariant = () => {
  if (!selectedProduct.value?.variants) return null
 
  return selectedProduct.value.variants.find(variant => {
    const variantColor = variant?.attributes?.[0]?.color
    const variantSize = variant?.attributes?.[0]?.size
   
    const colorMatch = !selectedColor.value || variantColor === selectedColor.value
    const sizeMatch = !selectedSize.value || variantSize === selectedSize.value
   
    return colorMatch && sizeMatch
  })
}
const getMaxQuantity = () => {
  return selectedVariant.value?.stock ?? selectedProductStock.value
}
const isInWishlist = (product) => {
  if (!product) return false
  return wishlistStore.items.some(item =>
    item.groupId === product.groupId ||
    item.mainProduct?.id === product.mainProduct?.id
  )
}
// Modal functions
const openAddToCartModal = (product) => {
  selectedProduct.value = product
  selectedProductName.value = getProductName(product)
  selectedProductStock.value = getProductStock(product)
 
  // Reset selections
  selectedColor.value = ''
  selectedSize.value = ''
  selectedVariant.value = null
  selectedVariantImages.value = []
  activeImageIndex.value = 0
  quantity.value = 1
  errorMessage.value = ''
  successMessage.value = ''
 
  // Get initial images
  selectedVariantImages.value = getVariantImages('', '')
 
  showAddToCartModal.value = true
}
const closeAddToCartModal = () => {
  showAddToCartModal.value = false
  setTimeout(() => {
    selectedProduct.value = null
    selectedColor.value = ''
    selectedSize.value = ''
    selectedVariant.value = null
    quantity.value = 1
    errorMessage.value = ''
    successMessage.value = ''
  }, 300)
}
const openBulkAddModal = () => {
  // Initialize bulk selections
  bulkSelections.value = {}
  productsWithVariants.value.forEach(product => {
    const productId = getProductId(product)
    bulkSelections.value[productId] = {
      color: '',
      size: ''
    }
  })
  showBulkAddModal.value = true
}
const closeBulkAddModal = () => {
  showBulkAddModal.value = false
}
// Selection functions
const selectColor = (color) => {
  selectedColor.value = color
 
  // Update selected variant
  updateSelectedVariant()
 
  // Update images based on selected color
  selectedVariantImages.value = getVariantImages(color, selectedSize.value)
  activeImageIndex.value = 0 // Reset to first image
}
const selectSize = (size) => {
  selectedSize.value = size
 
  // Update selected variant
  updateSelectedVariant()
 
  // Update images based on selected size
  selectedVariantImages.value = getVariantImages(selectedColor.value, size)
  activeImageIndex.value = 0 // Reset to first image
}
const updateSelectedVariant = () => {
  if (!selectedProduct.value) return
 
  selectedVariant.value = findMatchingVariant()
  if (selectedVariant.value) {
    // Always use discounted price
    selectedVariantPrice.value = getDiscountedPrice(selectedProduct.value)
    selectedVariantStock.value = selectedVariant.value.stock ?? selectedProductStock.value
   
    // Reset quantity if exceeds stock
    if (quantity.value > selectedVariantStock.value) {
      quantity.value = selectedVariantStock.value
    }
   
    // Update images for the selected variant
    selectedVariantImages.value = getVariantImages(selectedColor.value, selectedSize.value)
  } else {
    selectedVariantPrice.value = getDiscountedPrice(selectedProduct.value)
    selectedVariantStock.value = selectedProductStock.value
   
    // If no variant selected, show all images
    selectedVariantImages.value = getVariantImages('', '')
  }
}
// Quantity functions - ALWAYS ENABLED IF STOCK > 0, REGARDLESS OF SELECTION
const decreaseQuantity = () => {
  if (quantity.value > 1 && selectedProductStock.value > 0) {
    quantity.value--
  }
}
const increaseQuantity = () => {
  const maxQty = getMaxQuantity()
  if (quantity.value < maxQty && selectedProductStock.value > 0) {
    quantity.value++
  }
}
const validateQuantity = () => {
  if (quantity.value < 1) {
    quantity.value = 1
  } 
  const maxQty = getMaxQuantity()
  if (quantity.value > maxQty) {
    quantity.value = maxQty
  } 
}  
// Watch for color/size changes
watch([selectedColor, selectedSize], () => {
  updateSelectedVariant()
})
// Add to Cart function
const addToCart = (product, variant = null, qty = 1, selectedColor = null, selectedSize = null) => {
  try {
    // Get existing cart or initialize
    const existingCart = localStorage.getItem('shopping_cart')
    let cart = existingCart ? JSON.parse(existingCart) : []
   
    // Use variant or main product
    const targetProduct = variant || product.mainProduct || product
   
    // Check if product already exists in cart with same variant
    const existingIndex = cart.findIndex(item => {
      const sameProduct = item.productId === targetProduct.id
      const sameVariant = item.variantId === (variant?.id || null)
      const sameColor = item.color === selectedColor
      const sameSize = item.size === selectedSize
     
      return sameProduct && sameVariant && sameColor && sameSize
    })
   
    // Always use discounted price
    const discountedPrice = getDiscountedPrice(product)
   
    if (existingIndex > -1) {
      // Update existing item quantity
      const newQuantity = cart[existingIndex].quantity + qty
      const maxQuantity = cart[existingIndex].maxStock ?? cart[existingIndex].stock
     
      if (newQuantity > maxQuantity) {
        return false // Cannot exceed stock
      }
     
      cart[existingIndex].quantity = newQuantity
      cart[existingIndex].totalPrice = cart[existingIndex].price * newQuantity
    } else {
      // Add new item
      const cartItem = {
        id: Date.now(),
        productId: targetProduct.id,
        variantId: variant?.id || null,
        name: getProductName(product),
        color: selectedColor,
        size: selectedSize,
        sku: targetProduct.sku || product.mainProduct?.sku,
        price: discountedPrice, // Discounted price saved
        quantity: qty,
        totalPrice: discountedPrice * qty,
        image: getCurrentMainImage(), // Current selected image
        stock: variant?.stock ?? getProductStock(product),
        maxStock: variant?.stock ?? getProductStock(product),
        groupId: product.groupId || product.id
      }
      cart.push(cartItem)
    }
   
    // Save to localStorage
    localStorage.setItem('shopping_cart', JSON.stringify(cart))
   
    // Dispatch cart update event
    window.dispatchEvent(new CustomEvent('cart-updated'))
   
    return true
  } catch (error) {
    console.error('Error adding to cart:', error)
    return false
  }
}
const confirmAddToCart = () => {
  if (!selectedProduct.value) return
 
  const success = addToCart(
    selectedProduct.value,
    selectedVariant.value,
    quantity.value,
    selectedColor.value,
    selectedSize.value
  )
 
  if (success) {
    successMessage.value = `✓ ${quantity.value} × ${selectedProductName.value} added to cart!`
   
    // Update cart count in UI
    updateCartCount()
   
    // Auto close after 2 seconds
    setTimeout(() => {
      if (successMessage.value) {
        closeAddToCartModal()
      }
    }, 500)
  } else {
    errorMessage.value = 'Failed to add product to cart. Stock might be insufficient.'
  }
}
const confirmBulkAddToCart = () => {
  let successCount = 0
  let failedCount = 0
 
  // Add all in-stock products
  inStockProducts.value.forEach(product => {
    const productId = getProductId(product)
    const selections = bulkSelections.value[productId] || {}
   
    // Find matching variant based on selections
    let variant = null
    if (selections.color || selections.size) {
      variant = product.variants?.find(v => {
        const variantColor = v?.attributes?.[0]?.color
        const variantSize = v?.attributes?.[0]?.size
       
        const colorMatch = !selections.color || variantColor === selections.color
        const sizeMatch = !selections.size || variantSize === selections.size
       
        return colorMatch && sizeMatch
      })
    }
   
    const success = addToCart(
      product,
      variant,
      1, // Default quantity 1 for bulk add
      selections.color,
      selections.size
    )
   
    if (success) {
      successCount++
    } else {
      failedCount++
    }
  })
 
  closeBulkAddModal()
                  
  if (successCount > 0) { 
    alert(`Successfully added ${successCount} products to cart!`)
  }
 
  if (failedCount > 0) {
    alert(`Failed to add ${failedCount} products to cart.`)
  }
}
// Update cart count function
const updateCartCount = () => {
  // This will trigger any cart count components to update
  const event = new CustomEvent('cart-count-updated')
  window.dispatchEvent(event)
}
// Wishlist actions
const removeFromWishlist = async (product) => {
  const result = await Swal.fire({
    title: 'Remove item?',
    text: 'This product will be removed from your wishlist.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, remove',
    cancelButtonText: 'Cancel',
    reverseButtons: true,
    buttonsStyling: false,
    customClass: {
      popup: 'rounded-16',
      confirmButton: 'swal-confirm-btn',
      cancelButton: 'swal-cancel-btn'
    }
  })

  if (result.isConfirmed) {
    const removed = wishlistStore.removeItem(product)

    if (removed) {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Removed from wishlist',
        showConfirmButton: false,
        timer: 1800,
        timerProgressBar: true
      })
    }
  }
}

const addToWishlist = () => {
  if (selectedProduct.value) {
    const added = wishlistStore.addItem(selectedProduct.value)
    if (added) {
      successMessage.value = 'Product added to wishlist!'
    }
  }
}
const clearWishlist = () => {
  const confirmClear = confirm('Are you sure you want to clear your entire wishlist?')
 
  if (confirmClear) {
    wishlistStore.clearAll()
    alert('Wishlist cleared!')
  }
}
// Lifecycle hooks
onMounted(() => {
  // Wishlist store automatically loads from localStorage
  console.log('Wishlist items:', wishlistStore.items)
})
</script>
<style scoped>
/* Modal Styles - Simplified and Smoother */
.swal-confirm-btn {
  background-color: #dc2626;
  color: #fff;
  padding: 10px 18px;
  border-radius: 10px;
  font-weight: 600;
}

.swal-confirm-btn:hover {
  background-color: #b91c1c;
}

.swal-cancel-btn {
  background-color: #f3f4f6;
  color: #111827;
  padding: 10px 18px;
  border-radius: 10px;
  font-weight: 500;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 16px;
  backdrop-filter: blur(4px);
  animation: fadeIn 0.3s ease-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.modal-content {
  background: white;
  border-radius: 16px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.2);
  animation: modalSlideIn 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
.modal-header {
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
  border-radius: 16px 16px 0 0;
}
.modal-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
}
.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6b7280;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}
.close-btn:hover {
  background: #f3f4f6;
  color: #374151;
}
.modal-body {
  padding: 20px;
}
/* Color Option Enhancements - Simpler */
.color-option {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}
.color-option:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}
/* Size Option Enhancements - Simpler */
.size-option {
  position: relative;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}
.size-option:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}
/* Quantity Input Styling */
.quantity__input {
  -moz-appearance: textfield;
}
.quantity__input::-webkit-outer-spin-button,
.quantity__input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.quantity__input:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}
/* Progress Bar - Smoother */
.progress {
  position: relative;
  overflow: hidden;
}
.progress-bar {
  position: relative;
  border-radius: 9999px;
}
.progress-bar::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.4) 50%,
    transparent 100%
  );
  animation: shimmer 1.5s infinite;
}
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
/* Main Image Container */
.main-image-container {
  position: relative;
}
.main-image-container img {
  transition: transform 0.4s ease;
}
/* Quick Select Buttons */
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
/* Responsive Adjustments */
@media (max-width: 640px) {
  .modal-content {
    max-width: 95%;
    margin: 8px;
    border-radius: 12px;
  }
 
  .color-option {
    width: 44px;
    height: 44px;
  }
 
  .size-option {
    min-width: 52px;
    padding: 8px 12px;
    font-size: 14px;
  }
 
  .grid.grid-cols-2 {
    grid-template-columns: 1fr;
    gap: 12px;
  }
 
  .modal-header {
    padding: 12px;
  }
 
  .modal-body {
    padding: 16px;
  }
}
/* Smooth transitions */
* {
  transition: background-color 0.3s ease, border-color 0.3s ease, transform 0.3s ease, opacity 0.3s ease;
}
/* Custom scrollbar for modal - Simpler */
.modal-content::-webkit-scrollbar {
  width: 6px;
}
.modal-content::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}
.modal-content::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}
.modal-content::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
/* Product Card Styles - Enhanced */
.wishlist-btn {
  z-index: 10;
  transition: all 0.4s ease;
}
.product-card {
  position: relative;
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  background: white;
}
.product-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
}
.text-line-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.badge {
  font-size: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.spinner-border {
  width: 3rem;
  height: 3rem;
}
/* Hover effects for product card */
.product-card__thumb img {
  transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.product-card:hover .product-card__thumb img {
  transform: scale(1.12);
}
/* Alert styles */
.alert {
  border-radius: 12px;
  padding: 12px 16px;
  margin-bottom: 16px;
}
.alert-success {
  background-color: #d1fae5;
  border-color: #10b981;
  color: #065f46;
}
.alert-danger {
  background-color: #fee2e2;
  border-color: #ef4444;
  color: #991b1b;
}
/* Bulk Add Modal */
.max-h-300 {
  max-height: 300px;
}
.max-h-300::-webkit-scrollbar {
  width: 6px;
}
.max-h-300::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}
.max-h-300::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}
.max-h-300::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
/* Rounded corners for better design */
.rounded-12 {
  border-radius: 12px;
}
.rounded-xl {
  border-radius: 12px;
}
</style>