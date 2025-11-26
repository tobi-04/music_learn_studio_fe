import * as Tone from "tone";

interface ExportOptions {
  duration: number; // Duration in seconds
  sampleRate?: number;
}

/**
 * Export Tone.js composition to WAV format using offline rendering
 * This is simpler and more reliable than MP3 encoding
 */
export async function exportToWAV(
  exportFunction: () => Promise<void>,
  options: ExportOptions
): Promise<Blob> {
  const { duration, sampleRate = 44100 } = options;

  try {
    // Render audio offline
    const buffer = await Tone.Offline(async () => {
      await exportFunction();
    }, duration);

    // Convert AudioBuffer to WAV
    const wavBlob = audioBufferToWav(buffer);
    return wavBlob;
  } catch (error) {
    console.error("Failed to export to WAV:", error);
    throw new Error(
      "WAV export failed: " +
        (error instanceof Error ? error.message : String(error))
    );
  }
}

/**
 * Convert an AudioBuffer to a WAV Blob
 */
function audioBufferToWav(buffer: Tone.ToneAudioBuffer): Blob {
  const length = buffer.length;
  const numberOfChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;

  // Create WAV header
  const bytesPerSample = 2; // 16-bit
  const blockAlign = numberOfChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = length * blockAlign;
  const bufferSize = 44 + dataSize;

  const arrayBuffer = new ArrayBuffer(bufferSize);
  const view = new DataView(arrayBuffer);

  // RIFF chunk descriptor
  writeString(view, 0, "RIFF");
  view.setUint32(4, bufferSize - 8, true);
  writeString(view, 8, "WAVE");

  // fmt sub-chunk
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true); // fmt chunk size
  view.setUint16(20, 1, true); // audio format (1 = PCM)
  view.setUint16(22, numberOfChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bytesPerSample * 8, true); // bits per sample

  // data sub-chunk
  writeString(view, 36, "data");
  view.setUint32(40, dataSize, true);

  // Write the PCM samples
  const offset = 44;
  const channels: Float32Array[] = [];
  for (let i = 0; i < numberOfChannels; i++) {
    channels.push(buffer.getChannelData(i));
  }

  let index = offset;
  for (let i = 0; i < length; i++) {
    for (let channel = 0; channel < numberOfChannels; channel++) {
      const channelData = channels[channel];
      const sample = Math.max(-1, Math.min(1, channelData?.[i] ?? 0));
      const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
      view.setInt16(index, intSample, true);
      index += 2;
    }
  }

  return new Blob([arrayBuffer], { type: "audio/wav" });
}

/**
 * Write a string to a DataView at a specific offset
 */
function writeString(view: DataView, offset: number, string: string): void {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

/**
 * Download a blob as a file
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Keep exportToMP3 as an alias for backward compatibility
export const exportToMP3 = exportToWAV;
