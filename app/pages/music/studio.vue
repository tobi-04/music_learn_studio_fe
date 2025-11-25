<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <UContainer>
      <div class="py-6 space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold">Music Studio</h1>
            <p class="text-gray-600 dark:text-gray-400">
              Create your own music
            </p>
          </div>
          <div class="flex gap-2">
            <UButton
              color="neutral"
              variant="outline"
              icon="i-lucide-arrow-left"
              to="/music">
              Back
            </UButton>
            <UButton
              color="neutral"
              variant="outline"
              icon="i-lucide-save"
              :loading="saving"
              @click="saveComposition">
              Save Draft
            </UButton>
            <UButton
              color="primary"
              icon="i-lucide-upload"
              :loading="publishing"
              @click="showPublishModal = true"
              :disabled="
                !currentComposition || tracks.every((t) => t.notes.length === 0)
              ">
              Publish
            </UButton>
          </div>
        </div>

        <!-- Composition Settings -->
        <UCard>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Title</label>
              <UInput
                v-model="compositionTitle"
                placeholder="My Composition"
                @blur="autoSave" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">BPM (Tempo)</label>
              <UInput
                v-model.number="bpm"
                type="number"
                min="40"
                max="240"
                @change="updateTempo" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Key</label>
              <USelect
                v-model="musicalKey"
                :items="keyOptions"
                @change="autoSave" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Scale</label>
              <USelect
                v-model="scale"
                :items="scaleOptions"
                @change="autoSave" />
            </div>
          </div>
        </UCard>

        <!-- Transport Controls -->
        <UCard>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <UButton
                :icon="isPlaying ? 'i-lucide-pause' : 'i-lucide-play'"
                size="lg"
                :color="isPlaying ? 'warning' : 'primary'"
                @click="togglePlayback">
                {{ isPlaying ? "Pause" : "Play" }}
              </UButton>
              <UButton
                icon="i-lucide-square"
                color="neutral"
                variant="outline"
                @click="stopPlayback">
                Stop
              </UButton>
              <div class="text-sm text-gray-600 dark:text-gray-400">
                {{ formatTime(currentTime) }} / {{ formatTime(totalDuration) }}
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-sm">Volume:</span>
              <input
                v-model.number="masterVolume"
                type="range"
                min="0"
                max="100"
                class="w-32"
                @input="updateMasterVolume" />
              <span class="text-sm w-8">{{ masterVolume }}%</span>
            </div>
            <div class="flex gap-2">
              <UButton
                icon="i-lucide-download"
                color="neutral"
                variant="outline"
                :disabled="tracks.every((t) => t.notes.length === 0)"
                @click="downloadMIDI">
                Export MIDI
              </UButton>
            </div>
          </div>
        </UCard>

        <!-- Tracks -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold">Tracks</h2>
            <UButton
              icon="i-lucide-plus"
              color="neutral"
              variant="outline"
              @click="showAddTrackModal = true">
              Add Track
            </UButton>
          </div>

          <div v-for="track in tracks" :key="track.id" class="space-y-2">
            <UCard>
              <div class="space-y-4">
                <!-- Track Header -->
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3 flex-1">
                    <UButton
                      :icon="
                        track.muted ? 'i-lucide-volume-x' : 'i-lucide-volume-2'
                      "
                      size="sm"
                      :color="track.muted ? 'neutral' : 'primary'"
                      variant="outline"
                      @click="toggleMute(track.id)" />
                    <div class="flex-1">
                      <h3 class="font-medium">{{ track.name }}</h3>
                      <p class="text-sm text-gray-500">
                        {{ track.instrument }} • {{ track.notes.length }} notes
                      </p>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <input
                      v-model.number="track.volume"
                      type="range"
                      min="0"
                      max="100"
                      class="w-24"
                      @input="updateTrackVolume(track.id)" />
                    <span class="text-sm w-8">{{ track.volume }}%</span>
                    <UButton
                      icon="i-lucide-trash-2"
                      size="sm"
                      color="error"
                      variant="outline"
                      @click="deleteTrack(track.id)" />
                  </div>
                </div>

                <!-- Piano Roll / Note Grid -->
                <div
                  class="border rounded-lg p-4 bg-white dark:bg-gray-800 overflow-x-auto">
                  <div class="min-w-[800px]">
                    <div class="text-sm font-medium mb-2">Note Grid</div>
                    <div
                      class="grid gap-1"
                      style="grid-template-columns: repeat(16, 1fr)">
                      <div
                        v-for="i in 16"
                        :key="i"
                        class="h-32 border rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 relative"
                        @click="addNoteToGrid(track.id, i - 1)">
                        <div
                          v-for="note in getNotesAtBeat(track.id, i - 1)"
                          :key="`${note.pitch}-${note.time}`"
                          class="absolute inset-0 bg-primary-500 opacity-50 rounded flex items-center justify-center text-xs text-white font-medium"
                          @click.stop="removeNote(track.id, note)">
                          {{ note.pitch }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Virtual Keyboard for track -->
                <div
                  v-if="
                    track.instrument === 'Synth' || track.instrument === 'Piano'
                  ">
                  <div class="text-sm font-medium mb-2">Virtual Keyboard</div>
                  <div class="flex gap-1 items-end h-32">
                    <div
                      v-for="note in pianoNotes"
                      :key="note.name"
                      :class="[
                        'cursor-pointer transition-colors',
                        note.isBlack
                          ? 'bg-gray-900 hover:bg-gray-700 h-20 w-8 -mx-2 z-10 rounded-b'
                          : 'bg-white hover:bg-gray-200 h-32 w-12 border border-gray-300 rounded-b',
                      ]"
                      @mousedown="playNote(track.id, note.name)"
                      @mouseup="stopNote(track.id)"
                      @mouseleave="stopNote(track.id)"></div>
                  </div>
                </div>
              </div>
            </UCard>
          </div>
        </div>
      </div>
    </UContainer>

    <!-- Add Track Modal -->
    <ClientOnly>
      <UModal v-model:open="showAddTrackModal">
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">Add New Track</h3>
          </template>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">Track Name</label>
              <UInput
                v-model="newTrackName"
                placeholder="Piano, Drums, Bass..." />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Instrument</label>
              <USelect
                v-model="newTrackInstrument"
                :items="instrumentOptions" />
            </div>
          </div>

          <template #footer>
            <div class="flex justify-end gap-2">
              <UButton
                color="neutral"
                variant="outline"
                @click="showAddTrackModal = false">
                Cancel
              </UButton>
              <UButton
                color="primary"
                :disabled="!newTrackName"
                @click="addTrack">
                Add Track
              </UButton>
            </div>
          </template>
        </UCard>
      </UModal>
    </ClientOnly>

    <!-- Publish Modal -->
    <ClientOnly>
      <UModal v-model:open="showPublishModal">
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">Publish Composition</h3>
          </template>

          <div class="space-y-4">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Your composition will be exported to MP3 and published to your
              library.
            </p>
            <div>
              <label class="block text-sm font-medium mb-1">Make Public</label>
              <div class="flex items-center gap-2 mt-2">
                <input v-model="isPublic" type="checkbox" class="rounded" />
                <span class="text-sm"
                  >Allow others to see and play this composition</span
                >
              </div>
            </div>
          </div>

          <template #footer>
            <div class="flex justify-end gap-2">
              <UButton
                color="neutral"
                variant="outline"
                @click="showPublishModal = false">
                Cancel
              </UButton>
              <UButton
                color="primary"
                :loading="publishing"
                @click="publishComposition">
                Publish
              </UButton>
            </div>
          </template>
        </UCard>
      </UModal>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import * as Tone from "tone";
