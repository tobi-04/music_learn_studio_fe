<template>
  <div
    class="markdown-renderer prose dark:prose-invert max-w-none"
    v-html="sanitizedHtml" />
</template>

<script setup lang="ts">
import { marked } from "marked";
import DOMPurify from "dompurify";

const props = defineProps<{
  content: string;
}>();

const sanitizedHtml = computed(() => {
  if (!props.content) return "";

  // Convert markdown to HTML
  const rawHtml = marked(props.content);

  // Sanitize HTML to prevent XSS
  return DOMPurify.sanitize(rawHtml, {
    ALLOWED_TAGS: [
      "p",
      "br",
      "strong",
      "em",
      "u",
      "s",
      "del",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "ul",
      "ol",
      "li",
      "a",
      "code",
      "pre",
      "blockquote",
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
    ],
    ALLOWED_ATTR: ["href", "target", "rel", "class"],
  });
});
</script>

<style scoped>
.markdown-renderer {
  @apply text-gray-900 dark:text-gray-100;
}

.markdown-renderer :deep(a) {
  @apply text-primary hover:underline;
}

.markdown-renderer :deep(code) {
  @apply bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm;
}

.markdown-renderer :deep(pre) {
  @apply bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto;
}

.markdown-renderer :deep(blockquote) {
  @apply border-l-4 border-gray-300 dark:border-gray-700 pl-4 italic;
}
</style>
