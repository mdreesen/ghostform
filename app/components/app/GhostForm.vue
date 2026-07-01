<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { leadData } from '~/utils/users/useLead';
import { useImageCompression } from '~/composables/useImageCompression';
import { errors } from '~/lib/errors';
import { useQuestions } from '~/composables/useQuestions';
import { useFormOffline } from '~/composables/useOffline';
// http://localhost:3000/?category=realtor&source=default&id=6a037a5ef945b9b2ca73a93d&company_name=$2b$15$eXsdK5TP.TC/M8QXsUuwh.bddChSOn8vckNGoWzXljfIktJ9Zs80y&company_email=$2b$15$8kJfxGFr8anR5xLRxFSIeO8KnG2zH4asf27ZpRjz1X6xhFcmFORCq&calendar=https://calendly.com/whiteravendev90/30min&background_color=#09090B&font_color=#FFFFFF

const props = defineProps({
    routeData: {
        type: Object,
        required: true,
    },
})

const { category, source, id, company_name, company_email, calendar, use_image_upload } = props.routeData;
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

const nextStep = () => {
    if (step.value < questions.value.length - 1) step.value++
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
        } else {
            setError.value = "Local cache registration broken."
        }
        loading.value = false
        return
    }

    // 🌐 STANDARD LIVE NETWORK PIPELINE DISPATCH
    try {
        const fd = new FormData();
        const jsonLeadBlob = new Blob([JSON.stringify({...answers.value, category: category})], {
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
    <div :class="`w-105 h-135 flex items-center justify-center p-6 font-sans rounded-4xl drop-shadow-2xl`">

        <div v-if="!aiResult" class="max-w-md w-full space-y-4">
            <div class="h-1 bg-zinc-800 rounded-full">
                <div class="h-1 bg-blue-500 transition-all duration-500"
                    :style="{ width: `${((step + 1) / questions.length) * 100}%` }"></div>
            </div>

            <transition name="fade" mode="out-in">
                <div :key="step" class="space-y-4">
                    <label class="block text-2xl font-medium">{{ questions[step]?.label }}</label>
                    <input v-model="answers[questions[step]?.id]" :type="questions[step]?.type" @keyup.enter="nextStep"
                        :name="questions[step]?.id"
                        class="w-full bg-transparent border-b-2 border-white py-2 text-xl focus:border-blue-500 outline-none transition-colors"
                        autofocus />
                </div>
            </transition>

            <baseLoading v-if="loading" class="z-10" />

            <div class="w-full">

                <div class="flex w-full justify-between gap-5">
                    <baseButton v-if="use_image_upload" :text="useUploadImage ? 'Cancel Upload' : 'Upload an image'"
                        @click="useUploadImage = !useUploadImage" />

                    <div class="bg-blue-600 w-full justify-evenly px-6 py-2 rounded-lg flex gap-2 items-center">
                        <button class="hover:bg-blue-500 transition w-full h-7.5" @click="backStep">
                            Back
                        </button>

                        <span>|</span>

                        <button class="hover:bg-blue-500 transition w-full h-7.5" @click="nextStep">
                            {{ step === questions.length - 1 ? 'Finish' : 'Next' }}
                        </button>

                    </div>
                </div>

                <div v-if="useUploadImage">
                    <appImageUpload @file-selected="handleImageSelection" />
                </div>
            </div>

            <div v-if="setError">
                <baseError :message="errors(setError)" />
            </div>
        </div>

        <div v-else class="w-70">
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