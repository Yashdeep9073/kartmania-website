<template>
  <section class="checkout py-80">
    <div class="container container-lg">
      <!-- Coupon Banner -->
      <div class="border border-gray-100 rounded-8 px-30 py-20 mb-40">
        <span class="">
          Have a coupon? 
          <NuxtLink 
            to="/cart" 
            class="fw-semibold text-gray-900 hover-text-decoration-underline hover-text-main-600"
          >
            Click here to enter your code
          </NuxtLink>
        </span>
      </div>

      <!-- Empty Cart State -->
      <div v-if="cartItems.length === 0" class="text-center py-80">
        <div class="mb-32">
          <i class="ph ph-shopping-cart text-6xl text-gray-300"></i>
        </div>
        <h4 class="text-2xl fw-bold text-gray-800 mb-16">Your cart is empty</h4>
        <p class="text-gray-600 mb-32">Add some products to your cart to checkout</p>
        <NuxtLink to="/shop-all" class="btn btn-main py-16 px-32 rounded-8">
          <i class="ph ph-shopping-bag me-2"></i> Continue Shopping
        </NuxtLink>
      </div>

      <!-- Checkout Form (Show only if cart has items) -->
      <div v-else class="row">
        <!-- Checkout Form -->
        <div class="col-xl-9 col-lg-8">
          <form @submit.prevent="handleSubmit" class="pe-xl-5">
            <div class="row gy-3">
              <!-- Personal Information -->
              <div class="col-sm-6 col-xs-6">
                <input 
                  type="text" 
                  v-model="formData.firstName"
                  class="common-input border-gray-100" 
                  placeholder="First Name"
                  required
                />
                <div v-if="errors.firstName" class="text-danger-600 text-sm mt-1">
                  {{ errors.firstName }}
                </div>
              </div>
              <div class="col-sm-6 col-xs-6">
                <input 
                  type="text" 
                  v-model="formData.lastName"
                  class="common-input border-gray-100" 
                  placeholder="Last Name"
                  required
                />
                <div v-if="errors.lastName" class="text-danger-600 text-sm mt-1">
                  {{ errors.lastName }}
                </div>
              </div>
              <div class="col-12">
                <input 
                  type="text" 
                  v-model="formData.businessName"
                  class="common-input border-gray-100" 
                  placeholder="Business Name (Optional)"
                />
              </div>

              <!-- Address Information -->
              <div class="col-12">
                <select 
                  v-model="formData.country"
                  class="common-input border-gray-100" 
                  required
                >
                  <option value="">Select Country</option>
                  <option value="US">United States (US)</option>
                  <option value="CA">Canada</option>
                  <option value="UK">United Kingdom</option>
                  <option value="AU">Australia</option>
                  <option value="IN">India</option>
                </select>
              </div>
              <div class="col-12">
                <input 
                  type="text" 
                  v-model="formData.address1"
                  class="common-input border-gray-100" 
                  placeholder="House number and street name"
                  required
                />
                <div v-if="errors.address1" class="text-danger-600 text-sm mt-1">
                  {{ errors.address1 }}
                </div>
              </div>
              <div class="col-12">
                <input 
                  type="text" 
                  v-model="formData.address2"
                  class="common-input border-gray-100" 
                  placeholder="Apartment, suite, unit, etc. (Optional)"
                />
              </div>
              <div class="col-12">
                <input 
                  type="text" 
                  v-model="formData.city"
                  class="common-input border-gray-100" 
                  placeholder="City"
                  required
                />
                <div v-if="errors.city" class="text-danger-600 text-sm mt-1">
                  {{ errors.city }}
                </div>
              </div>
              <div class="col-12">
                <input 
                  type="text" 
                  v-model="formData.state"
                  class="common-input border-gray-100" 
                  placeholder="State / Province"
                  required
                />
                <div v-if="errors.state" class="text-danger-600 text-sm mt-1">
                  {{ errors.state }}
                </div>
              </div>
              <div class="col-12">
                <input 
                  type="text" 
                  v-model="formData.postCode"
                  class="common-input border-gray-100" 
                  placeholder="Post Code / ZIP"
                  required
                />
                <div v-if="errors.postCode" class="text-danger-600 text-sm mt-1">
                  {{ errors.postCode }}
                </div>
              </div>

              <!-- Contact Information -->
              <div class="col-12">
                <input 
                  type="tel" 
                  v-model="formData.phone"
                  class="common-input border-gray-100" 
                  placeholder="Phone"
                  required
                />
                <div v-if="errors.phone" class="text-danger-600 text-sm mt-1">
                  {{ errors.phone }}
                </div>
              </div>
              <div class="col-12">
                <input 
                  type="email" 
                  v-model="formData.email"
                  class="common-input border-gray-100" 
                  placeholder="Email Address"
                  required
                />
                <div v-if="errors.email" class="text-danger-600 text-sm mt-1">
                  {{ errors.email }}
                </div>
              </div>

              <!-- Additional Information -->
              <div class="col-12">
                <div class="my-40">
                  <h6 class="text-lg mb-24">Additional Information</h6>
                  <textarea 
                    v-model="formData.notes"
                    class="common-input border-gray-100 min-h-120"
                    placeholder="Notes about your order, e.g. special notes for delivery."
                    rows="4"
                  ></textarea>
                </div>
              </div>
            </div>
          </form>
        </div>

        <!-- Order Summary Sidebar -->
        <div class="col-xl-3 col-lg-4">
          <div class="checkout-sidebar">
            <!-- Order Header -->
            <div class="bg-color-three rounded-8 p-24 text-center">
              <span class="text-gray-900 text-xl fw-semibold">Your Orders</span>
            </div>

            <!-- Order Items -->
            <div class="border border-gray-100 rounded-8 px-24 py-40 mt-24">
              <div class="mb-32 pb-32 border-bottom border-gray-100 flex-between gap-8">
                <span class="text-gray-900 fw-medium text-xl font-heading-two">Product</span>
                <span class="text-gray-900 fw-medium text-xl font-heading-two">Subtotal</span>
              </div>

              <!-- Order Items List (From localStorage cart) -->
              <div 
                v-for="(item, index) in cartItems" 
                :key="item.id || index"
                class="flex-between gap-24 mb-32"
              >
                <div class="flex-align gap-12">
                  <span class="text-gray-900 fw-normal text-md font-heading-two w-144">
                    {{ item.name }}
                    <div v-if="item.color || item.size" class="variant-info flex-align gap-8 mt-1">
                      <span v-if="item.color" class="text-xs text-gray-500">
                        Color: {{ item.color }}
                      </span>
                      <span v-if="item.size" class="text-xs text-gray-500">
                        Size: {{ Array.isArray(item.size) ? item.size.join(', ') : item.size }}
                      </span>
                    </div>
                  </span>
                  <span class="text-gray-900 fw-normal text-md font-heading-two">
                    <i class="ph-bold ph-x"></i>
                  </span>
                  <span class="text-gray-900 fw-semibold text-md font-heading-two">
                    {{ item.quantity }}
                  </span>
                </div>
                <span class="text-gray-900 fw-bold text-md font-heading-two">
                  ₹{{ (item.price * item.quantity).toFixed(2) }}
                </span>
              </div>

              <!-- Order Totals -->
              <div class="border-top border-gray-100 pt-30 mt-30">
                <div class="mb-32 flex-between gap-8">
                  <span class="text-gray-900 font-heading-two text-xl fw-semibold">Subtotal</span>
                  <span class="text-gray-900 font-heading-two text-md fw-bold">
                    ₹{{ subtotal.toFixed(2) }}
                  </span>
                </div>
                <div class="mb-32 flex-between gap-8">
                  <span class="text-gray-900 font-heading-two text-xl fw-semibold">Shipping</span>
                  <span class="text-gray-900 font-heading-two text-md fw-bold">
                    {{ shippingCharge === 0 ? 'Free' : `₹${shippingCharge.toFixed(2)}` }}
                  </span>
                </div>
                <div class="mb-32 flex-between gap-8">
                  <span class="text-gray-900 font-heading-two text-xl fw-semibold">Tax</span>
                  <span class="text-gray-900 font-heading-two text-md fw-bold">
                    ₹{{ tax.toFixed(2) }}
                  </span>
                </div>
                <div class="mb-0 flex-between gap-8">
                  <span class="text-gray-900 font-heading-two text-xl fw-semibold">Total</span>
                  <span class="text-gray-900 font-heading-two text-md fw-bold">
                    ₹{{ total.toFixed(2) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Payment Methods -->
            <div class="mt-32">
              <div class="payment-item" v-for="method in paymentMethods" :key="method.id">
                <div class="form-check common-check common-radio py-16 mb-0">
                  <input 
                    class="form-check-input" 
                    type="radio" 
                    v-model="selectedPayment"
                    :value="method.id"
                    :id="`payment${method.id}`"
                  />
                  <label 
                    class="form-check-label fw-semibold text-neutral-600" 
                    :for="`payment${method.id}`"
                  >
                    {{ method.name }}
                  </label>
                </div>
                <div 
                  v-show="selectedPayment === method.id"
                  class="payment-item__content px-16 py-24 rounded-8 bg-main-50 position-relative"
                >   
                  <p class="text-gray-800">{{ method.description }}</p>
                </div>
              </div>
            </div>

            <!-- Privacy Policy -->
            <div class="mt-32 pt-32 border-top border-gray-100">
              <p class="text-gray-500">
                Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our 
                <NuxtLink to="/privacy-policy" class="text-main-600 text-decoration-underline">
                  privacy policy
                </NuxtLink>.
              </p>
            </div>

            <!-- Place Order Button -->
            <button 
              @click="placeOrder"
              :disabled="isSubmitting || !isFormValid"
              class="btn btn-main mt-40 py-18 w-100 rounded-8 mt-56"
              :class="{ 'disabled': isSubmitting || !isFormValid }"
            >
              <span v-if="isSubmitting">
                <i class="ph ph-circle-notch ph-spin"></i> Processing...
              </span>
              <span v-else>
                Place Order (₹{{ total.toFixed(2) }})
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, reactive, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Cart items from localStorage
const cartItems = ref([])

// Load cart from localStorage
const loadCartFromStorage = () => {
  try {
    const cartData = localStorage.getItem('shopping_cart')
    if (cartData) {
      cartItems.value = JSON.parse(cartData)
      console.log('Cart loaded in checkout:', cartItems.value)
    } else {
      cartItems.value = []
    }
  } catch (error) {
    console.error('Error loading cart:', error)
    cartItems.value = []
  }
}

// Form data
const formData = reactive({
  firstName: '',
  lastName: '',
  businessName: '',
  country: 'IN', // Default to India
  address1: '',
  address2: '',
  city: '',
  state: '',
  postCode: '',
  phone: '',
  email: '',
  notes: ''
})

// Form validation errors
const errors = reactive({})

// Payment methods
const paymentMethods = ref([
  {
    id: 1,
    name: 'Direct Bank Transfer',
    description: 'Make your payment directly into our bank account. Please use your Order ID as the payment reference. Your order will not be shipped until the funds have cleared in our account.'
  },
  {
    id: 2,
    name: 'UPI Payment',
    description: 'Pay using any UPI app like Google Pay, PhonePe, Paytm. Scan the QR code or enter UPI ID.'
  },
  {
    id: 3,
    name: 'Cash on Delivery',
    description: 'Pay with cash upon delivery. Additional fees may apply.'
  },
  {
    id: 4,
    name: 'Credit/Debit Card',
    description: 'Pay securely using your credit or debit card. We accept Visa, MasterCard, American Express.'
  }
])

const selectedPayment = ref(1) // Default to Direct Bank Transfer

// Form submission state
const isSubmitting = ref(false)

// Calculate order totals from cart items
const subtotal = computed(() => {
  if (cartItems.value.length === 0) return 0
  return cartItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
})

const shippingCharge = computed(() => {
  return subtotal.value > 500 ? 0 : 50 // Free shipping over ₹500
})

const tax = computed(() => {
  return subtotal.value * 0.18 // 18% GST
})

const total = computed(() => {
  return subtotal.value + shippingCharge.value + tax.value
})

// Form validation
const isFormValid = computed(() => {
  return (
    cartItems.value.length > 0 &&
    formData.firstName &&
    formData.lastName &&
    formData.country &&
    formData.address1 &&
    formData.city &&
    formData.state &&
    formData.postCode &&
    formData.phone &&
    formData.email
  )
})

// Validate form
const validateForm = () => {
  // Clear previous errors
  Object.keys(errors).forEach(key => delete errors[key])

  let isValid = true

  // Check if cart has items
  if (cartItems.value.length === 0) {
    alert('Your cart is empty. Please add items to cart before checkout.')
    router.push('/cart')
    return false
  }

  // Required fields validation
  if (!formData.firstName.trim()) {
    errors.firstName = 'First name is required'
    isValid = false
  }

  if (!formData.lastName.trim()) {
    errors.lastName = 'Last name is required'
    isValid = false
  }

  if (!formData.address1.trim()) {
    errors.address1 = 'Address is required'
    isValid = false
  }

  if (!formData.city.trim()) {
    errors.city = 'City is required'
    isValid = false
  }

  if (!formData.state.trim()) {
    errors.state = 'State is required'
    isValid = false
  }

  if (!formData.postCode.trim()) {
    errors.postCode = 'Postal code is required'
    isValid = false
  }

  // Phone validation
  if (!formData.phone.trim()) {
    errors.phone = 'Phone number is required'
    isValid = false
  } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\D/g, ''))) {
    errors.phone = 'Please enter a valid 10-digit phone number'
    isValid = false
  }

  // Email validation
  if (!formData.email.trim()) {
    errors.email = 'Email is required'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Please enter a valid email address'
    isValid = false
  }

  return isValid
}

