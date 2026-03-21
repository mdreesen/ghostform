import { defineComponent, ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrInterpolate, ssrRenderDynamicModel, ssrRenderAttr, ssrRenderComponent } from 'vue/server-renderer';
import { _ as _export_sfc, u as useRoute } from './server.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '@iconify/utils';
import 'consola';
import 'ipx';
import 'vue-router';
import 'tailwindcss/colors';
import '@iconify/vue';
import 'framesync';
import 'popmotion';
import 'style-value-types';
import 'reka-ui';
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';
import 'perfect-debounce';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';

const _sfc_main$3 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "absolute inset-0 bg-zinc-950/80 rounded-2xl flex items-center justify-center" }, _attrs))}><div class="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div></div>`);
}
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/base/Loading.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$3, [["ssrRender", _sfc_ssrRender]]), { __name: "BaseLoading" });
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "Button",
  __ssrInlineRender: true,
  props: {
    text: {
      type: String,
      required: true,
      default: "Delete"
    }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<button${ssrRenderAttrs(mergeProps({ class: "bg-blue-600 px-6 py-2 rounded-lg hover:bg-blue-500 transition" }, _attrs))}>${ssrInterpolate(props.text)}</button>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/base/Button.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main$2, { __name: "BaseButton" });
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "ImageUpload",
  __ssrInlineRender: true,
  emits: ["file-selected"],
  setup(__props, { emit: __emit }) {
    ref(null);
    const previewUrl = ref(null);
    const isUploading = ref(false);
    const analysis = ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_baseLoading = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-xl mx-auto p-6 space-y-6" }, _attrs))} data-v-923949b7><div class="group relative border-2 border-dashed border-zinc-800 rounded-2xl p-12 text-center hover:border-blue-500/50 transition-all cursor-pointer bg-zinc-900/50" data-v-923949b7><input type="file" class="hidden" accept="image/*" data-v-923949b7>`);
      if (!unref(previewUrl)) {
        _push(`<div class="space-y-2" data-v-923949b7><p class="text-zinc-400 font-medium text-lg" data-v-923949b7>Drop your project photo here</p><p class="text-zinc-600 text-sm italic" data-v-923949b7>or click to browse</p></div>`);
      } else {
        _push(`<img${ssrRenderAttr("src", unref(previewUrl))} class="mx-auto max-h-64 rounded-xl shadow-2xl" data-v-923949b7>`);
      }
      if (unref(isUploading)) {
        _push(ssrRenderComponent(_component_baseLoading, null, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (unref(analysis)) {
        _push(`<div class="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-xl" data-v-923949b7><h3 class="text-blue-400 font-bold mb-3 flex items-center gap-2" data-v-923949b7><span data-v-923949b7>✨</span> Ghost AI Analysis </h3><p class="text-zinc-300 leading-relaxed" data-v-923949b7>${ssrInterpolate(unref(analysis))}</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/app/ImageUpload.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_2 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$1, [["__scopeId", "data-v-923949b7"]]), { __name: "AppImageUpload" });
const testLeadData = {
  name: "Michael Dreesen",
  email: "michaeldreesen90@gmail.com",
  address: "412 3rd Ave E Kalispell, MT 59901",
  goal: "New Deck",
  sqft: "200",
  budget: "20000",
  message: "I need a new deck with railings. The old one is going out and I need this asap."
};
const companyTestData = {
  category: "construction",
  company_name: "White Raven Development",
  company_email: "michaeldreesen90@gmail.com"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const { category, company_name, company_email } = route.query;
    const step = ref(0);
    const answers = ref(testLeadData);
    const company = ref(companyTestData);
    const loading = ref(false);
    const aiResult = ref(null);
    const useUploadImage = ref(false);
    const selectedFile = ref(null);
    const questions = [
      { id: "name", label: "What's your name?", type: "text" },
      { id: "email", label: "What's your email?", type: "text" },
      { id: "address", label: "What's your address?", type: "text" },
      { id: "goal", label: "What can we help you with?", type: "text" },
      { id: "sqft", label: "What would be the square footage of the project needs?", type: "number" },
      { id: "budget", label: "What is your estimated budget?", type: "number" },
      { id: "message", label: "What are more details about your project?", type: "text" }
    ];
    const handleImageSelection = (file) => {
      selectedFile.value = file;
    };
    const useFile = computed(() => selectedFile.value);
    const nextStep = () => {
      if (step.value < questions.length - 1) step.value++;
      else submitForm();
    };
    const submitForm = async () => {
      loading.value = true;
      const fd = new FormData();
      const jsonLeadBlob = new Blob([JSON.stringify(answers.value)], {
        type: "application/json"
      });
      const jsonCompanyBlob = new Blob([JSON.stringify(company.value)], {
        type: "application/json"
      });
      fd.append("answers", jsonLeadBlob);
      fd.append("company", jsonCompanyBlob);
      if (useFile.value) {
        fd.append("image", useFile.value);
      }
      aiResult.value = await $fetch("/api/lead", {
        method: "POST",
        body: fd
      });
      loading.value = false;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_baseLoading = __nuxt_component_0;
      const _component_baseButton = __nuxt_component_1;
      const _component_appImageUpload = __nuxt_component_2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-zinc-950 text-white flex items-center justify-center p-6 font-sans" }, _attrs))} data-v-a950b49f>`);
      if (!unref(aiResult)) {
        _push(`<div class="max-w-md w-full space-y-8" data-v-a950b49f><div class="h-1 bg-zinc-800 rounded-full" data-v-a950b49f><div class="h-1 bg-blue-500 transition-all duration-500" style="${ssrRenderStyle({ width: `${(unref(step) + 1) / questions.length * 100}%` })}" data-v-a950b49f></div></div><div class="space-y-4" data-v-a950b49f><label class="block text-2xl font-medium" data-v-a950b49f>${ssrInterpolate(questions[unref(step)].label)}</label><input${ssrRenderDynamicModel(questions[unref(step)].type, unref(answers)[questions[unref(step)].id], null)}${ssrRenderAttr("type", questions[unref(step)].type)} class="w-full bg-transparent border-b-2 border-zinc-700 py-2 text-xl focus:border-blue-500 outline-none transition-colors" autofocus data-v-a950b49f></div>`);
        if (unref(loading)) {
          _push(ssrRenderComponent(_component_baseLoading, { class: "z-10" }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="w-full" data-v-a950b49f><div class="flex w-full justify-between" data-v-a950b49f>`);
        _push(ssrRenderComponent(_component_baseButton, {
          text: unref(useUploadImage) ? "Cancel Upload" : "Upload an image",
          onClick: ($event) => useUploadImage.value = !unref(useUploadImage)
        }, null, _parent));
        if (!unref(loading)) {
          _push(ssrRenderComponent(_component_baseButton, {
            onClick: nextStep,
            text: unref(step) === questions.length - 1 ? "Finish" : "Next"
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        if (unref(useUploadImage)) {
          _push(`<div data-v-a950b49f>`);
          _push(ssrRenderComponent(_component_appImageUpload, { onFileSelected: handleImageSelection }, null, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<div class="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 max-w-lg" data-v-a950b49f><h2 class="text-green-400 font-bold mb-2" data-v-a950b49f>Thank you for your inquiry</h2><p class="text-zinc-400 mb-4 italic" data-v-a950b49f>${ssrInterpolate(unref(companyTestData).company_name)} will get back to you shortly!</p></div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-a950b49f"]]);

export { index as default };
//# sourceMappingURL=index-7okJbzjR.mjs.map
