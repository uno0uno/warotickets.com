import { defineStore } from 'pinia'

export const useEventSelectionStore = defineStore('eventSelection', () => {
  const selectedEventId = ref<number | null>(null)

  function setEvent(id: number | null) {
    selectedEventId.value = id
  }

  return {
    selectedEventId,
    setEvent
  }
})
