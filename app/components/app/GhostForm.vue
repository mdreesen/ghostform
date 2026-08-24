<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { leadData } from '~/utils/users/useLead';
import { useImageCompression } from '~/composables/useImageCompression';
import { errors } from '~/lib/errors';
import { useQuestions } from '~/composables/useQuestions';
import { useFormOffline } from '~/composables/useOffline';
import { useFormConfig } from '~/composables/useFormConfig';
import { validateField, isRequired, inputAttrs } from '~/utils/validation';
// Example configured link:
// /?category=realtor&source=default&id=<userId>&company_name=<hash>&company_email=<hash>&calendar=<url>&background_color=#09090B&font_color=#FFFFFF
// http://localhost:3000/?category=realtor&source=default&id=6a037a5ef945b9b2ca73a93d&company_name=$2b$15$eXsdK5TP.TC/M8QXsUuwh.bddChSOn8vckNGoWzXljfIktJ9Zs80y&company_email=$2b$15$8kJfxGFr8anR5xLRxFSIeO8KnG2zH4asf27ZpRjz1X6xhFcmFORCq&calendar=https://calendly.com/whiteravendev90/30min&background_color=#09090B&font_color=#FFFFFF

const props = defineProps({
  routeData: {
    type: Object,
    required: true,
  },
})

// Resolve config from the URL, or fall back to what we saved on a previous
// online visit. This is what lets the form open with NO query params at all —
// from a home-screen icon, or offline where the link can't be re-fetched.
const { resolveConfig } = useFormConfig();
const { config } = resolveConfig(props.routeData);
console.log(props.routeData)
const notConfigured = computed(() => !config);

const category = config?.category ?? 'realtor';
const source = config?.source ?? 'default';
const id = config?.id ?? '';
const company_name = config?.company_name ?? '';
const company_email = config?.company_email ?? '';
const seen_at = config?.seen_at ?? '';
const calendar = config?.calendar;
const use_image_upload = config?.use_image_upload;
const step = ref(0);
const answers = ref(leadData(category).data);
const company = ref({ category: category, id: id, company_name: company_name, company_email: company_email });
const loading = ref(false);
const setError = ref('')
const aiResult = ref<any>(null);
const useUploadImage = ref(false);
const selectedFile = ref<File | null>(null);
const userEmail = ref('');
const showSuccess = ref(false);

// Modern Network Connection Listener 
const isOnline = ref(true)
const { stageFormOffline, processOfflineQueue } = useFormOffline()

function checkNetwork() {
  isOnline.value = navigator.onLine
  if (isOnline.value) {
    processOfflineQueue() // Instantly attempt to fire queued requests on link up
  }
}

onMounted(() => {
  if (process.client) {
    isOnline.value = navigator.onLine
    window.addEventListener('online', checkNetwork)
    window.addEventListener('offline', checkNetwork)

    // Initial clean sweep run on load context
    if (isOnline.value) processOfflineQueue()
  }
})

onBeforeUnmount(() => {
  if (process.client) {
    window.removeEventListener('online', checkNetwork)
    window.removeEventListener('offline', checkNetwork)
  }
})

const questions = computed(() => useQuestions(source));

const handleImageSelection = async (file: File) => {
  loading.value = true;
  try {
    const compressed = await useImageCompression(file);
    selectedFile.value = compressed as File;
  } catch (err) {
    console.error("Compression failed, using original file", err);
    selectedFile.value = file;
  } finally {
    loading.value = false;
  }
};

const useFile = computed(() => selectedFile.value);

const backStep = () => {
  if (step.value >= 1) step.value--;
}

// Inline validation for the CURRENT step. The lead is stopped here rather than
// at submit — failing at the end, after they've answered everything, is the
// worst place to fail.
const fieldError = ref('');
const touched = ref(false);

const currentField = computed(() => questions?.value?.[step.value]);
const currentValue = computed(() => answers.value[currentField.value?.id]);
const currentRequired = computed(() => isRequired(currentField.value?.id));

// Live-check once they've attempted to move on, so the error clears as they fix
// it rather than nagging while they're still typing the first character.
watch(currentValue, () => {
  if (!touched.value) return;
  const res = validateField(currentField.value?.id, currentValue.value);
  fieldError.value = res.valid ? '' : (res.message || '');
});

// Reset per-step state when the question changes.
watch(step, () => {
  fieldError.value = '';
  touched.value = false;
});

const nextStep = () => {
  const field = currentField.value;
  const result = validateField(field?.id, answers.value[field?.id]);

  if (!result.valid) {
    touched.value = true;
    fieldError.value = result.message || 'Please check this.';
    // Put focus back so they can correct it without hunting for the field.
    nextTick(() => {
      const el = document.getElementById(field?.id) as HTMLInputElement | null;
      el?.focus();
    });
    return;
  }

  fieldError.value = '';
  touched.value = false;

  if (step.value < questions?.value?.length - 1) step.value++
  else submitForm()
}

