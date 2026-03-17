<script setup lang="ts">
const route = useRoute();

useHead({
  meta: [{ property: 'og:title', content: `Ascend - ${route.meta.title}` }],
});
</script>

<template>
    <div>
        <slot />
    </div>
</template>