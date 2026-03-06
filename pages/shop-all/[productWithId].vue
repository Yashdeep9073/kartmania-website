<script setup>
// Redirect to the proper slug/groupId format
const route = useRoute()
const productWithId = route.params.productWithId

// Parse the productWithId to extract slug and groupId
const parts = productWithId.toString().split('--')
let slug = parts[0] || productWithId
const groupId = parts[1] || parts[0]

// Handle edge case where slug is empty (e.g., from /product/[id] redirect)
if (!slug || slug === '') {
  slug = 'product'
}

// Redirect to the proper format (use replace to avoid history issues)
await navigateTo(`/shop-all/${slug}/${groupId}`, { replace: true })
</script>