import type {
  Track,
  Note,
  CreateCompositionRequest,
  MusicComposition,
} from "~/types";
import { exportToMP3 } from "~/utils/audioExport";
import { exportToMIDI } from "~/utils/midiExport";
import { useCompositionApi } from "~/composables/api/useCompositionApi";

const route = useRoute();
const router = useRouter();
const api = useCompositionApi();

// Composition state
const currentComposition = ref<MusicComposition | null>(null);
const compositionTitle = ref("Untitled Composition");
const bpm = ref(120);
const musicalKey = ref("C");
const scale = ref("Major");
const isPublic = ref(false);

// Transport state
const isPlaying = ref(false);
const currentTime = ref(0);
const totalDuration = ref(16); // 16 beats
const masterVolume = ref(80);

// Track state
const tracks = ref<Track[]>([]);
const currentBeat = ref(0);

// UI state
const saving = ref(false);
const publishing = ref(false);
const showAddTrackModal = ref(false);
const showPublishModal = ref(false);
const newTrackName = ref("");
const newTrackInstrument = ref("Synth");

// Tone.js instruments
const instruments = new Map<string, Tone.PolySynth>();

// Options
const keyOptions = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];
const scaleOptions = ["Major", "Minor", "Pentatonic", "Blues"];
const instrumentOptions = [
  { label: "Synth", value: "Synth" },
  { label: "Piano", value: "Piano" },
  { label: "Bass", value: "Bass" },
  { label: "Drums", value: "Drums" },
];

