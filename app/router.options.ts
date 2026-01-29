import type { RouterConfig } from '@nuxt/schema'

export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {

    //  ONLY browser back / forward
    if (savedPosition && to.meta.restoreScroll) {
      return savedPosition
    }

    //  forward navigation = ALWAYS top
    return { top: 0 }
  }
}
