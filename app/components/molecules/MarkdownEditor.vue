<template>
  <div class="border rounded-lg border-muted">
    <div v-if="editor" class="flex flex-wrap gap-1">
      <div class="flex items-center gap-1 border-b border-muted w-full p-2">
        <UButton
          icon="i-heroicons-bold"
          :color="editor.isActive('bold') ? 'primary' : 'secondary'"
          variant="ghost"
          size="sm"
          @click="editor.chain().focus().toggleBold().run()" />
        <UButton
          icon="i-heroicons-italic"
          :color="editor.isActive('italic') ? 'primary' : 'secondary'"
          variant="ghost"
          size="sm"
          @click="editor.chain().focus().toggleItalic().run()" />
        <UButton
          icon="i-heroicons-list-bullet"
          :color="editor.isActive('bulletList') ? 'primary' : 'secondary'"
          variant="ghost"
          size="sm"
          @click="editor.chain().focus().toggleBulletList().run()" />
        <UButton
          icon="i-heroicons-list-bullet-20-solid"
          :color="editor.isActive('orderedList') ? 'primary' : 'secondary'"
          variant="ghost"
          size="sm"
          @click="editor.chain().focus().toggleOrderedList().run()" />
        <UButton
          icon="i-heroicons-link"
          :color="editor.isActive('link') ? 'primary' : 'secondary'"
          variant="ghost"
          size="sm"
          @click="setLink" />
      </div>
    </div>

    <EditorContent :editor="editor" class="editor-content" />
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";

const props = defineProps<{
  modelValue: string;
  placeholder?: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

const editor = useEditor({
  extensions: [
    StarterKit,
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: "text-primary underline",
      },
    }),
  ],
  content: props.modelValue,
  editorProps: {
    attributes: {
      class:
        "prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[200px] px-4 py-3",
    },
  },
  onUpdate: ({ editor }) => {
    const html = editor.getHTML();
    emit("update:modelValue", html);
  },
});

const setLink = () => {
  const previousUrl = editor.value?.getAttributes("link").href;
  const url = window.prompt("Nhập liên kết (URL)", previousUrl);

  if (url === null) {
    return;
  }

  if (url === "") {
    editor.value?.chain().focus().extendMarkRange("link").unsetLink().run();
    return;
  }

  editor.value
    ?.chain()
    .focus()
    .extendMarkRange("link")
    .setLink({ href: url })
    .run();
};

watch(
  () => props.modelValue,
  (value) => {
    const isSame = editor.value?.getHTML() === value;
    if (isSame) {
      return;
    }
    editor.value?.commands.setContent(value, false);
  }
);

onBeforeUnmount(() => {
  editor.value?.destroy();
});
</script>

<style scoped>
:global(.dark) .markdown-editor {
  border-color: rgb(55 65 81); /* dark:border-gray-700 */
  background-color: rgb(17 24 39); /* dark:bg-gray-900 */
}

:global(.dark) .editor-toolbar {
  border-color: rgb(55 65 81); /* dark:border-gray-700 */
  background-color: rgb(31 41 55); /* dark:bg-gray-800 */
}

.editor-content {
  min-height: 200px;
}

:deep(.ProseMirror) {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

:deep(.ProseMirror p.is-editor-empty:first-child::before) {
  content: attr(data-placeholder);
  color: rgb(156 163 175); /* text-gray-400 */
  float: left;
  height: 0;
  pointer-events: none;
}
</style>
