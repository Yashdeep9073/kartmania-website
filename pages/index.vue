<script setup>
import { defineAsyncComponent } from "vue"

/* Light & critical components (direct load) */
import BannerStrip from "~/components/ui/BannerStrip.vue"
import HomeBanner from "~/components/home/HomeBanner.vue"
import HomeFeature from "~/components/home/HomeFeature.vue"
import HomeFlashm from "~/components/home/HomeFlashm.vue"
import LazySection from "~/components/ui/LazySection.vue"

/* Heavy components (ASYNC with error handling) */
const HomePromotion = defineAsyncComponent({ 
  loader: () => import("~/components/home/HomePromotion.vue"),
  errorComponent: () => import("~/components/ui/LazySection.vue"),
  delay: 200,
  timeout: 3000
})
const HomeFlash = defineAsyncComponent({
  loader: () => import("~/components/home/HomeFlash.vue"),
  errorComponent: () => import("~/components/ui/LazySection.vue"),
  delay: 200,
  timeout: 3000
})
const HomeBrand = defineAsyncComponent({
  loader: () => import("~/components/home/HomeBrand.vue"),
  errorComponent: () => import("~/components/ui/LazySection.vue"),
  delay: 200,
  timeout: 3000
})
const HomeCategory = defineAsyncComponent({
  loader: () => import("~/components/home/HomeCategory.vue"),
  errorComponent: () => import("~/components/ui/LazySection.vue"),
  delay: 200,
  timeout: 3000
})
const HomeRecomend = defineAsyncComponent({
  loader: () => import("~/components/home/HomeRecomend.vue"),
  errorComponent: () => import("~/components/ui/LazySection.vue"),
  delay: 200,
  timeout: 3000
})
const HomeOffer = defineAsyncComponent({
  loader: () => import("~/components/home/HomeOffer.vue"),
  errorComponent: () => import("~/components/ui/LazySection.vue"),
  delay: 200,
  timeout: 3000
})
const HomeHotdeal = defineAsyncComponent({
  loader: () => import("~/components/home/HomeHotdeal.vue"),
  errorComponent: () => import("~/components/ui/LazySection.vue"),
  delay: 200,
  timeout: 3000
})
const HomeDiscount = defineAsyncComponent({
  loader: () => import("~/components/home/HomeDiscount.vue"),
  errorComponent: () => import("~/components/ui/LazySection.vue"),
  delay: 200,
  timeout: 3000
})
const HomeShortProduct = defineAsyncComponent({   
  loader: () => import("~/components/home/HomeShortProduct.vue"),
  errorComponent: () => import("~/components/ui/LazySection.vue"),
  delay: 200,
  timeout: 3000
})
const HomeDailySell = defineAsyncComponent({
  loader: () => import("~/components/home/HomeDailySell.vue"),
  errorComponent: () => import("~/components/ui/LazySection.vue"),
  delay: 200,
  timeout: 3000
})
const ProductNews = defineAsyncComponent({
  loader: () => import("~/components/product/ProductNews.vue"),
  errorComponent: () => import("~/components/ui/LazySection.vue"),
  delay: 200,
  timeout: 10000 // Increased timeout to 10 seconds
})
const HomeOffersGrid = defineAsyncComponent({
  loader: () => import("~/components/home/HomeOffersGrid.vue"),
  errorComponent: () => import("~/components/ui/LazySection.vue"),
  delay: 200,
  timeout: 3000
})

useHead({ title: "Home" })
</script>

<template>
  <div class="main-container">
    <!-- FAST ABOVE THE FOLD -->
    <BannerStrip />
    <HomeBanner />
    <HomeFeature />

    <!-- BELOW THE FOLD (LAZY) -->
    <LazySection :component="HomePromotion" root-margin="50px" />
    <LazySection :component="HomeFlash" root-margin="50px" />
    <LazySection :component="HomeBrand" root-margin="50px" />
    <LazySection :component="HomeFlashm" root-margin="50px" /> 
    <LazySection :component="HomeOffersGrid" root-margin="50px" />
    <LazySection :component="HomeCategory" root-margin="50px" /> 
    <LazySection :component="HomeRecomend" root-margin="50px" /> 
    <LazySection :component="HomeOffer" root-margin="50px" /> 
    <LazySection :component="HomeHotdeal" root-margin="50px" /> 
    <LazySection :component="HomeDiscount" root-margin="50px" />
    <LazySection :component="HomeShortProduct" root-margin="50px" />
    <LazySection :component="HomeDailySell" root-margin="50px" /> 
    <LazySection :component="ProductNews" root-margin="50px" /> 
  </div>
</template>

<style scoped>
.main-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Add consistent spacing between sections */
.main-container > * {
  margin-bottom: 3rem; /* 48px spacing between sections */
}

.main-container > *:last-child {
  margin-bottom: 0;
}

/* Reduce spacing for smaller screens */
@media (max-width: 768px) {
  .main-container > * {
    margin-bottom: 2rem; /* 32px on mobile */
  }
}

@media (max-width: 576px) {
  .main-container > * {
    margin-bottom: 1.5rem; /* 24px on small mobile */
  }
}
</style>

<style>
@media (max-width: 768px) {
  html,
  body {
    max-width: 100%;
    overflow-x: hidden;
  }

  .main-container {
    width: 100%;
    overflow-x: hidden;
  }

  .main-container > * {
    min-width: 0;
    max-width: 100%;
  }

  .main-container img,
  .main-container video,
  .main-container canvas,
  .main-container svg {
    max-width: 100%;
    height: auto;
  }
}
</style>