const submitForm = async () => {
  loading.value = true
  setError.value = ''

  // 📵 INTERCEPT & LOG LOCALLY IF DEVICE IS OFFLINE
  if (!navigator.onLine) {
    const stagedSuccess = await stageFormOffline(category, answers.value, company.value, useFile.value)
    if (stagedSuccess) {
      userEmail.value = answers.value.email || 'your registered address';

      // Build out a synthetic success notification so the user experience doesn't break
      aiResult.value = { offline: true, message: "Cached successfully" }
      showSuccess.value = true

      setTimeout(() => {
        answers.value = leadData(category).data;
        selectedFile.value = null;
        useUploadImage.value = false;
        step.value = 0;

        aiResult.value = null;
        showSuccess.value = false;
      }, 5000);

    } else {
      setError.value = "Local cache registration broken."
    }
    loading.value = false
    return
  }

  try {
    const fd = new FormData();
    const jsonLeadBlob = new Blob([JSON.stringify({ ...answers.value, category: category, source: config?.source, seen_at: seen_at })], {
      type: 'application/json'
    });
    const jsonCompanyBlob = new Blob([JSON.stringify(company.value)], {
      type: 'application/json'
    });

    fd.append('answers', jsonLeadBlob);
    fd.append('company', jsonCompanyBlob);

    if (useFile.value) {
      fd.append('image', useFile.value);
    };

    aiResult.value = await $fetch('/api/lead', {
      method: 'POST',
      body: fd
    });

    userEmail.value = answers.value.email;
    showSuccess.value = true;
  } catch (error: any) {
    console.log(error);
    setError.value = error.message;
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="w-full max-w-[440px] mx-auto px-6 py-8 font-sans">

    <!-- First-ever open with no link and nothing saved: we genuinely can't
             tell which realtor this lead belongs to, so say so plainly rather
             than collecting a lead we'd have to throw away. -->
    <div v-if="notConfigured" class="text-center py-10">
      <p class="gf-display text-[26px] mb-3">This form isn't set up yet</p>
      <p class="text-[14px] leading-relaxed" style="color: var(--gf-muted)">
        Open your GhostForm link once while you have signal. After that it
        works offline, and you can add it to your home screen.
      </p>
    </div>

    <div v-else-if="!aiResult">

      <!-- Connection state. Shown BEFORE signal is lost so the realtor
                 trusts that a capture will survive a dead zone. -->
      <div class="flex items-center gap-2.5 mb-8">
        <span class="gf-eyebrow" style="color: var(--gf-muted)">
          <template v-if="!isOnline">
            <span class="w-1.5 h-1.5 rounded-full shrink-0"
              :style="{ background: isOnline ? 'var(--gf-accent)' : 'var(--gf-muted)' }" />
            <span>Offline — saved and sent when signal returns</span>
          </template>
        </span>
      </div>

      <!-- Progress: a counter plus a hairline rule. Reads as an
                 ordered document rather than a loading bar. -->
      <div class="flex items-baseline justify-between mb-3">
        <span class="gf-eyebrow" style="color: var(--gf-muted)">
          {{ String(step + 1).padStart(2, '0') }} — {{ String(questions?.length || 0).padStart(2, '0') }}
        </span>
        <span class="gf-eyebrow" style="color: var(--gf-muted)">
          {{ Math.round(((step + 1) / (questions?.length || 1)) * 100) }}%
        </span>
      </div>
      <div class="h-px w-full mb-10" style="background: var(--gf-hair)">
        <div class="h-px transition-all duration-500 ease-out"
          :style="{ width: `${((step + 1) / (questions?.length || 1)) * 100}%`, background: 'var(--gf-accent)' }" />
      </div>

      <!-- The question -->
      <transition name="fade" mode="out-in">
        <div :key="step">
          <label :for="questions[step]?.id" class="gf-display block text-[27px] leading-[1.2] mb-2">
            {{ questions[step]?.label }}
          </label>

          <!-- Say up front which answers are needed, rather than
                         only revealing it when they try to move on. -->
          <p class="gf-eyebrow mb-6" style="color: var(--gf-muted)">
            {{ currentRequired ? 'Required' : 'Optional — skip if you like' }}
          </p>

          <input :id="questions[step]?.id" v-model="answers[questions[step]?.id]"
            v-bind="inputAttrs(questions[step]?.id, questions[step]?.type) as Record<string, unknown>"
            :name="questions[step]?.id"
            :aria-invalid="Boolean(fieldError)"
            :aria-describedby="fieldError ? `${questions[step]?.id}-error` : undefined" class="gf-input"
            :style="fieldError ? { borderBottomColor: 'var(--gf-accent)' } : undefined" autofocus
            @keyup.enter="nextStep" />

          <!-- Inline, directly under the field it refers to -->
          <p v-if="fieldError" :id="`${questions[step]?.id}-error`" class="text-[13px] mt-3 leading-relaxed"
            style="color: var(--gf-accent)" role="alert">
            {{ fieldError }}
          </p>
        </div>
      </transition>

      <baseLoading v-if="loading" class="z-10" />

      <!-- Actions -->
      <div class="mt-10">
        <div class="flex items-center gap-3">
          <button v-if="step > 0"
            class="px-5 py-3.5 text-[11px] uppercase tracking-[0.12em] font-semibold transition-colors"
            style="border: 1px solid var(--gf-hair); color: var(--gf-muted)" @click="backStep">
            Back
          </button>

          <button
            class="flex-1 px-6 py-3.5 text-[11px] uppercase tracking-[0.12em] font-semibold transition-opacity hover:opacity-90"
            :style="{ background: 'var(--gf-accent)', color: 'var(--gf-bg)' }" @click="nextStep">
            {{ step === questions?.length - 1 ? 'Send it' : 'Next' }}
          </button>
        </div>

        <button v-if="use_image_upload" class="mt-4 gf-eyebrow transition-opacity hover:opacity-70"
          style="color: var(--gf-muted)" @click="useUploadImage = !useUploadImage">
          {{ useUploadImage ? '— Cancel upload' : '+ Add a photo' }}
        </button>

        <div v-if="useUploadImage" class="mt-5">
          <appImageUpload @file-selected="handleImageSelection" />
        </div>
      </div>

      <div v-if="setError" class="mt-6">
        <baseError :message="errors(setError)" />
      </div>
    </div>

    <div v-else>
      <appSuccess :show="showSuccess" :email="userEmail" :calendar="calendar" />
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>