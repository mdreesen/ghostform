<script setup lang="ts">
defineProps<{
  message: string | null;
}>();
</script>

<template>
  <Transition name="shake">
    <div 
      v-if="message" 
      class="flex items-center gap-3 p-4 mb-6 rounded-2xl bg-red-500/10 border border-red-500/20 backdrop-blur-md"
    >
      <div class="shrink-0 w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-400">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      </div>
      <p class="text-sm font-medium text-red-200/80 leading-tight">
        {{ message }}
      </p>
    </div>
  </Transition>
</template>

<style scoped>
/* The "Spectral Shake" - subtle vibration when it appears */
.shake-enter-active {
  animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
  transform: translate3d(0, 0, 0);
}

@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
  40%, 60% { transform: translate3d(4px, 0, 0); }
}

.shake-leave-active {
  transition: all 0.3s ease;
}

.shake-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>