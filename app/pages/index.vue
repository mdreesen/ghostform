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
  <div>
    <appForm :routeData="route.query" :id="formId" />
  </div>
</template>