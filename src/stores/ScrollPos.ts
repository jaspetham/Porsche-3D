import { defineStore } from 'pinia'
import { shallowRef } from 'vue'

function debounce<T extends unknown[]>(fn: (...args: T) => void, delay: number) {
  let timeout: number | undefined
  return (...args: T) => {
    clearTimeout(timeout)
    timeout = window.setTimeout(() => fn(...args), delay)
  }
}

// Define the store
export const useScrollStore = defineStore('scroll', () => {
  const scrollPos = shallowRef(0)
  const scrollTarget = shallowRef('')

  const scrollPosDebounced = shallowRef(0)
  const scrollTargetDebounced = shallowRef('')

  const scrollSections = shallowRef<HTMLElement[]>([])

  const update = (isDebounced = false) => {
    const y = window.scrollY
    const targetList = isDebounced ? scrollTargetDebounced : scrollTarget
    const posRef = isDebounced ? scrollPosDebounced : scrollPos

    posRef.value = y

    let closest = ''
    let minDist = Infinity
    const offset = 100

    for (const el of scrollSections.value) {
      const top = el.getBoundingClientRect().top + window.scrollY
      const dist = Math.abs(top - offset - y)
      if (dist < minDist) {
        minDist = dist
        closest = `#${el.id}`
      }
    }

    targetList.value = closest
  }

  const updateImmediate = () => update(false)
  const updateDebounced = debounce(() => update(true), 100)

  const scrollHandler = () => {
    updateImmediate()
    updateDebounced()
  }

  const init = () => {
    scrollSections.value = Array.from(document.querySelectorAll('section[id]')) as HTMLElement[]
    window.addEventListener('scroll', scrollHandler)
    updateImmediate()
    updateDebounced()
  }

  const cleanup = () => {
    window.removeEventListener('scroll', scrollHandler)
  }
  return { scrollPos, scrollTarget, scrollPosDebounced, scrollTargetDebounced, init, cleanup }
})
