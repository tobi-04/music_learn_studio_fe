<template>
  <div class="flex items-center gap-4">
    <button
      @click="handleToggle"
      :disabled="loading"
      class="flex items-center gap-1 transition-colors"
      :class="{
        'text-red-500': liked,
        'text-gray-500 hover:text-red-500': !liked,
      }">
      <Icon
        :name="liked ? 'heroicons:heart-solid' : 'heroicons:heart'"
        class="w-5 h-5" />
      <span class="text-sm font-medium">{{ likeCount }}</span>
    </button>

    <button
      v-if="showComments"
      @click="emit('toggle-comments')"
      class="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors">
      <Icon name="heroicons:chat-bubble-left" class="w-5 h-5" />
      <span class="text-sm font-medium">{{ commentCount }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

interface Props {
  trackId: string;
  showComments?: boolean;
  commentCount?: number;
}

const props = withDefaults(defineProps<Props>(), {
  showComments: true,
  commentCount: 0,
});

const emit = defineEmits<{
  "toggle-comments": [];
}>();

const { toggleLike, getLikeStatus } = useSocialApi();
const toast = useToast();

const liked = ref(false);
const likeCount = ref(0);
const loading = ref(false);

onMounted(async () => {
  await loadLikeStatus();
});

const loadLikeStatus = async () => {
  try {
    const status = await getLikeStatus(props.trackId);
    liked.value = status.liked;
    likeCount.value = status.likeCount;
  } catch (error) {
    console.error("Failed to load like status:", error);
  }
};

const handleToggle = async () => {
  if (loading.value) return;

  try {
    loading.value = true;
    const status = await toggleLike(props.trackId);
    liked.value = status.liked;
    likeCount.value = status.likeCount;
  } catch (error) {
    console.error("Failed to toggle like:", error);
    toast.add({
      title: "Error",
      description: "Failed to update like",
      color: "error",
    });
  } finally {
    loading.value = false;
  }
};
</script>
