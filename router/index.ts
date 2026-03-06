import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/pages/index.vue')
    },

    // ✅ Product detail routes - handle both patterns
    {
      path: '/shop-all/:productWithId',
      name: 'ShopProductDetailCompact',
      component: () => import('@/pages/shop-all/[slug]/[groupId].vue'),
      props: (route) => {
        // Parse productWithId to extract slug and groupId
        const parts = route.params.productWithId.toString().split('--')
        return {
          slug: parts[0] || route.params.productWithId,
          groupId: parts[1] || parts[0]
        }
      }
    },
    {
      path: '/shop-all/:slug/:groupId',
      name: 'ShopProductDetail',
      component: () => import('@/pages/shop-all/[slug]/[groupId].vue'),
      props: true
    },

    {
      path: '/cart',
      name: 'Cart',
      component: () => import('@/pages/cart/Cart.vue')
    },
    {
      path: '/checkout',
      name: 'Checkout',
      component: () => import('@/pages/cart/Checkout.vue')
    },
    {
      path: '/wishlist',
      name: 'Wishlist',
      component: () => import("@/pages/account/Wishlist.vue")
    },
    {
      path: '/terms',
      name: 'Terms',
      component: () => import('@/pages/terms.vue')
    },

    // keep this AFTER product route
    {
      path: '/shop/:pathMatch(.*)*',
      name: 'ShopPages',
      component: () => import('@/pages/shop-all/index.vue')
    },

    // wildcard LAST
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/pages/index.vue')
    }
  ]
})

export default router