import * as Tone from "tone";
import lamejs from "lamejs";

interface ExportOptions {
  duration: number; // Duration in seconds
  sampleRate?: number;
}

/**
 * Export Tone.js composition to MP3 using offline rendering and lamejs encoding
 */
export async function exportToMP3(
  exportFunction: () => Promise<void>,
  options: ExportOptions
): Promise<Blob> {
  const { duration, sampleRate = 44100 } = options;

  try {
    // Render audio offline
    const buffer = await Tone.Offline(async () => {
      await exportFunction();
    }, duration);

    // Convert Tone.js buffer to WAV-like PCM data
    const channels = buffer.numberOfChannels;
    const length = buffer.length;
    const channelData: Float32Array[] = [];

    for (let i = 0; i < channels; i++) {
      channelData.push(buffer.getChannelData(i));
    }

    // Convert float samples to 16-bit PCM
    const samples = new Int16Array(length * channels);
    for (let i = 0; i < length; i++) {
      for (let ch = 0; ch < channels; ch++) {
        const channelArray = channelData[ch];
        if (!channelArray) continue;
        const value = channelArray[i];
        if (value === undefined) continue;
        const sample = Math.max(-1, Math.min(1, value));
        samples[i * channels + ch] =
          sample < 0 ? sample * 0x8000 : sample * 0x7fff;
      }
    }

    // Encode to MP3 using lamejs
    const mp3encoder = new lamejs.Mp3Encoder(channels, sampleRate, 128);
    const mp3Data: Uint8Array[] = [];

    const sampleBlockSize = 1152; // Must be multiple of 576
    for (let i = 0; i < samples.length; i += sampleBlockSize * channels) {
      const leftChannel = new Int16Array(sampleBlockSize);
      const rightChannel =
        channels > 1 ? new Int16Array(sampleBlockSize) : undefined;

      for (let j = 0; j < sampleBlockSize; j++) {
        const index = i + j * channels;
        if (index < samples.length) {
          const leftValue = samples[index];
          if (leftValue !== undefined) {
            leftChannel[j] = leftValue;
          }
          if (rightChannel && index + 1 < samples.length) {
            const rightValue = samples[index + 1];
            if (rightValue !== undefined) {
              rightChannel[j] = rightValue;
            }
          }
        }
      }

      const mp3buf = mp3encoder.encodeBuffer(
        leftChannel,
        rightChannel || leftChannel
      );
      if (mp3buf.length > 0) {
        mp3Data.push(mp3buf);
      }
    }

    // Flush remaining data
    const mp3buf = mp3encoder.flush();
    if (mp3buf.length > 0) {
      mp3Data.push(mp3buf);
    }

    // Combine all MP3 buffers
    const totalLength = mp3Data.reduce((sum, buf) => sum + buf.length, 0);
    const combinedBuffer = new Uint8Array(totalLength);
    let offset = 0;
    for (const buf of mp3Data) {
      combinedBuffer.set(buf, offset);
      offset += buf.length;
    }

    return new Blob([combinedBuffer], { type: "audio/mpeg" });
  } catch (error) {
    console.error("Failed to export to MP3:", error);
    throw new Error("MP3 export failed");
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
