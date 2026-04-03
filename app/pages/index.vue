<script setup lang="ts">
definePageMeta({
  layout: 'default'
});

const route = useRoute();
const formId = route.params.id;


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
    <div class="fixed inset-0 z-100 flex items-center justify-center p-6 bg-transparent">
      <Transition name="ghost-modal">

      <appForm :routeData="route.query" :id="formId" />
    </Transition>

  </div>
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