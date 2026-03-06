<template>
  <footer class="footer py-40">
    <div class="container container-lg">
      <div class="footer-item-wrapper d-flex align-items-start flex-wrap">
        <div class="footer-item" data-aos="fade-up" data-aos-duration="200">
       <div class="footer-item__logo">
  <NuxtLink to="/">
    <img :src="logoSrc" alt="239 The Business Developers">
  </NuxtLink>
</div>

<p class="mb-28 text-heading">
  239 The Business Developers
</p>

<div class="d-flex flex-column gap-8">
  <p class="text-heading fw-medium">
    Lower Ground Kh, 1273, Old Delhi Gurugram Rd, <br>opp. Fun N Food Village, Kapas Hera Extension,<br>Kapas Hera<br>
    New Delhi, Delhi, 110097
  </p>

  <a 
    href="mailto:info@vibrantick.org" 
    class="text-heading fw-medium hover-text-main-600"
  >
    info@vibrantick.org
  </a>

  <a 
    href="tel:+919549936342" 
    class="text-heading fw-medium hover-text-main-600"
  >
    +91 95499 36342
  </a>
</div>
</div> 
        
        <div class="footer-item" data-aos="fade-up" data-aos-duration="400">
          <h6 class="footer-item__title">Information</h6>
          <ul class="footer-menu">
            <li class="mb-16">
              <NuxtLink to="/seller/become-a-seller" class="text-heading hover-text-main-600">Become a Vendor</NuxtLink>
            </li>
            <li class="mb-16">
              <NuxtLink to="/account/profile" class="text-heading hover-text-main-600">Affiliate Program</NuxtLink>
            </li>
            <li class="mb-16">
              <NuxtLink to="/privacy" class="text-heading hover-text-main-600">Privacy Policy</NuxtLink>
            </li>
            <li class="mb-16">
              <NuxtLink to="/terms" class="text-heading hover-text-main-600">Terms of Use</NuxtLink>
            </li>
            <li class="mb-16">
              <NuxtLink to="/security" class="text-heading hover-text-main-600">Security</NuxtLink>
            </li>
          </ul>
        </div>
        <div class="footer-item" data-aos="fade-up" data-aos-duration="600">
          <h6 class="footer-item__title">Customer Support</h6>
          <ul class="footer-menu">
            <li class="mb-16">
              <NuxtLink to="/" class="text-heading hover-text-main-600">Help Center</NuxtLink>
            </li>
            <li class="mb-16">
              <NuxtLink to="/contact/contact" class="text-heading hover-text-main-600">Contact Us</NuxtLink>
            </li>
            <li class="mb-16">
              <NuxtLink to="/account/profile" class="text-heading hover-text-main-600">Report Abuse</NuxtLink>
            </li>
            <li class="mb-16">
              <NuxtLink to="/contact/contact" class="text-heading hover-text-main-600">Submit and Dispute</NuxtLink>
            </li>
            <li class="mb-16">
              <NuxtLink to="/grievance-redressal" class="text-heading hover-text-main-600">Grievance Redressal</NuxtLink>
            </li>
            <li class="mb-16">
              <NuxtLink to="/cancellation-returns" class="text-heading hover-text-main-600">Cancellation & Returns</NuxtLink>
            </li>
          </ul>
        </div>
        <div class="footer-item" data-aos="fade-up" data-aos-duration="800">
          <h6 class="footer-item__title">My Account</h6>
          <ul class="footer-menu">
            <li class="mb-16">
              <NuxtLink to="/account/profile" class="text-heading hover-text-main-600">My Account</NuxtLink>
            </li>
            <li class="mb-16">
              <NuxtLink to="/cart/checkout" class="text-heading hover-text-main-600">Order History</NuxtLink>
            </li>
            <li class="mb-16">
              <NuxtLink to="/cart/cart" class="text-heading hover-text-main-600">Shoping Cart</NuxtLink>
            </li>
            <li class="mb-16">
              <NuxtLink to="/shop-all" class="text-heading hover-text-main-600">Compare</NuxtLink>
            </li>
            <li class="mb-16">
              <NuxtLink to="/contact/contact" class="text-heading hover-text-main-600">Help Ticket</NuxtLink>
            </li>
            <li class="">
              <NuxtLink to="/account/wishlist" class="text-heading hover-text-main-600">Wishlist</NuxtLink>
            </li>
          </ul>
        </div>

        <div class="footer-item" data-aos="fade-up" data-aos-duration="1000">
          <h6 class="footer-item__title">Daily Groceries</h6>
          <ul class="footer-menu">
            <li class="mb-16">
              <NuxtLink to="/shop-all" class="text-heading hover-text-main-600">Clothing</NuxtLink>
            </li>
            <li class="mb-16">
              <NuxtLink to="/shop-all" class="text-heading hover-text-main-600">Electronics</NuxtLink>
            </li>
            <li class="mb-16">
              <NuxtLink to="/shop-all" class="text-heading hover-text-main-600">Summer Deals</NuxtLink>
            </li>
            <li class="mb-16">
              <NuxtLink to="/shop-all" class="text-heading hover-text-main-600">Household Supplies</NuxtLink>
            </li>
            <li class="mb-16">
              <NuxtLink to="/shop-all" class="text-heading hover-text-main-600">Cars & Bike</NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import { withBase } from 'ufo'

const config = useRuntimeConfig()
const logoSrc = computed(() =>
  withBase('/assets/images/logo/pranzo-weblogo.png', config.app.baseURL)
)
</script>

<style scoped>
/* Scoped styles if any overrides needed; global CSS already handles classes. */
</style>
