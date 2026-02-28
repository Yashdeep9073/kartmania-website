import { ref, watch, unref, type Ref } from 'vue'
import { useApiEndpoints } from '~/utils/endpoints'

export const useProductGroupApi = (
    groupId?: Ref<string | number | null>
) => {
    const api = useApiEndpoints()

    const data = ref<any>(null)
    const loading = ref(false)
    const error = ref<unknown>(null)

    const fetchData = async () => {
        loading.value = true
        error.value = null

        try {
            let url: string

            if (groupId && unref(groupId)) {
                // ✅ Single group
                url = api.products.group.single(unref(groupId)!)
            } else {
                // ✅ All groups
                url = api.products.group.list()
            }

            const res = await $fetch(url)

            data.value = res?.data ?? null
        } catch (e) {
            error.value = e
            data.value = null
            console.error('❌ Product group fetch failed:', e)
        } finally {
            loading.value = false
        }
    }

    // Only watch if groupId exists
    if (groupId) {
        watch(groupId, fetchData, { immediate: true })
    } else {
        fetchData()
    }

    return {
        data,
        loading,
        error,
        refresh: fetchData
    }
}