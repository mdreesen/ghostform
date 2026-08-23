<script setup lang="ts">
definePageMeta({
  layout: 'default'
});

const route = useRoute();
const formId = route.params.id;

/**
 * Two modes on this one route:
 *   - normal capture (open house / listing / quick entry)
 *   - source=qualify&t=<token> — the deep-dive questionnaire sent to a lead
 *     who's getting serious. Different audience, different question set, and
 *     it UPDATES an existing lead rather than creating one.
 */
const qualifyToken = computed(() => String(route.query.t || ''));
const isQualify = computed(() =>
  String(route.query.source || '') === 'qualify' && qualifyToken.value.length > 0
);


// We use an IntersectionObserver or ResizeObserver 
// to tell the parent site exactly how tall we are.
onMounted(() => {
  const resizeObserver = new ResizeObserver((entries) => {
    for (let entry of entries) {
      const height = entry.target.scrollHeight;
      // Send the "Spectral Signal" to the parent window
      window.parent.postMessage({
        type: 'resize',
        height: height
      }, '*');
    }
  });

  resizeObserver.observe(document.body);
});
</script>

<template>
  <Transition name="ghost-modal">
    <appQualify v-if="isQualify" :token="qualifyToken" />
    <appGhostForm v-else :routeData="route.query" :id="formId" />
  </Transition>
</template>

<style scoped>
.ghost-modal-enter-active,
.ghost-modal-leave-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.ghost-modal-enter-from,
.ghost-modal-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(20px);
}
</style>