const pianoNotes = [
  { name: "C4", isBlack: false },
  { name: "C#4", isBlack: true },
  { name: "D4", isBlack: false },
  { name: "D#4", isBlack: true },
  { name: "E4", isBlack: false },
  { name: "F4", isBlack: false },
  { name: "F#4", isBlack: true },
  { name: "G4", isBlack: false },
  { name: "G#4", isBlack: true },
  { name: "A4", isBlack: false },
  { name: "A#4", isBlack: true },
  { name: "B4", isBlack: false },
  { name: "C5", isBlack: false },
];

onMounted(async () => {
  // Initialize Tone.js
  await Tone.start();
  Tone.Transport.bpm.value = bpm.value;

  // Load composition if editing
  const compositionId = route.query.id as string;
  if (compositionId) {
    await loadComposition(compositionId);
  } else {
    // Create initial track
    addTrack();
  }

  // Setup transport for playback
  setupTransport();
});

onUnmounted(() => {
  // Clean up Tone.js
  Tone.Transport.stop();
  Tone.Transport.cancel();
  instruments.forEach((inst) => inst.dispose());
  instruments.clear();
});

function setupTransport() {
  Tone.Transport.scheduleRepeat((time) => {
    currentBeat.value = (currentBeat.value + 1) % 16;
    currentTime.value = Tone.Transport.seconds;

    // Play notes for each track at current beat
    tracks.value.forEach((track) => {
      if (!track.muted) {
        const notesAtBeat = track.notes.filter(
          (note) => Math.floor(note.time) === currentBeat.value
        );
        const instrument = instruments.get(track.id);
        if (instrument && notesAtBeat.length > 0) {
          notesAtBeat.forEach((note) => {
            instrument.triggerAttackRelease(
              note.pitch,
              note.duration / 4,
              time,
              note.velocity / 127
            );
          });
        }
      }
    });
  }, "4n");
}

async function loadComposition(id: string) {
  try {
    const response = await api.getCompositionById(id);
    const comp = response.data;
    currentComposition.value = comp;
    compositionTitle.value = comp.title;
    bpm.value = comp.bpm;
    musicalKey.value = comp.key || "C";
    scale.value = comp.scale || "Major";
    isPublic.value = comp.isPublic;
    tracks.value = comp.tracks || [];

    // Initialize instruments for loaded tracks
    tracks.value.forEach((track) => {
      if (!instruments.has(track.id)) {
        createInstrument(track.id, track.instrument);
      }
    });
  } catch (error) {
    console.error("Failed to load composition:", error);
  }
}

