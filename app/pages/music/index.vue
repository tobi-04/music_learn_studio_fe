<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <UContainer>
      <div class="py-8 space-y-8">
        <!-- Header -->
        <div class="text-center space-y-2">
          <h1 class="text-4xl font-bold">Discover Music</h1>
          <p class="text-lg text-gray-600 dark:text-gray-400">
            Explore tracks from talented artists
          </p>
        </div>

        <!-- Tabs -->
        <UTabs :items="tabs" class="w-full">
          <!-- Trending Tab -->
          <template #trending>
            <div class="space-y-4">
              <!-- Genre Filter -->
              <div class="flex justify-end">
                <div class="w-48">
                  <USelect
                    v-model="selectedGenre"
                    :items="genreOptions"
                    placeholder="All Genres"
                    @change="loadTrendingTracks" />
                </div>
              </div>

              <div v-if="loadingTrending" class="text-center py-8">
                <div
                  class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
              </div>
              <div
                v-else-if="trendingTracks.length === 0"
                class="text-center py-8 text-gray-500">
                No trending tracks yet
              </div>
              <TrackFeed
                v-else
                title="Trending Now"
                description="Most popular tracks this week"
                :tracks="trendingTracks"
                :loading="loadingTrending"
                @play="playTrack" />
            </div>
          </template>

          <!-- Recent Tab -->
          <template #recent>
            <div class="space-y-4">
              <div v-if="loadingRecent" class="text-center py-8">
                <div
                  class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
              </div>
              <div
                v-else-if="recentTracks.length === 0"
                class="text-center py-8 text-gray-500">
                No listening history yet. Start playing some tracks!
              </div>
              <TrackFeed
                v-else
                title="Recently Listened"
                description="Your last 10 played tracks"
                :tracks="recentTracks"
                :loading="loadingRecent"
                @play="playTrack" />
            </div>
          </template>

          <!-- My Music Tab -->
          <template #my-music>
            <div class="space-y-4">
              <!-- Upload Button -->
              <div class="flex justify-end gap-2">
                <UButton
                  color="neutral"
                  variant="outline"
                  icon="i-lucide-mic"
                  to="/music/studio">
                  Open Studio
                </UButton>
                <UButton color="primary" @click="showUploadModal = true">
                  <Upload class="w-4 h-4 mr-2" />
                  Upload New Track
                </UButton>
              </div>

              <div v-if="loadingMyTracks" class="text-center py-8">
                <div
                  class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
              </div>
              <div
                v-else-if="myTracks.length === 0"
                class="text-center py-8 text-gray-500">
                You haven't uploaded any tracks yet. Click "Upload New Track" to
                get started!
              </div>
              <div v-else class="space-y-4">
                <h2 class="text-2xl font-bold">My Tracks</h2>
                <TrackFeed
                  :tracks="myTracks"
                  :loading="loadingMyTracks"
                  :show-delete="true"
                  @play="playTrack"
                  @delete="handleDeleteTrack" />
              </div>
            </div>
          </template>
        </UTabs>
      </div>

      <!-- Upload Modal -->
      <UModal v-model:open="showUploadModal">
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">Upload New Track</h3>
          </template>
          <MusicUploadForm
            @close="showUploadModal = false"
            @success="handleUploadSuccess" />
        </UCard>
      </UModal>

      <!-- Global Player (fixed bottom) -->
      <div
        v-if="currentTrack"
        class="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 z-50">
        <UContainer>
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-3 flex-1 min-w-0">
              <div
                class="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded shrink-0">
                <img
                  v-if="currentTrack.coverImageUrl"
                  :src="currentTrack.coverImageUrl"
                  :alt="currentTrack.title"
                  class="w-full h-full object-cover rounded" />
              </div>
              <div class="min-w-0 flex-1">
                <p class="font-medium truncate">{{ currentTrack.title }}</p>
                <p class="text-sm text-gray-500 truncate">
                  {{ currentTrack.username || "Artist" }}
                </p>
              </div>
            </div>

            <div class="flex-1 max-w-2xl">
              <TrackPlayer
                :is-playing="isPlaying"
                :is-liked="isLiked"
                :current-time="currentTime"
                :duration="currentTrack.duration * 60"
                @toggle-play="togglePlay"
                @toggle-like="toggleLike"
                @share="shareTrack" />
            </div>
          </div>
        </UContainer>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Upload } from "lucide-vue-next";
