<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

import { snapshotUrl, streamUrl } from '@/api/cameras'
import { useCameraStore } from '@/stores/camera'

const store = useCameraStore()

const live = ref(true)
const streamError = ref(false)
// cache-bust：重新開始串流時強制瀏覽器重連
const streamNonce = ref(Date.now())

const imgSrc = computed(() =>
  live.value ? `${streamUrl(store.cameraId)}?t=${streamNonce.value}` : '',
)

function toggleLive() {
  live.value = !live.value
  if (live.value) {
    streamError.value = false
    streamNonce.value = Date.now()
  }
}

function onStreamError() {
  streamError.value = true
}

let timer: number | undefined
onMounted(() => {
  store.fetchStatus()
  timer = window.setInterval(() => store.fetchStatus(), 2000)
})
onBeforeUnmount(() => {
  if (timer) window.clearInterval(timer)
  live.value = false // 中斷 MJPEG 連線
})
</script>

<template>
  <v-container class="py-6" fluid>
    <v-alert
      v-if="store.error"
      type="error"
      variant="tonal"
      density="comfortable"
      class="mb-4"
      :text="store.error"
    />

    <v-row>
      <!-- 即時畫面 -->
      <v-col cols="12" md="8">
        <v-card color="surface" class="overflow-hidden">
          <div class="video-wrap">
            <img
              v-if="live && !streamError"
              :src="imgSrc"
              class="video"
              alt="live stream"
              @error="onStreamError"
            />
            <div v-else class="video placeholder">
              <v-icon
                :icon="streamError ? 'mdi-video-off-outline' : 'mdi-pause-circle-outline'"
                size="56"
              />
              <span class="mt-2 text-medium-emphasis">
                {{ streamError ? '串流連線失敗（後端是否啟動？）' : '串流已暫停' }}
              </span>
            </div>

            <div v-if="store.isRecording" class="rec-badge">
              <span class="rec-dot" /> REC
            </div>
          </div>

          <v-card-actions class="px-4">
            <v-btn
              :prepend-icon="live ? 'mdi-pause' : 'mdi-play'"
              variant="tonal"
              @click="toggleLive"
            >
              {{ live ? '暫停串流' : '開始串流' }}
            </v-btn>
            <v-spacer />
            <v-btn
              variant="text"
              prepend-icon="mdi-camera"
              :href="snapshotUrl(store.cameraId)"
              target="_blank"
            >
              開新分頁快照
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <!-- 錄影控制 -->
      <v-col cols="12" md="4">
        <v-card color="surface">
          <v-card-title class="d-flex align-center">
            <v-icon icon="mdi-record-rec" class="mr-2" />錄影控制
          </v-card-title>
          <v-card-text>
            <div class="d-flex align-center mb-4">
              <span class="text-medium-emphasis mr-3">狀態</span>
              <v-chip
                :color="store.isRecording ? 'error' : 'secondary'"
                size="small"
                variant="flat"
              >
                {{ store.isRecording ? '錄影中' : '未錄影' }}
              </v-chip>
            </div>

            <v-btn
              block
              size="large"
              :color="store.isRecording ? 'error' : 'primary'"
              :loading="store.loading"
              :prepend-icon="store.isRecording ? 'mdi-stop' : 'mdi-record'"
              @click="store.toggleRecording"
            >
              {{ store.isRecording ? '停止錄影' : '開始錄影' }}
            </v-btn>

            <v-divider class="my-4" />

            <div class="text-caption text-medium-emphasis">攝影機 ID</div>
            <div class="text-body-2 mb-3">{{ store.cameraId }}</div>

            <div class="text-caption text-medium-emphasis">目前分段</div>
            <div class="text-body-2 text-break">{{ store.currentSegment ?? '—' }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.video-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  background: #000;
}
.video {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}
.placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.rec-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.55);
  color: #ff5252;
  font-weight: 700;
  letter-spacing: 1px;
  font-size: 0.85rem;
}
.rec-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ff5252;
  animation: blink 1s steps(2, start) infinite;
}
@keyframes blink {
  50% {
    opacity: 0.2;
  }
}
</style>
