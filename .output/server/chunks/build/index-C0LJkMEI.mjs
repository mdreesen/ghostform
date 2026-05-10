import { defineComponent, mergeProps, unref, ref, computed, watch, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttrs, ssrRenderStyle, ssrInterpolate, ssrRenderDynamicModel, ssrRenderAttr } from 'vue/server-renderer';
import { _ as _export_sfc, u as useRoute, a as __nuxt_component_0$2 } from './server.mjs';
import confetti from 'canvas-confetti';
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

const _sfc_main$6 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "absolute inset-0 bg-zinc-950/80 rounded-2xl flex items-center justify-center" }, _attrs))}><div class="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div></div>`);
}
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/base/Loading.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const __nuxt_component_0$1 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$6, [["ssrRender", _sfc_ssrRender]]), { __name: "BaseLoading" });
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
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
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/base/Button.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main$5, { __name: "BaseButton" });
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "ImageUpload",
  __ssrInlineRender: true,
  emits: ["file-selected"],
  setup(__props, { emit: __emit }) {
    ref(null);
    const previewUrl = ref(null);
    const isUploading = ref(false);
    const analysis = ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtImg = __nuxt_component_0$2;
      const _component_baseLoading = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-xl mx-auto p-6 space-y-6" }, _attrs))} data-v-a678dbc3><div class="group relative border-2 border-dashed border-zinc-800 rounded-2xl p-6 text-center hover:border-blue-500/50 transition-all cursor-pointer bg-zinc-900/50" data-v-a678dbc3><input type="file" class="hidden" accept="image/*" data-v-a678dbc3>`);
      if (!unref(previewUrl)) {
        _push(`<div class="space-y-2" data-v-a678dbc3><div class="text-4xl" data-v-a678dbc3></div><p class="text-zinc-400 font-medium text-lg" data-v-a678dbc3>Drop your project photo here</p><p class="text-zinc-600 text-sm italic" data-v-a678dbc3>or click to browse</p>`);
        _push(ssrRenderComponent(_component_NuxtImg, {
          class: "relative z-10 h-12 w-full object-contain drop-shadow-md",
          src: "/images/logo-icon.webp",
          format: "webp",
          preload: "",
          loading: "eager",
          "fetch-priority": "high"
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<img${ssrRenderAttr("src", unref(previewUrl))} class="mx-auto max-h-35 rounded-xl shadow-2xl" data-v-a678dbc3>`);
      }
      if (unref(isUploading)) {
        _push(ssrRenderComponent(_component_baseLoading, null, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (unref(analysis)) {
        _push(`<div class="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-xl" data-v-a678dbc3><h3 class="text-blue-400 font-bold mb-3 flex items-center gap-2" data-v-a678dbc3><span data-v-a678dbc3>\u2728</span> Ghost AI Analysis </h3><p class="text-zinc-300 leading-relaxed" data-v-a678dbc3>${ssrInterpolate(unref(analysis))}</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/app/ImageUpload.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const __nuxt_component_2 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$4, [["__scopeId", "data-v-a678dbc3"]]), { __name: "AppImageUpload" });
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "Error",
  __ssrInlineRender: true,
  props: {
    message: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.message) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex items-center gap-3 p-4 mb-6 rounded-2xl bg-red-500/10 border border-red-500/20 backdrop-blur-md" }, _attrs))} data-v-c28b9695><div class="shrink-0 w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-400" data-v-c28b9695><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-c28b9695><circle cx="12" cy="12" r="10" data-v-c28b9695></circle><line x1="12" y1="8" x2="12" y2="12" data-v-c28b9695></line><line x1="12" y1="16" x2="12.01" y2="16" data-v-c28b9695></line></svg></div><p class="text-sm font-medium text-red-200/80 leading-tight" data-v-c28b9695>${ssrInterpolate(__props.message)}</p></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/base/Error.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_3 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$3, [["__scopeId", "data-v-c28b9695"]]), { __name: "BaseError" });
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "success",
  __ssrInlineRender: true,
  props: {
    show: {
      type: Boolean,
      required: true
    },
    email: {
      type: String,
      default: ""
    },
    company: {
      type: String,
      default: ""
    }
  },
  emits: ["close"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    watch(() => props.show, (newVal) => {
      if (newVal) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#00F2FF", "#7000FF", "#ffffff"]
        });
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "fixed inset-0 z-100 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm" }, _attrs))} data-v-4c15b7ff><div class="relative max-w-sm w-full bg-zinc-900 border border-white/10 p-8 rounded-[2.5rem] text-center shadow-2xl" data-v-4c15b7ff><div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-cyan-500/20 blur-2xl rounded-full" data-v-4c15b7ff></div><div class="relative w-20 h-20 bg-linear-to-br from-cyan-400 to-blue-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg rotate-3" data-v-4c15b7ff><svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" data-v-4c15b7ff><path d="M20 6 9 17l-5-5" data-v-4c15b7ff></path></svg></div><h3 class="text-2xl font-black mb-2" data-v-4c15b7ff>Submission Sent!</h3><p class="text-zinc-400 text-sm mb-8 leading-relaxed" data-v-4c15b7ff> Your inquiry has been sent ${ssrInterpolate(__props.company ? `to ${__props.company}` : "")}. We&#39;ve sent a confirmation to <span class="text-cyan-400 font-bold" data-v-4c15b7ff>${ssrInterpolate(__props.email)}</span>. </p></div></div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/app/success.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_4 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$2, [["__scopeId", "data-v-4c15b7ff"]]), { __name: "AppSuccess" });
const leadConstruction = {
  name: "",
  email: "",
  address: "",
  goal: "",
  sqft: "",
  budget: "",
  message: ""
};
const testDataConstruction = {
  name: "Michael Dreesen",
  email: "michaeldreesen90@gmail.com",
  address: "412 3rd Ave E Kalispell, MT 59901",
  goal: "New Deck",
  sqft: "200",
  budget: "20000",
  message: "I need a new deck with railings. The old one is going out and I need this asap."
};
const leadRealtor = {
  name: "",
  age: "",
  email: "",
  phone: "",
  address: "",
  want_to_move: "",
  buy_sell_both: "",
  price: "",
  sqft: "",
  bedrooms: "",
  bathrooms: "",
  budget: "",
  message: ""
};
const testLeadRealtor = {
  name: "Michael Dreesen",
  age: "33",
  email: "michaeldreesen90@gmail.com",
  phone: "4066072405",
  address: "412 3rd ave E Kalispell MT, 59901",
  want_to_move: "yes",
  buy_sell_both: "Both",
  price: "550000",
  sqft: "2500",
  bedrooms: "4",
  bathrooms: "3",
  budget: "10000",
  message: ""
};
function leadData(category) {
  switch (true) {
    case category.includes("realtor"):
      return {
        data: leadRealtor,
        test: testLeadRealtor
      };
    case category.includes("construction"):
      return {
        data: leadConstruction,
        test: testDataConstruction
      };
  }
}
const compressImage = async (file) => {
  const maxWidth = 1600;
  const quality = 0.7;
  const bitmap = await createImageBitmap(file);
  let { width, height } = bitmap;
  if (width > maxWidth) {
    height = maxWidth / width * height;
    width = maxWidth;
  }
  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context failed");
  ctx.drawImage(bitmap, 0, 0, width, height);
  const blob = await canvas.convertToBlob({ type: "image/jpeg", quality });
  return new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
    type: "image/jpeg"
  });
};
function errors(error) {
  switch (true) {
    case error.includes("400"):
      return "Missing Data";
    default:
      return "Error 500, something went wrong.";
  }
}
const questionsConstruction = [
  { id: "name", label: "What's your name?", type: "text" },
  { id: "email", label: "What's your email?", type: "text" },
  { id: "address", label: "What's your address?", type: "text" },
  { id: "goal", label: "What can we help you with?", type: "text" },
  { id: "sqft", label: "What would be the square footage of the project needs?", type: "number" },
  { id: "budget", label: "What is your estimated budget?", type: "number" },
  { id: "message", label: "What are more details about your project?", type: "text" }
];
const questionsRealtor = [
  { id: "name", label: "What's your name?", type: "text" },
  { id: "age", label: "What's your age?", type: "number" },
  { id: "email", label: "What's your email?", type: "text" },
  { id: "phone", label: "What's your phone number?", type: "text" },
  { id: "address", label: "What's your home address?", type: "text" },
  { id: "want_to_move", label: "When would you want to move?", type: "text" },
  { id: "buy_sell_both", label: "Are you looking to buy, sell, or both?", type: "text" },
  { id: "price", label: "What do you think your home is worth?", type: "number" },
  { id: "sqft", label: "What would be the square footage of the project needs?", type: "number" },
  { id: "bedrooms", label: "How many bedrooms does your home have", type: "number" },
  { id: "bathrooms", label: "How many bathrooms does your home have", type: "number" },
  { id: "budget", label: "What is your estimated budget?", type: "number" },
  { id: "message", label: "Are there any other details about your home?", type: "text" }
];
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "GhostForm",
  __ssrInlineRender: true,
  props: {
    routeData: {
      type: Object,
      required: true
    }
  },
  setup(__props) {
    const props = __props;
    const { category, company_name, company_email } = props.routeData;
    const step = ref(0);
    const answers = ref(leadData(category).data);
    ref({ category, company_name, company_email });
    const loading = ref(false);
    const setError = ref("");
    const aiResult = ref(null);
    const useUploadImage = ref(false);
    const selectedFile = ref(null);
    const userEmail = ref("");
    const showSuccess = ref(false);
    const useQuestions = computed(() => {
      switch (true) {
        case category.includes("construction"):
          return questionsConstruction;
        case category.includes("realtor"):
          return questionsRealtor;
      }
    });
    const handleImageSelection = async (file) => {
      loading.value = true;
      try {
        const compressed = await compressImage(file);
        selectedFile.value = compressed;
      } catch (err) {
        console.error("Compression failed, using original file", err);
        selectedFile.value = file;
      } finally {
        loading.value = false;
      }
    };
    computed(() => selectedFile.value);
    const useCompanyName = computed(() => company_name ? company_name : "We");
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e;
      const _component_baseLoading = __nuxt_component_0$1;
      const _component_baseButton = __nuxt_component_1;
      const _component_appImageUpload = __nuxt_component_2;
      const _component_baseError = __nuxt_component_3;
      const _component_appSuccess = __nuxt_component_4;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: `max-w-105 h-135 flex items-center justify-center p-6 font-sans rounded-4xl drop-shadow-2xl` }, _attrs))} data-v-5253482a>`);
      if (!unref(aiResult)) {
        _push(`<div class="max-w-md w-full space-y-4" data-v-5253482a><div class="h-1 bg-zinc-800 rounded-full" data-v-5253482a><div class="h-1 bg-blue-500 transition-all duration-500" style="${ssrRenderStyle({ width: `${(unref(step) + 1) / unref(useQuestions).length * 100}%` })}" data-v-5253482a></div></div><div class="space-y-4" data-v-5253482a><label class="block text-2xl font-medium" data-v-5253482a>${ssrInterpolate((_a = unref(useQuestions)[unref(step)]) == null ? void 0 : _a.label)}</label><input${ssrRenderDynamicModel((_b = unref(useQuestions)[unref(step)]) == null ? void 0 : _b.type, unref(answers)[(_c = unref(useQuestions)[unref(step)]) == null ? void 0 : _c.id], null)}${ssrRenderAttr("type", (_d = unref(useQuestions)[unref(step)]) == null ? void 0 : _d.type)}${ssrRenderAttr("name", (_e = unref(useQuestions)[unref(step)]) == null ? void 0 : _e.id)} class="w-full bg-transparent border-b-2 border-white py-2 text-xl focus:border-blue-500 outline-none transition-colors" autofocus data-v-5253482a></div>`);
        if (unref(loading)) {
          _push(ssrRenderComponent(_component_baseLoading, { class: "z-10" }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="w-full" data-v-5253482a><div class="flex w-full justify-between gap-5" data-v-5253482a>`);
        _push(ssrRenderComponent(_component_baseButton, {
          text: unref(useUploadImage) ? "Cancel Upload" : "Upload an image",
          onClick: ($event) => useUploadImage.value = !unref(useUploadImage)
        }, null, _parent));
        _push(`<div class="bg-blue-600 px-6 py-2 rounded-lg flex gap-2 items-center" data-v-5253482a><button class="hover:bg-blue-500 transition" data-v-5253482a> Back </button><span data-v-5253482a>|</span><button class="hover:bg-blue-500 transition" data-v-5253482a>${ssrInterpolate(unref(step) === unref(useQuestions).length - 1 ? "Finish" : "Next")}</button></div></div>`);
        if (unref(useUploadImage)) {
          _push(`<div data-v-5253482a>`);
          _push(ssrRenderComponent(_component_appImageUpload, { onFileSelected: handleImageSelection }, null, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        if (unref(setError)) {
          _push(`<div data-v-5253482a>`);
          _push(ssrRenderComponent(_component_baseError, {
            message: unref(errors)(unref(setError))
          }, null, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<div class="p-8 rounded-2xl border border-zinc-800 max-w-lg" data-v-5253482a>`);
        _push(ssrRenderComponent(_component_appSuccess, {
          company: unref(useCompanyName),
          show: unref(showSuccess),
          email: unref(userEmail)
        }, null, _parent));
        _push(`<h2 class="font-bold mb-2" data-v-5253482a>Thank you for your inquiry</h2><p class="mb-4 italic" data-v-5253482a>${ssrInterpolate(unref(useCompanyName))} will get back to you shortly!</p></div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/app/GhostForm.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$1, [["__scopeId", "data-v-5253482a"]]), { __name: "AppGhostForm" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const formId = route.params.id;
    return (_ctx, _push, _parent, _attrs) => {
      const _component_appGhostForm = __nuxt_component_0;
      _push(ssrRenderComponent(_component_appGhostForm, mergeProps({
        routeData: unref(route).query,
        id: unref(formId)
      }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-a69afbf2"]]);

export { index as default };
//# sourceMappingURL=index-C0LJkMEI.mjs.map
