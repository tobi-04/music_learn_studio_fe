<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <UContainer>
      <div class="py-8 space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold">My Compositions</h1>
            <p class="text-gray-600 dark:text-gray-400">
              Manage your drafts and published works
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
            <UButton color="primary" icon="i-lucide-plus" to="/music/studio">
              Create New
            </UButton>
          </div>
        </div>

        <!-- Tabs -->
        <ClientOnly>
          <UTabs :items="tabs" class="w-full">
            <!-- Drafts Tab -->
            <template #drafts>
              <div class="space-y-4">
                <div v-if="loadingDrafts" class="text-center py-8">
                  <div
                    class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
                </div>
                <div
                  v-else-if="drafts.length === 0"
                  class="text-center py-12 text-gray-500">
                  <div class="text-6xl mb-4">📝</div>
                  <p>No drafts yet</p>
                  <p class="text-sm mt-2">
                    Create your first composition in the studio
                  </p>
                </div>
                <div
                  v-else
                  class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <CompositionCard
                    v-for="comp in drafts"
                    :key="comp.id"
                    :composition="comp"
                    @edit="editComposition"
                    @delete="handleDelete"
                    @duplicate="handleDuplicate" />
                </div>
              </div>
            </template>

            <!-- Published Tab -->
            <template #published>
              <div class="space-y-4">
                <div v-if="loadingPublished" class="text-center py-8">
                  <div
                    class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
                </div>
                <div
                  v-else-if="published.length === 0"
                  class="text-center py-12 text-gray-500">
                  <div class="text-6xl mb-4">🎵</div>
                  <p>No published compositions yet</p>
                  <p class="text-sm mt-2">
                    Finish and publish your drafts to see them here
                  </p>
                </div>
                <div
                  v-else
                  class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <CompositionCard
                    v-for="comp in published"
                    :key="comp.id"
                    :composition="comp"
                    :show-play="true"
                    @edit="editComposition"
                    @delete="handleDelete"
                    @duplicate="handleDuplicate" />
                </div>
              </div>
            </template>

            <!-- All Tab -->
            <template #all>
              <div class="space-y-4">
                <div v-if="loadingAll" class="text-center py-8">
                  <div
                    class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
                </div>
                <div
                  v-else-if="allCompositions.length === 0"
                  class="text-center py-12 text-gray-500">
                  <div class="text-6xl mb-4">🎼</div>
                  <p>No compositions yet</p>
                  <p class="text-sm mt-2">Start creating in the studio</p>
                </div>
                <div
                  v-else
                  class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <CompositionCard
                    v-for="comp in allCompositions"
                    :key="comp.id"
                    :composition="comp"
                    :show-play="comp.status === 'PUBLISHED'"
                    @edit="editComposition"
                    @delete="handleDelete"
                    @duplicate="handleDuplicate" />
                </div>
              </div>
            </template>
          </UTabs>
        </ClientOnly>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { MusicComposition } from "~/types";
import { useCompositionApi } from "~/composables/api/useCompositionApi";

const router = useRouter();
const {
  getMyDrafts,
  getMyPublished,
  getMyCompositions,
  deleteComposition,
  duplicateComposition,
} = useCompositionApi();
const confirmDialog = useConfirmDialog();

const drafts = ref<MusicComposition[]>([]);
const published = ref<MusicComposition[]>([]);
const allCompositions = ref<MusicComposition[]>([]);

const loadingDrafts = ref(false);
const loadingPublished = ref(false);
const loadingAll = ref(false);

const tabs = [
  {
    key: "drafts",
    label: "Drafts",
    icon: "i-lucide-file-text",
    slot: "drafts",
  },
  {
    key: "published",
    label: "Published",
    icon: "i-lucide-check-circle",
    slot: "published",
  },
  { key: "all", label: "All", icon: "i-lucide-list", slot: "all" },
];

onMounted(() => {
  loadDrafts();
  loadPublished();
  loadAll();
});

async function loadDrafts() {
  loadingDrafts.value = true;
  try {
    drafts.value = await getMyDrafts();
  } catch (error) {
    console.error("Failed to load drafts:", error);
  } finally {
    loadingDrafts.value = false;
  }
}

async function loadPublished() {
  loadingPublished.value = true;
  try {
    published.value = await getMyPublished();
  } catch (error) {
    console.error("Failed to load published compositions:", error);
  } finally {
    loadingPublished.value = false;
  }
}

async function loadAll() {
  loadingAll.value = true;
  try {
    allCompositions.value = await getMyCompositions();
  } catch (error) {
    console.error("Failed to load all compositions:", error);
  } finally {
    loadingAll.value = false;
  }
}

function editComposition(compositionId: string) {
  router.push(`/music/studio?id=${compositionId}`);
}

async function handleDelete(compositionId: string) {
  confirmDialog.open({
    title: "Delete Composition?",
    description:
      "Are you sure you want to delete this composition? This action cannot be undone.",
    confirmLabel: "Delete",
    cancelLabel: "Cancel",
    color: "error",
    onConfirm: async () => {
      try {
        await deleteComposition(compositionId);
        // Refresh lists
        loadDrafts();
        loadPublished();
        loadAll();
      } catch (error) {
        console.error("Failed to delete composition:", error);
        alert("Failed to delete composition");
      }
    },
  });
}

async function handleDuplicate(compositionId: string) {
  confirmDialog.open({
    title: "Duplicate Composition?",
    description: "A copy will be created as a new draft.",
    confirmLabel: "Duplicate",
    cancelLabel: "Cancel",
    color: "primary",
    onConfirm: async () => {
      try {
        await duplicateComposition(compositionId);
        loadDrafts();
        loadAll();
      } catch (error) {
        console.error("Failed to duplicate composition:", error);
        alert("Failed to duplicate composition");
      }
    },
  });
}
</script>