function createInstrument(trackId: string, instrumentType: string) {
  let synth: Tone.PolySynth;

  switch (instrumentType) {
    case "Piano":
      synth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "triangle" },
        envelope: { attack: 0.005, decay: 0.1, sustain: 0.3, release: 1 },
      }).toDestination();
      break;
    case "Bass":
      synth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "sawtooth" },
        envelope: { attack: 0.01, decay: 0.2, sustain: 0.5, release: 0.8 },
      }).toDestination();
      break;
    case "Drums":
      synth = new Tone.PolySynth(Tone.MembraneSynth).toDestination();
      break;
    default:
      synth = new Tone.PolySynth(Tone.Synth).toDestination();
  }

  instruments.set(trackId, synth);
}

function createInstrumentInstance(instrumentType: string): Tone.PolySynth {
  switch (instrumentType) {
    case "Piano":
      return new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "triangle" },
        envelope: { attack: 0.005, decay: 0.1, sustain: 0.3, release: 1 },
      });
    case "Bass":
      return new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "sawtooth" },
        envelope: { attack: 0.01, decay: 0.2, sustain: 0.5, release: 0.8 },
      });
    case "Drums":
      return new Tone.PolySynth(Tone.MembraneSynth);
    default:
      return new Tone.PolySynth(Tone.Synth);
  }
}

function addTrack() {
  const trackId = `track-${Date.now()}`;
  const newTrack: Track = {
    id: trackId,
    name: newTrackName.value || `Track ${tracks.value.length + 1}`,
    instrument: newTrackInstrument.value,
    notes: [],
    volume: 80,
    muted: false,
  };

  tracks.value.push(newTrack);
  createInstrument(trackId, newTrackInstrument.value);

  // Reset modal
  newTrackName.value = "";
  newTrackInstrument.value = "Synth";
  showAddTrackModal.value = false;

  autoSave();
}

function deleteTrack(trackId: string) {
  const index = tracks.value.findIndex((t) => t.id === trackId);
  if (index !== -1) {
    tracks.value.splice(index, 1);
    const instrument = instruments.get(trackId);
    if (instrument) {
      instrument.dispose();
      instruments.delete(trackId);
    }
    autoSave();
  }
}

function toggleMute(trackId: string) {
  const track = tracks.value.find((t) => t.id === trackId);
  if (track) {
    track.muted = !track.muted;
  }
}

function updateTrackVolume(trackId: string) {
  const track = tracks.value.find((t) => t.id === trackId);
  if (track) {
    const instrument = instruments.get(trackId);
    if (instrument) {
      instrument.volume.value = (track.volume / 100) * 10 - 10; // Convert to dB
    }
  }
}

function updateMasterVolume() {
  Tone.Destination.volume.value = (masterVolume.value / 100) * 10 - 10;
}

function updateTempo() {
  Tone.Transport.bpm.value = bpm.value;
  autoSave();
}

function togglePlayback() {
  if (isPlaying.value) {
    Tone.Transport.pause();
  } else {
    Tone.Transport.start();
  }
  isPlaying.value = !isPlaying.value;
}

function stopPlayback() {
  Tone.Transport.stop();
  isPlaying.value = false;
  currentBeat.value = 0;
  currentTime.value = 0;
}

function addNoteToGrid(trackId: string, beat: number) {
  const track = tracks.value.find((t) => t.id === trackId);
  if (track) {
    const newNote: Note = {
      pitch: "C4",
      time: beat,
      duration: 1,
      velocity: 100,
    };
    track.notes.push(newNote);
    autoSave();
  }
}

function removeNote(trackId: string, note: Note) {
  const track = tracks.value.find((t) => t.id === trackId);
  if (track) {
    const index = track.notes.findIndex(
      (n) => n.pitch === note.pitch && n.time === note.time
    );
    if (index !== -1) {
      track.notes.splice(index, 1);
      autoSave();
    }
  }
}

