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
  <div class="max-w-xl mx-auto p-6 space-y-6">
    <div 
      @click="fileInput?.click()"
      class="group relative border-2 border-dashed border-zinc-800 rounded-2xl p-12 text-center hover:border-blue-500/50 transition-all cursor-pointer bg-zinc-900/50"
    >
      <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleFileChange" />
      
      <div v-if="!previewUrl" class="space-y-2">
        <div class="text-4xl">👻</div>
        <p class="text-zinc-400 font-medium text-lg">Drop your project photo here</p>
        <p class="text-zinc-600 text-sm italic">or click to browse</p>
      </div>

      <img v-else :src="previewUrl" class="mx-auto max-h-64 rounded-xl shadow-2xl" />
      

      <baseLoading v-if="isUploading" />
    </div>

    <transition name="fade">
      <div v-if="analysis" class="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-xl">
        <h3 class="text-blue-400 font-bold mb-3 flex items-center gap-2">
          <span>✨</span> Ghost AI Analysis
        </h3>
        <p class="text-zinc-300 leading-relaxed">{{ analysis }}</p>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: all 0.5s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(10px); }
</style>