<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold">Microphone Recording</h3>
      <UButton
        v-if="!isRecording && !audioBlob"
        @click="startRecording"
        :disabled="!isSupported">
        <Icon name="heroicons:microphone" class="mr-2" />
        Start Recording
      </UButton>
      <UButton
        v-else-if="isRecording"
        @click="stopRecording"
        variant="danger">
        <Icon name="heroicons:stop" class="mr-2" />
        Stop Recording
      </UButton>
    </div>

    <AppAlert v-if="!isSupported" variant="warning">
      Your browser doesn't support audio recording
    </AppAlert>

    <div v-if="error" class="text-red-500 text-sm">
      {{ error }}
    </div>

    <!-- Recording Timer -->
    <div v-if="isRecording" class="text-center">
      <div class="text-3xl font-mono text-red-500">
        {{ formatTime(recordingDuration) }}
      </div>
      <div class="flex items-center justify-center gap-2 mt-2">
        <div class="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        <span class="text-sm text-gray-500">Recording...</span>
      </div>
    </div>

    <!-- Waveform Visualization -->
    <div v-if="isRecording" class="bg-gray-50 rounded-lg p-4">
      <canvas ref="canvasRef" class="w-full h-24"></canvas>
    </div>

    <!-- Gain Control -->
    <div v-if="isRecording" class="space-y-2">
      <label class="block text-sm font-medium">
        Gain: {{ gain.toFixed(1) }}x
      </label>
      <input
        v-model.number="gain"
        type="range"
        min="0.5"
        max="3"
        step="0.1"
        class="w-full" />
    </div>

    <!-- Playback -->
    <div v-if="audioBlob" class="space-y-3">
      <audio ref="audioRef" :src="audioUrl" controls class="w-full"></audio>

      <div class="flex gap-2">
        <UButton @click="uploadRecording" :disabled="uploading">
          <Icon
            v-if="!uploading"
            name="heroicons:cloud-arrow-up"
            class="mr-2" />
          <AppSpinner v-else class="mr-2" size="sm" />
          {{ uploading ? "Uploading..." : "Upload Recording" }}
        </UButton>
        <UButton @click="discardRecording" variant="outline">
          <Icon name="heroicons:trash" class="mr-2" />
          Discard
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from "vue";
import type { CreateRecordingRequest } from "~/types/recording";

interface Props {
  projectId: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  uploaded: [];
}>();

const { uploadRecording: uploadRecordingApi } = useRecordingApi();
const toast = useToast();

const isSupported = ref(false);
const isRecording = ref(false);
const audioBlob = ref<Blob | null>(null);
const audioUrl = ref<string>("");
const error = ref<string>("");
const uploading = ref(false);
const recordingDuration = ref(0);
const gain = ref(1.0);

const audioRef = ref<HTMLAudioElement>();
const canvasRef = ref<HTMLCanvasElement>();

let mediaRecorder: MediaRecorder | null = null;
let audioContext: AudioContext | null = null;
let analyser: AnalyserNode | null = null;
let gainNode: GainNode | null = null;
let animationId: number | null = null;
let timerInterval: NodeJS.Timeout | null = null;
let chunks: Blob[] = [];

onMounted(() => {
  isSupported.value = !!(
    navigator.mediaDevices && navigator.mediaDevices.getUserMedia
  );
});

onUnmounted(() => {
  cleanup();
});

const startRecording = async () => {
  try {
    error.value = "";
    chunks = [];

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    // Setup audio context for visualization
    audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    analyser = audioContext.createAnalyser();
    gainNode = audioContext.createGain();

    analyser.fftSize = 2048;
    gainNode.gain.value = gain.value;

    source.connect(gainNode);
    gainNode.connect(analyser);

    // Start media recorder
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunks.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      audioBlob.value = new Blob(chunks, { type: "audio/webm" });
      audioUrl.value = URL.createObjectURL(audioBlob.value);
      stream.getTracks().forEach((track) => track.stop());
    };

    mediaRecorder.start();
    isRecording.value = true;
    recordingDuration.value = 0;

    // Start timer
    timerInterval = setInterval(() => {
      recordingDuration.value++;
    }, 1000);

    // Start visualization
    visualize();
  } catch (err) {
    error.value = "Failed to access microphone. Please check permissions.";
    console.error("Recording error:", err);
  }
};

const stopRecording = () => {
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.stop();
  }

  isRecording.value = false;

  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }

  if (audioContext) {
    audioContext.close();
    audioContext = null;
  }
};

const visualize = () => {
  if (!analyser || !canvasRef.value) return;

  const canvas = canvasRef.value;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  const draw = () => {
    if (!isRecording.value) return;

    animationId = requestAnimationFrame(draw);

    analyser!.getByteTimeDomainData(dataArray);

    ctx.fillStyle = "rgb(249, 250, 251)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgb(59, 130, 246)";
    ctx.beginPath();

    const sliceWidth = canvas.width / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0;
      const y = (v * canvas.height) / 2;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
  };

  draw();
};

const uploadRecording = async () => {
  if (!audioBlob.value) return;

  try {
    uploading.value = true;

    // Convert webm to File object
    const fileName = `recording-${Date.now()}.webm`;
    const file = new File([audioBlob.value], fileName, { type: "audio/webm" });

    const request: CreateRecordingRequest = {
      projectId: props.projectId,
      fileName,
      duration: recordingDuration.value,
      sampleRate: audioContext?.sampleRate || 44100,
      format: "webm",
      gain: gain.value,
    };

    await uploadRecordingApi(file, request);

    toast.add({
      title: "Success",
      description: "Recording uploaded successfully",
      color: "success",
    });

    emit("uploaded");
    discardRecording();
  } catch (err) {
    error.value = "Failed to upload recording";
    console.error("Upload error:", err);
    toast.add({
      title: "Error",
      description: "Failed to upload recording",
      color: "error",
    });
  } finally {
    uploading.value = false;
  }
};

const discardRecording = () => {
  if (audioUrl.value) {
    URL.revokeObjectURL(audioUrl.value);
  }
  audioBlob.value = null;
  audioUrl.value = "";
  recordingDuration.value = 0;
};

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

const cleanup = () => {
  stopRecording();
  discardRecording();
};

// Update gain node when gain changes
watch(gain, (newGain) => {
  if (gainNode) {
    gainNode.gain.value = newGain;
  }
});
</script>
