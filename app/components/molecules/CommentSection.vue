<template>
  <div class="space-y-4">
    <!-- Comment Form -->
    <div class="space-y-2">
      <FormTextarea
        v-model="newComment"
        label="Comment"
        placeholder="Write a comment..."
        :rows="3"
        :maxlength="500" />
      <div class="flex justify-between items-center">
        <span class="text-xs text-gray-500"> {{ newComment.length }}/500 </span>
        <UButton
          @click="submitComment"
          :disabled="!newComment.trim() || submitting"
          size="sm">
          <AppSpinner v-if="submitting" class="mr-2" size="sm" />
          Post Comment
        </UButton>
      </div>
    </div>

    <!-- Comments List -->
    <div v-if="loading" class="flex justify-center py-8">
      <AppSpinner size="lg" />
    </div>

    <div
      v-else-if="comments.length === 0"
      class="text-center py-8 text-gray-500">
      No comments yet. Be the first to comment!
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="comment in comments"
        :key="comment.id"
        class="flex gap-3 p-3 rounded-lg bg-gray-50">
        <UAvatar :name="comment.username" size="sm" />
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-2">
              <span class="font-medium text-sm">{{ comment.username }}</span>
              <span class="text-xs text-gray-500">
                {{ formatDate(comment.createdAt) }}
              </span>
            </div>
            <button
              v-if="canDelete(comment)"
              @click="handleDelete(comment.id)"
              :disabled="deleting === comment.id"
              class="text-red-500 hover:text-red-700 text-sm">
              <Icon name="heroicons:trash" class="w-4 h-4" />
            </button>
          </div>
          <p class="text-sm text-gray-700 mt-1 break-words">
            {{ comment.content }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { Comment } from "~/types/social";

interface Props {
  trackId: string;
}

const props = defineProps<Props>();

const { addComment, getComments, deleteComment } = useSocialApi();
const toast = useToast();
const authStore = useAuthStore();

const comments = ref<Comment[]>([]);
const newComment = ref("");
const loading = ref(false);
const submitting = ref(false);
const deleting = ref<string | null>(null);

onMounted(async () => {
  await loadComments();
});

const loadComments = async () => {
  try {
    loading.value = true;
    comments.value = await getComments(props.trackId);
  } catch (error) {
    console.error("Failed to load comments:", error);
    toast.add({
      title: "Error",
      description: "Failed to load comments",
      color: "error",
    });
  } finally {
    loading.value = false;
  }
};

const submitComment = async () => {
  if (!newComment.value.trim()) return;

  try {
    submitting.value = true;
    const comment = await addComment(props.trackId, {
      content: newComment.value.trim(),
    });
    comments.value.unshift(comment);
    newComment.value = "";
    toast.add({
      title: "Success",
      description: "Comment posted successfully",
      color: "success",
    });
  } catch (error) {
    console.error("Failed to post comment:", error);
    toast.add({
      title: "Error",
      description: "Failed to post comment",
      color: "error",
    });
  } finally {
    submitting.value = false;
  }
};

const handleDelete = async (commentId: string) => {
  try {
    deleting.value = commentId;
    await deleteComment(commentId);
    comments.value = comments.value.filter((c) => c.id !== commentId);
    toast.add({
      title: "Success",
      description: "Comment deleted successfully",
      color: "success",
    });
  } catch (error) {
    console.error("Failed to delete comment:", error);
    toast.add({
      title: "Error",
      description: "Failed to delete comment",
      color: "error",
    });
  } finally {
    deleting.value = null;
  }
};

const canDelete = (comment: Comment): boolean => {
  return comment.userId === authStore.user?.id;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
};
</script>
