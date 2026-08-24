<script setup lang="ts">
/**
 * QUALIFICATION QUESTIONNAIRE (lead-facing)
 *
 * Reached from an emailed link: /?source=qualify&t=<signed-token>
 *
 * Deliberately different from the open-house capture form. That one is short
 * because a stranger will abandon anything longer. This one is ~12 questions
 * because the person answering is actively working with an agent and has a
 * reason to be thorough.
 *
 * Everything here is SAME-ORIGIN. An earlier version fetched from the
 * dashboard, which required CORS and a preflight for no real benefit — both
 * apps already share one database, so this app can serve the questions and
 * write the answers itself.
 */
import { validateField } from '~/utils/validation'

const props = defineProps<{ leadId: string }>()

const loading = ref(true)
const loadError = ref('')
const submitting = ref(false)
const done = ref(false)
const alreadyDone = ref(false)

const firstName = ref('')
const questions = ref<any[]>([])
const answers = ref<Record<string, string | number>>({})
const step = ref(0)
const fieldError = ref('')
const touched = ref(false)

const current = computed(() => questions.value[step.value])
const isLast = computed(() => step.value === questions.value.length - 1)
const progress = computed(() =>
  questions.value.length ? ((step.value + 1) / questions.value.length) * 100 : 0
)

onMounted(async () => {
  try {
    const res = await $fetch<any>(`/api/qualify/${props.leadId}`)
    firstName.value = res.firstName || ''
    questions.value = res.questions || []
    alreadyDone.value = Boolean(res.completed)
  } catch (err: any) {
    loadError.value = err?.data?.message || 'This link is not valid or has expired.'
  } finally {
    loading.value = false
  }
})

// Clear the error as they correct it, but only after a first attempt —
// no nagging while they're still typing the opening word.
watch(() => answers.value[current.value?.id], () => {
  if (!touched.value) return
  fieldError.value = ''
})

/**
 * Every question here is optional EXCEPT that we validate format when
 * something is entered. A half-finished questionnaire is still useful —
 * blocking someone on question 7 of 12 loses everything they already gave.
 */
function next() {
  const q = current.value
  const val = answers.value[q?.id]

  if (q?.type === 'number' && String(val ?? '').trim()) {
    const res = validateField('price', val)
    if (!res.valid) {
      touched.value = true
      fieldError.value = 'Please enter a number.'
      return
    }
  }

  fieldError.value = ''
  touched.value = false

  if (isLast.value) submit()
  else step.value++
}

function back() {
  if (step.value > 0) step.value--
}

function skip() {
  if (isLast.value) submit()
  else step.value++
}

