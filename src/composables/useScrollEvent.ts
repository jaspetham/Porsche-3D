import { ref, onMounted, onUnmounted } from 'vue'

export function useScrollEvent() {
  const scrollAmount = ref(0)
  const handleScroll = () => {
    scrollAmount.value = window.scrollY
  }
  // Attach and detach scroll event listener
  onMounted(() => {
    window.addEventListener('scroll', handleScroll)
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })
  return { scrollAmount }
}
