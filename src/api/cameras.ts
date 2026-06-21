import { apiFetch, apiUrl } from './client'

export interface RecordingStatus {
  camera_id: number
  is_recording: boolean
  current_segment: string | null
}

export function getRecordingStatus(cameraId: number): Promise<RecordingStatus> {
  return apiFetch<RecordingStatus>(`/cameras/${cameraId}/recording/status`)
}

export function startRecording(cameraId: number): Promise<RecordingStatus> {
  return apiFetch<RecordingStatus>(`/cameras/${cameraId}/recording/start`, {
    method: 'POST',
  })
}

export function stopRecording(cameraId: number): Promise<RecordingStatus> {
  return apiFetch<RecordingStatus>(`/cameras/${cameraId}/recording/stop`, {
    method: 'POST',
  })
}

/** MJPEG 即時串流 URL（放進 <img src>）。 */
export function streamUrl(cameraId: number): string {
  return apiUrl(`/cameras/${cameraId}/stream`)
}

/** 單張快照 URL。 */
export function snapshotUrl(cameraId: number): string {
  return apiUrl(`/cameras/${cameraId}/snapshot`)
}
