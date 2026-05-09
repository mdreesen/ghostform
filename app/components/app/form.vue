<script setup lang="ts">
import { leadData } from '~/utils/users/useLead';
import { companyData, companyTestData } from '~/utils/users/company';
import { compressImage } from '~/lib/compress';
import { errors } from '~/lib/errors';
import { questionsConstruction } from '~/utils/questions/construction';
import { questionsRealtor } from '~/utils/questions/realtor';
// http://localhost:3000/?category=construction&company_name=White+Raven+Development&company_email=whiteravendev90@gmail.com&background_color=#09090B&font_color=#FFFFFF

const props = defineProps({
    routeData: {
        type: Object,
        required: true,
    },
})

const { category, company_name, company_email } = props.routeData;
const step = ref(0);
const answers = ref(leadData(category));
const company = ref(companyTestData);
// const company = ref({ category: category, company_name: company_name, company_email: company_email}); // Testing Data
const loading = ref(false);
const setError = ref('')
const aiResult = ref(null);
const useUploadImage = ref(false);
const selectedFile = ref<File | null>(null);
const userEmail = ref('');
const showSuccess = ref(false);

// Looking for project completion
console.log(category)
const useQuestions = computed(() => {
    switch (true) {
        case category.includes('construction'):
            return questionsConstruction;
        case category.includes('realtor'):
            return questionsRealtor;
    }
});

// This function runs when the child "emits" the file
const handleImageSelection = async (file: File) => {
    loading.value = true; // Optional: show loading if it's a huge file
    try {
        // Shrink it before it even touches the 'selectedFile' ref
        const compressed = await compressImage(file);
        selectedFile.value = compressed;

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
    if (step.value < useQuestions.value.length - 1) step.value++
    else submitForm()
}

const submitForm = async () => {
    loading.value = true
    try {
        const fd = new FormData();

        const jsonLeadBlob = new Blob([JSON.stringify(answers.value)], {
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
        loading.value = false;
    } catch (error) {
        console.log(error);
        setError.value = error.message;
        loading.value = false;
    }
};

// Company Information
const useCompanyName = computed(() => company_name ? company_name : 'We');
</script>

<template>
    <div :class="`max-w-105 h-135 flex items-center justify-center p-6 font-sans rounded-4xl drop-shadow-2xl`">

        <div v-if="!aiResult" class="max-w-md w-full space-y-4">
            <div class="h-1 bg-zinc-800 rounded-full">
                <div class="h-1 bg-blue-500 transition-all duration-500"
                    :style="{ width: `${((step + 1) / useQuestions.length) * 100}%` }"></div>
            </div>

            <transition name="fade" mode="out-in">
                <div :key="step" class="space-y-4">
                    <label class="block text-2xl font-medium">{{ useQuestions[step]?.label }}</label>
                    <input v-model="answers[useQuestions[step]?.id]" :type="useQuestions[step]?.type" @keyup.enter="nextStep"
                        :name="useQuestions[step]?.id"
                        class="w-full bg-transparent border-b-2 border-white py-2 text-xl focus:border-blue-500 outline-none transition-colors"
                        autofocus />
                </div>
            </transition>

            <baseLoading v-if="loading" class="z-10" />

            <div class="w-full">

                <div class="flex w-full justify-between gap-5">
                    <baseButton :text="useUploadImage ? 'Cancel Upload' : 'Upload an image'"
                        @click="useUploadImage = !useUploadImage" />

                    <div class="bg-blue-600 px-6 py-2 rounded-lg flex gap-2 items-center">
                        <button class="hover:bg-blue-500 transition" @click="backStep">
                            Back
                        </button>

                        <span>|</span>

                        <button class="hover:bg-blue-500 transition" @click="nextStep">
                            {{ step === useQuestions.length - 1 ? 'Finish' : 'Next' }}
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

        <div v-else class="p-8 rounded-2xl border border-zinc-800 max-w-lg">
            <appSuccess :company="useCompanyName as string" :show="showSuccess" :email="userEmail" />

            <h2 class="font-bold mb-2">Thank you for your inquiry</h2>
            <p class="mb-4 italic">{{ useCompanyName }} will get back to you shortly!</p>
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