import type { MusicTrack } from "~/types/music";

const {
  getTrendingTracks,
  getMyTracks,
  getRecentTracks,
  recordListening,
  deleteTrack,
} = useMusicApi();

const tabs = [
  {
    key: "0",
    label: "Trending",
    icon: "i-lucide-trending-up",
    slot: "trending",
  },
  { key: "1", label: "Recent", icon: "i-lucide-clock", slot: "recent" },
  {
    key: "2",
    label: "My Music",
    icon: "i-lucide-music",
    slot: "my-music",
  },
];

const genreOptions = [
  { value: "all", label: "All Genres" },
  { value: "classical", label: "Classical" },
  { value: "jazz", label: "Jazz" },
  { value: "pop", label: "Pop" },
  { value: "rock", label: "Rock" },
  { value: "electronic", label: "Electronic" },
  { value: "hip-hop", label: "Hip-Hop" },
  { value: "indie", label: "Indie" },
  { value: "folk", label: "Folk" },
  { value: "blues", label: "Blues" },
  { value: "country", label: "Country" },
  { value: "metal", label: "Metal" },
  { value: "r&b", label: "R&B" },
];

const selectedGenre = ref("all");
const trendingTracks = ref<MusicTrack[]>([]);
const recentTracks = ref<MusicTrack[]>([]);
const myTracks = ref<MusicTrack[]>([]);
const loadingTrending = ref(false);
const loadingRecent = ref(false);
const loadingMyTracks = ref(false);

const showUploadModal = ref(false);
const currentTrack = ref<MusicTrack | null>(null);
const isPlaying = ref(false);
const isLiked = ref(false);
const currentTime = ref(0);

onMounted(() => {
  loadTrendingTracks();
  loadRecentTracks();
  loadMyTracks();
});

async function loadTrendingTracks() {
  loadingTrending.value = true;
  try {
    const genre =
      selectedGenre.value === "all" ? undefined : selectedGenre.value;
    trendingTracks.value = await getTrendingTracks(genre);
  } catch (error) {
    console.error("Failed to load trending tracks:", error);
  } finally {
    loadingTrending.value = false;
  }
}

async function loadRecentTracks() {
  loadingRecent.value = true;
  try {
    recentTracks.value = await getRecentTracks();
  } catch (error) {
    console.error("Failed to load recent tracks:", error);
  } finally {
    loadingRecent.value = false;
  }
}

async function loadMyTracks() {
  loadingMyTracks.value = true;
  try {
    myTracks.value = await getMyTracks();
  } catch (error) {
    console.error("Failed to load my tracks:", error);
  } finally {
    loadingMyTracks.value = false;
  }
}

async function playTrack(trackId: string) {
  const allTracks = [
    ...trendingTracks.value,
    ...recentTracks.value,
    ...myTracks.value,
  ];
  const track = allTracks.find((t) => t.id === trackId);

  if (track) {
    currentTrack.value = track;
    isPlaying.value = true;

    // Record listening event
    try {
      await recordListening(trackId);
      // Reload recent tracks to update the list
      loadRecentTracks();
    } catch (error) {
      console.error("Failed to record listening event:", error);
    }
  }
}

function togglePlay() {
  isPlaying.value = !isPlaying.value;
}

function toggleLike() {
  isLiked.value = !isLiked.value;
}

function shareTrack() {
  console.log("Share track");
}

async function handleDeleteTrack(trackId: string) {
  if (!confirm("Are you sure you want to delete this track?")) {
    return;
  }

  try {
    await deleteTrack(trackId);
    // Reload my tracks
    loadMyTracks();
    // Also reload trending in case it was there
    loadTrendingTracks();
  } catch (error) {
    console.error("Failed to delete track:", error);
    alert("Failed to delete track. Please try again.");
  }
}

function handleUploadSuccess() {
  // Reload my tracks after successful upload
  loadMyTracks();
  // Also reload trending
  loadTrendingTracks();
}
</script>
