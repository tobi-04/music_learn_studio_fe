export interface Recording {
  id: string;
  projectId: string;
  userId: string;
  fileName: string;
  fileUrl: string;
  duration: number;
  sampleRate: number;
  format: string;
  gain?: number;
  createdAt: string;
}

export interface CreateRecordingRequest {
  projectId: string;
  fileName: string;
  duration: number;
  sampleRate: number;
  format: string;
  gain?: number;
}
