<script setup lang="ts">
const fileInput = ref<HTMLInputElement | null>(null);
const previewUrl = ref<string | null>(null);
const isUploading = ref(false);
const analysis = ref<string | null>(null);

const emit = defineEmits<{
  (e: 'file-selected', file: File): void
}>();

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]

  if (file) {
    // 1. Create a local preview for the UI
    previewUrl.value = URL.createObjectURL(file)

    // 2. Pass the raw file up to the parent
    emit('file-selected', file)
  }
};
</script>

<template>
  <div class="w-full space-y-5">
    <div @click="fileInput?.click()"
      class="group relative p-7 text-center cursor-pointer transition-colors" style="border: 1px dashed var(--gf-hair)">
      <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleFileChange" />

      <div v-if="!previewUrl" class="space-y-2">
        <div class="text-4xl">
        </div>
        <p class="text-[15px]" style="color: var(--gf-fg)">Add a photo</p>
        <p class="text-[12.5px] mt-1" style="color: var(--gf-muted)">Tap to choose one</p>
      </div>

      <img v-else :src="previewUrl" class="mx-auto max-h-36 object-contain" />


      <baseLoading v-if="isUploading" />
    </div>

    <transition name="fade">
      <div v-if="analysis" class="p-6" style="border: 1px solid var(--gf-hair)">
        <h3 class="gf-eyebrow mb-3 flex items-center gap-2" style="color: var(--gf-accent)">
          <span>✨</span> Ghost AI Analysis
        </h3>
        <p class="text-[14px] leading-relaxed" style="color: var(--gf-fg)">{{ analysis }}</p>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>