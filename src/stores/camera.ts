import { defineStore } from 'pinia'
import { ref } from 'vue'

import * as api from '@/api/cameras'
import type { RecordingStatus } from '@/api/cameras'

// Phase 2 為單一攝影機，camera_id 固定為 1。
const DEFAULT_CAMERA_ID = 1

export const useCameraStore = defineStore('camera', () => {
  const cameraId = ref(DEFAULT_CAMERA_ID)
  const isRecording = ref(false)
  const currentSegment = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  function applyStatus(s: RecordingStatus) {
    isRecording.value = s.is_recording
    currentSegment.value = s.current_segment
  }

  /** 輪詢用：抓取最新錄影狀態。 */
  async function fetchStatus() {
    try {
      applyStatus(await api.getRecordingStatus(cameraId.value))
      error.value = null
    } catch (e) {
      error.value = (e as Error).message
    }
  }

  /** 切換錄影開關。 */
  async function toggleRecording() {
    loading.value = true
    try {
      const s = isRecording.value
        ? await api.stopRecording(cameraId.value)
        : await api.startRecording(cameraId.value)
      applyStatus(s)
      error.value = null
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }

  return {
    cameraId,
    isRecording,
    currentSegment,
    loading,
    error,
    fetchStatus,
    toggleRecording,
  }
})
