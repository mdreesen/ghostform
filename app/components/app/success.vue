<script setup lang="ts">
import confetti from 'canvas-confetti';

const props = defineProps({
    show: {
        type: Boolean,
        required: true,
    },
    email: {
        type: String,
        default: '',
    },
    company: {
        type: String,
        default: '',
    },
})

const emit = defineEmits(['close']);

// Trigger confetti when the modal opens
watch(() => props.show, (newVal) => {
  if (newVal) {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00F2FF', '#7000FF', '#ffffff']
    });
  }
});
</script>

<template>
  <Transition name="ghost-modal">
    <div class="fixed inset-0 z-100 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
      <div class="relative max-w-sm w-full bg-zinc-900 border border-white/10 p-8 rounded-[2.5rem] text-center shadow-2xl">
        
        <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-cyan-500/20 blur-2xl rounded-full"></div>
        
        <div class="relative w-20 h-20 bg-linear-to-br from-cyan-400 to-blue-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg rotate-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
        </div>

        <h3 class="text-2xl font-black mb-2">Submission Sent!</h3>
        <p class="text-zinc-400 text-sm mb-8 leading-relaxed">
          Your inquiry has been sent {{ company ? `to ${company}` : '' }}. We've sent a confirmation to <span class="text-cyan-400 font-bold">{{ email }}</span>.
        </p>
      </div>
    </div>
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