async function submit() {
  submitting.value = true
  try {
    await $fetch(`/api/qualify/${props.leadId}`, {
      method: 'POST',
      body: { answers: answers.value }
    })
    done.value = true
  } catch (err: any) {
    fieldError.value = err?.data?.message || 'Something went wrong sending your answers. Please try again.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="w-full max-w-[460px] mx-auto px-6 py-8">

    <!-- Loading -->
    <div v-if="loading" class="py-16 text-center">
      <p class="text-[14px]" style="color: var(--gf-muted)">Loading your questions…</p>
    </div>

    <!-- Bad or expired link -->
    <div v-else-if="loadError" class="py-12 text-center">
      <p class="gf-display text-[24px] mb-3">This link isn't working</p>
      <p class="text-[14px] leading-relaxed" style="color: var(--gf-muted)">
        {{ loadError }} Get in touch with your agent and they can send a fresh one.
      </p>
    </div>

    <!-- Already completed -->
    <div v-else-if="alreadyDone || done" class="py-12 text-center">
      <div
        class="w-14 h-14 mx-auto mb-7 flex items-center justify-center rounded-full"
        :style="{ background: 'var(--gf-accent)' }"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24"
          fill="none" stroke="var(--gf-bg)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </div>
      <p class="gf-display text-[26px] mb-3">
        {{ done ? 'Thank you' : 'Already received' }}
      </p>
      <p class="text-[14.5px] leading-relaxed max-w-[32ch] mx-auto" style="color: var(--gf-muted)">
        {{ done
          ? 'That gives your agent everything they need to be useful. Expect to hear from them shortly.'
          : "We've already got your answers — nothing more to do." }}
      </p>
    </div>

    <!-- The questionnaire -->
    <div v-else>
      <div class="mb-9">
        <p class="gf-display text-[22px] leading-snug mb-2">
          <template v-if="firstName">Thanks, {{ firstName }}.</template>
          <template v-else>A few questions.</template>
        </p>
        <p class="text-[13.5px] leading-relaxed" style="color: var(--gf-muted)">
          About five minutes. Skip anything you'd rather not answer.
        </p>
      </div>

      <!-- Progress -->
      <div class="flex items-baseline justify-between mb-3">
        <span class="gf-eyebrow" style="color: var(--gf-muted)">
          {{ String(step + 1).padStart(2, '0') }} — {{ String(questions.length).padStart(2, '0') }}
        </span>
        <span class="gf-eyebrow" style="color: var(--gf-muted)">{{ Math.round(progress) }}%</span>
      </div>
      <div class="h-px w-full mb-10" style="background: var(--gf-hair)">
        <div class="h-px transition-all duration-500 ease-out"
          :style="{ width: `${progress}%`, background: 'var(--gf-accent)' }" />
      </div>

      <!-- Question -->
      <transition name="fade" mode="out-in">
        <div :key="step">
          <label :for="current?.id" class="gf-display block text-[24px] leading-[1.25] mb-7">
            {{ current?.label }}
          </label>

          <!-- Choice -->
          <div v-if="current?.type === 'choice'" class="flex flex-col gap-2.5">
            <button
              v-for="opt in current.options" :key="opt"
              class="text-left px-4 py-3.5 text-[15px] transition-colors"
              :style="answers[current.id] === opt
                ? { border: '1px solid var(--gf-accent)', color: 'var(--gf-accent)' }
                : { border: '1px solid var(--gf-hair)', color: 'var(--gf-fg)' }"
              @click="answers[current.id] = opt"
            >
              {{ opt }}
            </button>
          </div>

          <!-- Long text -->
          <textarea
            v-else-if="current?.type === 'long'"
            :id="current?.id"
            v-model="answers[current.id]"
            rows="4"
            class="gf-input"
            style="border: 1px solid var(--gf-hair); padding: 12px 14px; font-size: 16px; resize: none;"
            placeholder="Whatever comes to mind"
          />

          <!-- Number / short text -->
          <input
            v-else
            :id="current?.id"
            v-model="answers[current.id]"
            :type="current?.type === 'number' ? 'text' : 'text'"
            :inputmode="current?.type === 'number' ? 'numeric' : 'text'"
            class="gf-input"
            @keyup.enter="next"
          />

          <p v-if="fieldError" class="text-[13px] mt-3" style="color: var(--gf-accent)" role="alert">
            {{ fieldError }}
          </p>
        </div>
      </transition>

      <!-- Actions -->
      <div class="mt-10 flex items-center gap-3">
        <button
          v-if="step > 0"
          class="px-5 py-3.5 text-[11px] uppercase tracking-[0.12em] font-semibold"
          style="border: 1px solid var(--gf-hair); color: var(--gf-muted)"
          @click="back"
        >
          Back
        </button>

        <button
          :disabled="submitting"
          class="flex-1 px-6 py-3.5 text-[11px] uppercase tracking-[0.12em] font-semibold transition-opacity hover:opacity-90 disabled:opacity-50"
          :style="{ background: 'var(--gf-accent)', color: 'var(--gf-bg)' }"
          @click="next"
        >
          {{ submitting ? 'Sending…' : isLast ? 'Send my answers' : 'Next' }}
        </button>
      </div>

      <button
        class="mt-4 gf-eyebrow transition-opacity hover:opacity-70"
        style="color: var(--gf-muted)"
        @click="skip"
      >
        Skip this one
      </button>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .2s ease, transform .2s ease; }
.fade-enter-from { opacity: 0; transform: translateY(6px); }
.fade-leave-to { opacity: 0; transform: translateY(-6px); }
</style>
