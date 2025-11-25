import { Midi } from "@tonejs/midi";
import type { Track, Note } from "~/types";

/**
 * Export composition to MIDI file
 */
export const exportToMIDI = (
  tracks: Track[],
  bpm: number,
  fileName: string = "composition.mid"
): void => {
  try {
    // Create MIDI object
    const midi = new Midi();
    midi.header.setTempo(bpm);

    // Add each track
    tracks.forEach((track) => {
      const midiTrack = midi.addTrack();
      midiTrack.name = track.name;

      // Convert instrument to MIDI instrument number
      const instrumentNumber = getInstrumentNumber(track.instrument);
      if (instrumentNumber !== null) {
        midiTrack.instrument.number = instrumentNumber;
      }

      // Add notes
      track.notes.forEach((note) => {
        if (
          note &&
          note.pitch &&
          typeof note.time === "number" &&
          typeof note.duration === "number"
        ) {
          midiTrack.addNote({
            midi: noteToMidi(note.pitch),
            time: note.time,
            duration: note.duration,
            velocity: note.velocity || 0.8,
          });
        }
      });
    });

    // Convert to array buffer and download
    const arrayBuffer = midi.toArray();
    const blob = new Blob([arrayBuffer as unknown as BlobPart], {
      type: "audio/midi",
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();

    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Failed to export MIDI:", error);
    throw new Error("Failed to export MIDI file");
  }
};

/**
 * Convert note name to MIDI number
 */
const noteToMidi = (note: string): number => {
  const noteMap: Record<string, number> = {
    C: 0,
    "C#": 1,
    Db: 1,
    D: 2,
    "D#": 3,
    Eb: 3,
    E: 4,
    F: 5,
    "F#": 6,
    Gb: 6,
    G: 7,
    "G#": 8,
    Ab: 8,
    A: 9,
    "A#": 10,
    Bb: 10,
    B: 11,
  };

  // Parse note (e.g., "C4", "C#4", "Db3")
  const match = note.match(/^([A-G][b#]?)(\d+)$/);
  if (!match) {
    console.warn(`Invalid note format: ${note}`);
    return 60; // Default to middle C
  }

  const noteName = match[1];
  const octave = parseInt(match[2] || "4", 10);

  const noteValue = noteMap[noteName];
  if (noteValue === undefined) {
    console.warn(`Unknown note: ${noteName}`);
    return 60;
  }

  return (octave + 1) * 12 + noteValue;
};

/**
 * Map instrument names to General MIDI instrument numbers
 */
const getInstrumentNumber = (instrument: string): number | null => {
  const instrumentMap: Record<string, number> = {
    piano: 0,
    synth: 80,
    bass: 32,
    drums: 0, // Drums use channel 10, but instrument number is 0
    guitar: 24,
    strings: 48,
    brass: 56,
    organ: 16,
    pad: 88,
  };

  return instrumentMap[instrument.toLowerCase()] ?? null;
};