// Handle form submission
const handleSubmit = () => {
  if (validateForm()) {
    placeOrder()
  }
}

// Clear cart after successful order
const clearCartAfterOrder = () => {
  localStorage.removeItem('shopping_cart')
  cartItems.value = []
}

// Place order function
const placeOrder = async () => {
  if (!validateForm()) {
    alert('Please fill in all required fields correctly.')
    return
  }

  isSubmitting.value = true

  try {
    // Prepare order data
    const orderData = {
      orderId: 'ORD' + Date.now(),
      customer: { ...formData },
      items: cartItems.value,
      paymentMethod: paymentMethods.value.find(m => m.id === selectedPayment.value)?.name,
      subtotal: subtotal.value,
      shipping: shippingCharge.value,
      tax: tax.value,
      total: total.value,
      notes: formData.notes,
      orderDate: new Date().toISOString(),
      status: 'pending'
    }

    // In a real app, you would send this to your backend API
    console.log('Order Data:', orderData)
    
    // Save order to localStorage for order history
    const existingOrders = JSON.parse(localStorage.getItem('order_history') || '[]')
    existingOrders.push(orderData)
    localStorage.setItem('order_history', JSON.stringify(existingOrders))
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Clear cart after successful order
    clearCartAfterOrder()
    
    // Redirect to order confirmation page with order details
    // router.push({
    //   path: '/order-confirmation',
    //   query: {
    //     orderId: orderData.orderId,
    //     total: orderData.total
    //   }
    // })
    
  } catch (error) {
    console.error('Error placing order:', error)
    alert('There was an error processing your order. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}

// Pre-fill form from localStorage or user session if available
const loadUserData = () => {
  const savedData = localStorage.getItem('checkoutFormData')
  if (savedData) {
    Object.assign(formData, JSON.parse(savedData))
  }
}

// Save form data to localStorage on change
Object.keys(formData).forEach(key => {
  watch(() => formData[key], () => {
    localStorage.setItem('checkoutFormData', JSON.stringify(formData))
  })
})

// Load cart on component mount
onMounted(() => {
  loadCartFromStorage()
  loadUserData()
  
  // Listen for storage changes (if cart is updated in another tab)
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', (event) => {
      if (event.key === 'shopping_cart') {
        console.log('Cart updated in another tab, reloading in checkout...')
        loadCartFromStorage()
      }
    })
  }
})

