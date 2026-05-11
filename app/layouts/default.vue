<script setup lang="ts">
const route = useRoute();
const { background_color, font_color } = route.query;

// Application design
const useBackgroundColor = computed(() => background_color ? `#${background_color.toString()}` : '#0f0b0b');
const useFontColor = computed(() => font_color ? `#${font_color.toString()}` : 'white');

useHead({
  htmlAttrs: {
    style: `--backgroundColor: ${useBackgroundColor.value}; --font-color: ${useFontColor.value};`
  }
});
</script>

<template>
  <div class="flex justify-center h-full w-full">
    <slot />
  </div>
</template>

<style>
html {
  --ui-bg: var(--backgroundColor);
  --ui-text: var(--font-color);
}
</style>