function getNotesAtBeat(trackId: string, beat: number): Note[] {
  const track = tracks.value.find((t) => t.id === trackId);
  return track ? track.notes.filter((n) => Math.floor(n.time) === beat) : [];
}

function playNote(trackId: string, pitch: string) {
  const instrument = instruments.get(trackId);
  if (instrument) {
    instrument.triggerAttack(pitch);
  }
}

function stopNote(trackId: string) {
  const instrument = instruments.get(trackId);
  if (instrument) {
    instrument.releaseAll();
  }
}

async function autoSave() {
  if (!compositionTitle.value) return;

  try {
    const data: CreateCompositionRequest = {
      title: compositionTitle.value,
      bpm: bpm.value,
      key: musicalKey.value,
      scale: scale.value,
      tracks: tracks.value,
      isPublic: isPublic.value,
    };

    if (currentComposition.value) {
      await api.updateComposition(currentComposition.value.id, data);
    } else {
      const response = await api.createComposition(data);
      currentComposition.value = response.data;
    }
  } catch (error) {
    console.error("Auto-save failed:", error);
  }
}

async function saveComposition() {
  saving.value = true;
  try {
    await autoSave();
    alert("Composition saved successfully!");
  } catch (error) {
    console.error("Failed to save composition:", error);
    alert("Failed to save composition");
  } finally {
    saving.value = false;
  }
}

function downloadMIDI() {
  try {
    if (tracks.value.every((t) => t.notes.length === 0)) {
      alert("No notes to export");
      return;
    }

    const fileName = `${compositionTitle.value || "composition"}.mid`;
    exportToMIDI(tracks.value, bpm.value, fileName);
  } catch (error) {
    console.error("Failed to export MIDI:", error);
    alert("Failed to export MIDI file");
  }
}

async function publishComposition() {
  if (!currentComposition.value) {
    alert("Please save your composition first");
    return;
  }

  publishing.value = true;
  try {
    // Export to audio (simplified - in production, use proper rendering)
    const audioBlob = await exportToAudio();
    const audioFile = new File([audioBlob], `${compositionTitle.value}.mp3`, {
      type: "audio/mpeg",
    });

    await api.publishComposition(currentComposition.value.id, audioFile);

    alert("Composition published successfully!");
    showPublishModal.value = false;
    router.push("/music/compositions");
  } catch (error) {
    console.error("Failed to publish composition:", error);
    alert("Failed to publish composition");
  } finally {
    publishing.value = false;
  }
}

async function exportToAudio(): Promise<Blob> {
  // Calculate duration based on the longest track
  let maxDuration = 0;
  for (const track of tracks.value) {
    for (const note of track.notes) {
      const noteEnd = note.time + note.duration;
      if (noteEnd > maxDuration) {
        maxDuration = noteEnd;
      }
    }
  }

  // Add 1 second buffer
  const duration = maxDuration + 1;

  // Export using offline rendering
  const blob = await exportToMP3(
    async () => {
      // Recreate instruments for offline rendering
      const offlineInstruments = new Map<string, Tone.PolySynth>();

      for (const track of tracks.value) {
        if (track.notes.length === 0) continue;

        const instrument = createInstrumentInstance(track.instrument);
        instrument.volume.value = Tone.gainToDb(track.volume);
        instrument.toDestination();
        offlineInstruments.set(track.id, instrument);
      }

      // Schedule all notes
      const now = Tone.now();
      for (const track of tracks.value) {
        const instrument = offlineInstruments.get(track.id);
        if (!instrument) continue;

        for (const note of track.notes) {
          instrument.triggerAttackRelease(
            note.pitch,
            note.duration,
            now + note.time
          );
        }
      }

      // Start transport for offline rendering
      await Tone.Transport.start();
      await new Promise((resolve) => setTimeout(resolve, duration * 1000));

      // Cleanup
      for (const instrument of offlineInstruments.values()) {
        instrument.dispose();
      }
    },
    { duration, sampleRate: 44100 }
  );

  return blob;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}
</script>