// Cleanup event listener
onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('storage', () => {})
  }
})
</script>

<style scoped>
/* Custom styles for checkout page */
.common-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.common-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.common-input.border-gray-100 {
  border-color: #f3f4f6;
}

.common-input.border-gray-100:focus {
  border-color: #3b82f6;
}

.min-h-120 {
  min-height: 120px;
}

/* Payment methods */
.payment-item {
  margin-bottom: 16px;
}

.payment-item__content {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Form check/radio styles */
.form-check.common-check.common-radio {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.form-check-input {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.form-check-label {
  cursor: pointer;
  user-select: none;
}

/* Button styles */
.btn-main {
  background-color: #3b82f6;
  color: white;
  border: none;
  font-weight: 600;
  transition: all 0.3s ease;
  cursor: pointer;
}

.btn-main:hover:not(:disabled) {
  background-color: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
}

.btn-main:disabled,
.btn-main.disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Error message styles */
.text-danger-600 {
  color: #dc2626;
}

/* Variant info styles */
.variant-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: #666;
}

/* Responsive adjustments */
@media (max-width: 1199px) {
  .pe-xl-5 {
    padding-right: 0;
  }
}

@media (max-width: 991px) {
  .col-xl-9,
  .col-lg-8,
  .col-xl-3,
  .col-lg-4 {
    width: 100%;
  }
  
  .checkout-sidebar {
    margin-top: 40px;
  }
}

@media (max-width: 767px) {
  .checkout {
    padding: 40px 0;
  }
  
  .border.border-gray-100.rounded-8.px-30.py-20.mb-40 {
    padding: 16px;
    margin-bottom: 30px;
  }
  
  .border.border-gray-100.rounded-8.px-24.py-40.mt-24 {
    padding: 20px;
  }
  
  .w-144 {
    width: 120px;
  }
  
  .flex-between.gap-24 {
    gap: 12px;
  }
}

/* Typography */
.text-lg {
  font-size: 18px;
}

.text-xl {
  font-size: 20px;
}

.text-md {
  font-size: 16px;
}

.text-sm {
  font-size: 14px;
}

.text-xs {
  font-size: 12px;
}

.fw-semibold {
  font-weight: 600;
}

.fw-bold {
  font-weight: 700;
}

.fw-normal {
  font-weight: 400;
}

.fw-medium {
  font-weight: 500;
}

/* Flex utilities */
.flex-align {
  display: flex;
  align-items: center;
}

.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Border radius */
.rounded-8 {
  border-radius: 8px;
}

/* Colors */
.text-gray-900 {
  color: #111827;
}

.text-gray-800 {
  color: #1f2937;
}

.text-gray-500 {
  color: #6b7280;
}

.text-gray-200 {
  color: #e5e7eb;
}

.text-neutral-600 {
  color: #525252;
}

.text-main-600 {
  color: #3b82f6;
}

.hover-text-main-600:hover {
  color: #3b82f6;
}

/* Links */
.text-decoration-underline {
  text-decoration: underline;
}

.hover-text-decoration-underline:hover {
  text-decoration: underline;
}
</style>