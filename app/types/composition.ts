export enum CompositionStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
}

export interface Note {
  pitch: string; // e.g., "C4", "D#5"
  time: number; // Time in beats
  duration: number; // Duration in beats
  velocity: number; // 0-127 (MIDI velocity)
}

export interface Track {
  id: string;
  name: string; // e.g., "Piano", "Drums", "Bass"
  instrument: string; // Instrument type
  notes: Note[];
  volume: number; // 0-100
  muted: boolean;
}

export interface MusicComposition {
  id: string;
  userId: string;
  title: string;
  description?: string;
  status: CompositionStatus;
  bpm: number; // Beats per minute
  key?: string; // Musical key
  scale?: string; // Major, Minor, etc.
  tracks: Track[];
  audioFileUrl?: string; // URL for exported MP3
  coverImageUrl?: string;
  duration?: number; // Duration in minutes
  fileSize?: number; // File size in bytes
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCompositionRequest {
  title: string;
  description?: string;
  bpm: number;
  key?: string;
  scale?: string;
  tracks?: Track[];
  isPublic?: boolean;
}

export interface UpdateCompositionRequest {
  title?: string;
  description?: string;
  bpm?: number;
  key?: string;
  scale?: string;
  tracks?: Track[];
  isPublic?: boolean;
  coverImageUrl?: string;
}
