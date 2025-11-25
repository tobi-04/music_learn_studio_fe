import { defineStore } from "pinia";
import type { Component } from "vue";

interface ModalState {
  isOpen: boolean;
  component: Component | null;
  props: Record<string, any>;
}

export const useModalStore = defineStore("modal", () => {
  const isOpen = ref(false);
  const component = shallowRef<Component | null>(null);
  const props = ref<Record<string, any>>({});

  const open = (comp: Component, p: Record<string, any> = {}) => {
    component.value = comp;
    props.value = p;
    isOpen.value = true;
  };

  const close = () => {
    isOpen.value = false;
    setTimeout(() => {
      component.value = null;
      props.value = {};
    }, 200); // Clear after animation
  };

  return {
    isOpen,
    component,
    props,
    open,
    close,
  };
});
