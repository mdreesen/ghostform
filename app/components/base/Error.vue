<script setup lang="ts">
defineProps<{ message: string | null }>();
</script>

<template>
  <Transition name="gf-error">
    <div
      v-if="message"
      class="flex items-start gap-3 p-4"
      style="border-left: 2px solid var(--gf-accent); background: color-mix(in srgb, var(--gf-accent) 8%, transparent)"
      role="alert"
    >
      <p class="text-[13.5px] leading-relaxed" :style="{ color: 'var(--gf-fg)' }">
        {{ message }}
      </p>
    </div>
  </Transition>
</template>

<style scoped>
/* A short settle rather than a shake — an error on a lead-facing form should
   read as a correction, not an alarm. */
.gf-error-enter-active { transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.gf-error-enter-from { opacity: 0; transform: translateY(-4px); }
.gf-error-leave-active { transition: all 0.2s ease; }
.gf-error-leave-to { opacity: 0; }
</style>
