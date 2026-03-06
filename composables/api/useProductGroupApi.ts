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

            // Skip API call if groupId is "default" (placeholder value)
            if (groupId && unref(groupId) && unref(groupId) !== 'default') {
                // ✅ Single group
                url = api.products.group.single(unref(groupId)!)
            } else if (groupId && unref(groupId) === 'default') {
                // Skip API call for "default" placeholder
                data.value = null
                loading.value = false
                return
            } else {
                // ✅ All groups
                url = api.products.group.list()
            }

            const res = await $fetch<{ data: any }>(url)

            data.value = res?.data ?? null
        } catch (e: any) {
            error.value = e
            data.value = null
            
            // Handle 404 specifically - group doesn't exist
            if (e?.status === 404) {
                console.warn(`⚠️ Product group ${unref(groupId)} not found (404)`)
                // Optionally fetch all groups to show what's available
                try {
                    const allGroupsRes = await $fetch<{ data: any }>(api.products.group.list())
                    const availableGroups = allGroupsRes?.data || []
                    console.log('📋 Available groups:', availableGroups.map((g: any) => `${g.groupId}: ${g.name}`))
                    
                    // Return first available group for redirect
                    if (availableGroups.length > 0) {
                        return { redirectTo: availableGroups[0].groupId }
                    }
                } catch (listError) {
                    console.error('❌ Failed to fetch available groups:', listError)
                }
            } else {
                console.error('❌ Product group fetch failed:', e)
            }
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