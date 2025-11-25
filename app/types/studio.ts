export interface Note {
  time: number; // Time in beats or seconds
  pitch: string; // MIDI pitch: "C4", "D#5", etc.
  duration: number | string; // Duration: 0.5 (seconds) or "4n" (quarter note)
  velocity: number; // 0.0 to 1.0
}

export interface Track {
  id: string;
  projectId: string;
  trackNumber: number;
  name: string;
  instrumentType: "Piano" | "Guitar" | "Drum" | "Bass" | "Synth";
  notes: Note[];
  volume: number; // 0.0 to 1.0
  pan: number; // -1.0 to 1.0
  muted: boolean;
  solo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  userId: string;
  tempo: number; // BPM
  keySignature: "C" | "D" | "E" | "F" | "G" | "A" | "B";
  scaleType: string;
  timeSignature: string; // "4/4", "3/4", etc.
  duration: number; // Seconds
  trackCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectWithTracks {
  project: Project;
  tracks: Track[];
}
