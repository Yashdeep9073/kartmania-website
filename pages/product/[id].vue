<script setup>
// Redirect from /product/[id] to /shop-all/[slug]
const route = useRoute()
const productId = route.params.id

// Redirect to the main product detail page
await navigateTo(`/shop-all/--${productId}`, { redirectCode: 301 })
</script>
