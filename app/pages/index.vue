<script setup lang="ts">
import { leadData, testLeadData } from '~/utils/users/lead';
import { companyData, companyTestData } from '~/utils/users/company';
// http://localhost:3000/?category=construction&company_name=White+Raven+Development&company_email=whiteravendev90@gmail.com

const route = useRoute();
const { category, company_name, company_email } = route.query;


const step = ref(0);
const answers = ref(testLeadData);
const company = ref(companyTestData)
const loading = ref(false)
const aiResult = ref(null);
const useUploadImage = ref(false);
const selectedFile = ref<File | null>(null);

const questions = [
    { id: 'name', label: "What's your name?", type: 'text' },
    { id: 'email', label: "What's your email?", type: 'text' },
    { id: 'address', label: "What's your address?", type: 'text' },
    { id: 'goal', label: "What can we help you with?", type: 'text' },
    { id: 'sqft', label: "What would be the square footage of the project needs?", type: 'number' },
    { id: 'budget', label: "What is your estimated budget?", type: 'number' },
    { id: 'message', label: "What are more details about your project?", type: 'text' },
];

// This function runs when the child "emits" the file
const handleImageSelection = (file: File) => {
    selectedFile.value = file;
};

const useFile = computed(() => selectedFile.value);

const nextStep = () => {
    if (step.value < questions.length - 1) step.value++
    else submitForm()
}

const submitForm = async () => {
    loading.value = true
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

    loading.value = false;
};
</script>

<template>
    <div class="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-6 font-sans">
        <div v-if="!aiResult" class="max-w-md w-full space-y-8">
            <div class="h-1 bg-zinc-800 rounded-full">
                <div class="h-1 bg-blue-500 transition-all duration-500"
                    :style="{ width: `${((step + 1) / questions.length) * 100}%` }"></div>
            </div>

            <transition name="fade" mode="out-in">
                <div :key="step" class="space-y-4">
                    <label class="block text-2xl font-medium">{{ questions[step].label }}</label>
                    <input v-model="answers[questions[step].id]" :type="questions[step].type" @keyup.enter="nextStep"
                        class="w-full bg-transparent border-b-2 border-zinc-700 py-2 text-xl focus:border-blue-500 outline-none transition-colors"
                        autofocus />
                </div>
            </transition>

            <baseLoading v-if="loading" class="z-10" />

            <div class="w-full">

                <div class="flex w-full justify-between">
                    <baseButton :text="useUploadImage ? 'Cancel Upload' : 'Upload an image'"
                        @click="useUploadImage = !useUploadImage" />

                    <baseButton v-if="!loading" @click="nextStep"
                        :text="step === questions.length - 1 ? 'Finish' : 'Next'" />
                </div>

                <div v-if="useUploadImage">
                    <appImageUpload @file-selected="handleImageSelection" />
                </div>
            </div>
        </div>

        <div v-else class="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 max-w-lg">
            <h2 class="text-green-400 font-bold mb-2">Thank you for your inquiry</h2>
            <p class="text-zinc-400 mb-4 italic">{{ companyTestData.company_name }} will get back to you shortly!</p>
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