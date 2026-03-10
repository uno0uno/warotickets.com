// DEBUG ONLY — remove after fixing issue #7
export default defineNuxtPlugin(() => {
  const router = useRouter()

  router.beforeEach((to, from) => {
    console.log(`[router] beforeEach: ${from.fullPath} → ${to.fullPath}`)
  })

  router.afterEach((to, from) => {
    console.log(`[router] afterEach: ${from.fullPath} → ${to.fullPath} | DONE`)
  })

  router.onError((err) => {
    console.error('[router] onError:', err)
  })
})
