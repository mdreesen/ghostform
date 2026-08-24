import { defineComponent, computed, unref, ref, watch, mergeProps, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttrs, ssrRenderStyle, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrRenderDynamicModel, ssrIncludeBooleanAttr, ssrGetDynamicModelProps } from 'vue/server-renderer';
import { _ as _export_sfc, u as useRoute } from './server.mjs';
import confetti from 'canvas-confetti';
import Dexie from 'dexie';
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

const FIELD_RULES = {
  // The email IS the lead — without it the realtor can't follow up and the
  // server rejects the submission outright.
  email: { required: true, rule: "email" },
  name: { required: true, rule: "name" },
  // Optional, but if they typed something it should be dialable.
  phone: { required: false, rule: "phone" },
  age: { required: false, rule: "number" },
  price: { required: false, rule: "number" },
  sqft: { required: false, rule: "number" },
  bedrooms: { required: false, rule: "number" },
  bathrooms: { required: false, rule: "number" },
  budget: { required: false, rule: "number" }
};
const EMAIL_RE = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;
function digitCount(value) {
  return (value.match(/\d/g) || []).length;
}
function validateField(fieldId, raw) {
  const config = FIELD_RULES[fieldId];
  const value = (raw ?? "").toString().trim();
  if (!config) return { valid: true };
  if (!value) {
    return config.required ? { valid: false, message: requiredMessage(fieldId) } : { valid: true };
  }
  switch (config.rule) {
    case "email":
      return EMAIL_RE.test(value) ? { valid: true } : { valid: false, message: "That email doesn't look right — check for a typo." };
    case "phone": {
      const digits = digitCount(value);
      if (digits === 0) {
        return { valid: false, message: "Please enter a phone number, or leave it blank." };
      }
      if (digits < 10) {
        return { valid: false, message: "That looks a bit short — include the area code." };
      }
      if (digits > 15) {
        return { valid: false, message: "That's more digits than a phone number has." };
      }
      return { valid: true };
    }
    case "name":
      return value.length >= 2 ? { valid: true } : { valid: false, message: "Please enter your name." };
    case "number":
      return /^[\d,.\s$]+$/.test(value) ? { valid: true } : { valid: false, message: "Please enter a number." };
    default:
      return { valid: true };
  }
}
function requiredMessage(fieldId) {
  if (fieldId === "email") return "We need an email so we can get back to you.";
  if (fieldId === "name") return "Please enter your name.";
  return "This one is needed.";
}
function isRequired(fieldId) {
  return FIELD_RULES[fieldId]?.required ?? false;
}
function inputAttrs(fieldId, declaredType) {
  switch (FIELD_RULES[fieldId]?.rule) {
    case "email":
      return { type: "email", inputmode: "email", autocomplete: "email", autocapitalize: "off", spellcheck: false };
    case "phone":
      return { type: "tel", inputmode: "tel", autocomplete: "tel" };
    case "number":
      return { type: declaredType === "number" ? "number" : "text", inputmode: "numeric" };
    case "name":
      return { type: "text", inputmode: "text", autocomplete: "name", autocapitalize: "words" };
    default:
      return { type: declaredType || "text" };
  }
}
const _sfc_main$7 = /* @__PURE__ */ defineComponent({
  __name: "Qualify",
  __ssrInlineRender: true,
  props: {
    leadId: {}
  },
  setup(__props) {
    const loading = ref(true);
    const loadError = ref("");
    const submitting = ref(false);
    const done = ref(false);
    const alreadyDone = ref(false);
    const firstName = ref("");
    const questions = ref([]);
    const answers = ref({});
    const step = ref(0);
    const fieldError = ref("");
    const touched = ref(false);
    const current = computed(() => questions.value[step.value]);
    const isLast = computed(() => step.value === questions.value.length - 1);
    const progress = computed(
      () => questions.value.length ? (step.value + 1) / questions.value.length * 100 : 0
    );
    watch(() => answers.value[current.value?.id], () => {
      if (!touched.value) return;
      fieldError.value = "";
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "w-full max-w-[460px] mx-auto px-6 py-8" }, _attrs))} data-v-45c991f8>`);
      if (unref(loading)) {
        _push(`<div class="py-16 text-center" data-v-45c991f8><p class="text-[14px]" style="${ssrRenderStyle({ "color": "var(--gf-muted)" })}" data-v-45c991f8>Loading your questions…</p></div>`);
      } else if (unref(loadError)) {
        _push(`<div class="py-12 text-center" data-v-45c991f8><p class="gf-display text-[24px] mb-3" data-v-45c991f8>This link isn&#39;t working</p><p class="text-[14px] leading-relaxed" style="${ssrRenderStyle({ "color": "var(--gf-muted)" })}" data-v-45c991f8>${ssrInterpolate(unref(loadError))} Get in touch with your agent and they can send a fresh one. </p></div>`);
      } else if (unref(alreadyDone) || unref(done)) {
        _push(`<div class="py-12 text-center" data-v-45c991f8><div class="w-14 h-14 mx-auto mb-7 flex items-center justify-center rounded-full" style="${ssrRenderStyle({ background: "var(--gf-accent)" })}" data-v-45c991f8><svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--gf-bg)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" data-v-45c991f8><path d="M20 6 9 17l-5-5" data-v-45c991f8></path></svg></div><p class="gf-display text-[26px] mb-3" data-v-45c991f8>${ssrInterpolate(unref(done) ? "Thank you" : "Already received")}</p><p class="text-[14.5px] leading-relaxed max-w-[32ch] mx-auto" style="${ssrRenderStyle({ "color": "var(--gf-muted)" })}" data-v-45c991f8>${ssrInterpolate(unref(done) ? "That gives your agent everything they need to be useful. Expect to hear from them shortly." : "We've already got your answers — nothing more to do.")}</p></div>`);
      } else {
        _push(`<div data-v-45c991f8><div class="mb-9" data-v-45c991f8><p class="gf-display text-[22px] leading-snug mb-2" data-v-45c991f8>`);
        if (unref(firstName)) {
          _push(`<!--[-->Thanks, ${ssrInterpolate(unref(firstName))}.<!--]-->`);
        } else {
          _push(`<!--[-->A few questions.<!--]-->`);
        }
        _push(`</p><p class="text-[13.5px] leading-relaxed" style="${ssrRenderStyle({ "color": "var(--gf-muted)" })}" data-v-45c991f8> About five minutes. Skip anything you&#39;d rather not answer. </p></div><div class="flex items-baseline justify-between mb-3" data-v-45c991f8><span class="gf-eyebrow" style="${ssrRenderStyle({ "color": "var(--gf-muted)" })}" data-v-45c991f8>${ssrInterpolate(String(unref(step) + 1).padStart(2, "0"))} — ${ssrInterpolate(String(unref(questions).length).padStart(2, "0"))}</span><span class="gf-eyebrow" style="${ssrRenderStyle({ "color": "var(--gf-muted)" })}" data-v-45c991f8>${ssrInterpolate(Math.round(unref(progress)))}%</span></div><div class="h-px w-full mb-10" style="${ssrRenderStyle({ "background": "var(--gf-hair)" })}" data-v-45c991f8><div class="h-px transition-all duration-500 ease-out" style="${ssrRenderStyle({ width: `${unref(progress)}%`, background: "var(--gf-accent)" })}" data-v-45c991f8></div></div><div data-v-45c991f8><label${ssrRenderAttr("for", unref(current)?.id)} class="gf-display block text-[24px] leading-[1.25] mb-7" data-v-45c991f8>${ssrInterpolate(unref(current)?.label)}</label>`);
        if (unref(current)?.type === "choice") {
          _push(`<div class="flex flex-col gap-2.5" data-v-45c991f8><!--[-->`);
          ssrRenderList(unref(current).options, (opt) => {
            _push(`<button class="text-left px-4 py-3.5 text-[15px] transition-colors" style="${ssrRenderStyle(unref(answers)[unref(current).id] === opt ? { border: "1px solid var(--gf-accent)", color: "var(--gf-accent)" } : { border: "1px solid var(--gf-hair)", color: "var(--gf-fg)" })}" data-v-45c991f8>${ssrInterpolate(opt)}</button>`);
          });
          _push(`<!--]--></div>`);
        } else if (unref(current)?.type === "long") {
          _push(`<textarea${ssrRenderAttr("id", unref(current)?.id)} rows="4" class="gf-input" style="${ssrRenderStyle({ "border": "1px solid var(--gf-hair)", "padding": "12px 14px", "font-size": "16px", "resize": "none" })}" placeholder="Whatever comes to mind" data-v-45c991f8>${ssrInterpolate(unref(answers)[unref(current).id])}</textarea>`);
        } else {
          _push(`<input${ssrRenderAttr("id", unref(current)?.id)}${ssrRenderDynamicModel(unref(current)?.type === "number" ? "text" : "text", unref(answers)[unref(current).id], null)}${ssrRenderAttr("type", unref(current)?.type === "number" ? "text" : "text")}${ssrRenderAttr("inputmode", unref(current)?.type === "number" ? "numeric" : "text")} class="gf-input" data-v-45c991f8>`);
        }
        if (unref(fieldError)) {
          _push(`<p class="text-[13px] mt-3" style="${ssrRenderStyle({ "color": "var(--gf-accent)" })}" role="alert" data-v-45c991f8>${ssrInterpolate(unref(fieldError))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="mt-10 flex items-center gap-3" data-v-45c991f8>`);
        if (unref(step) > 0) {
          _push(`<button class="px-5 py-3.5 text-[11px] uppercase tracking-[0.12em] font-semibold" style="${ssrRenderStyle({ "border": "1px solid var(--gf-hair)", "color": "var(--gf-muted)" })}" data-v-45c991f8> Back </button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<button${ssrIncludeBooleanAttr(unref(submitting)) ? " disabled" : ""} class="flex-1 px-6 py-3.5 text-[11px] uppercase tracking-[0.12em] font-semibold transition-opacity hover:opacity-90 disabled:opacity-50" style="${ssrRenderStyle({ background: "var(--gf-accent)", color: "var(--gf-bg)" })}" data-v-45c991f8>${ssrInterpolate(unref(submitting) ? "Sending…" : unref(isLast) ? "Send my answers" : "Next")}</button></div><button class="mt-4 gf-eyebrow transition-opacity hover:opacity-70" style="${ssrRenderStyle({ "color": "var(--gf-muted)" })}" data-v-45c991f8> Skip this one </button></div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/app/Qualify.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const __nuxt_component_0$2 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$7, [["__scopeId", "data-v-45c991f8"]]), { __name: "AppQualify" });
const _sfc_main$6 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(mergeProps({
    class: "absolute inset-0 flex items-center justify-center z-20",
    style: { background: "color-mix(in srgb, var(--gf-bg) 82%, transparent)" }
  }, _attrs))}><div class="w-7 h-7 rounded-full animate-spin" style="${ssrRenderStyle({
    border: "2px solid var(--gf-hair)",
    borderTopColor: "var(--gf-accent)"
  })}"></div></div>`);
}
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/base/Loading.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const __nuxt_component_0$1 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$6, [["ssrRender", _sfc_ssrRender]]), { __name: "BaseLoading" });
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "ImageUpload",
  __ssrInlineRender: true,
  emits: ["file-selected"],
  setup(__props, { emit: __emit }) {
    ref(null);
    const previewUrl = ref(null);
    const isUploading = ref(false);
    const analysis = ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_baseLoading = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "w-full space-y-5" }, _attrs))} data-v-48274c97><div class="group relative p-7 text-center cursor-pointer transition-colors" style="${ssrRenderStyle({ "border": "1px dashed var(--gf-hair)" })}" data-v-48274c97><input type="file" class="hidden" accept="image/*" data-v-48274c97>`);
      if (!unref(previewUrl)) {
        _push(`<div class="space-y-2" data-v-48274c97><div class="text-4xl" data-v-48274c97></div><p class="text-[15px]" style="${ssrRenderStyle({ "color": "var(--gf-fg)" })}" data-v-48274c97>Add a photo</p><p class="text-[12.5px] mt-1" style="${ssrRenderStyle({ "color": "var(--gf-muted)" })}" data-v-48274c97>Tap to choose one</p></div>`);
      } else {
        _push(`<img${ssrRenderAttr("src", unref(previewUrl))} class="mx-auto max-h-36 object-contain" data-v-48274c97>`);
      }
      if (unref(isUploading)) {
        _push(ssrRenderComponent(_component_baseLoading, null, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (unref(analysis)) {
        _push(`<div class="p-6" style="${ssrRenderStyle({ "border": "1px solid var(--gf-hair)" })}" data-v-48274c97><h3 class="gf-eyebrow mb-3 flex items-center gap-2" style="${ssrRenderStyle({ "color": "var(--gf-accent)" })}" data-v-48274c97><span data-v-48274c97>✨</span> Ghost AI Analysis </h3><p class="text-[14px] leading-relaxed" style="${ssrRenderStyle({ "color": "var(--gf-fg)" })}" data-v-48274c97>${ssrInterpolate(unref(analysis))}</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/app/ImageUpload.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const __nuxt_component_1$1 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$5, [["__scopeId", "data-v-48274c97"]]), { __name: "AppImageUpload" });
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "Error",
  __ssrInlineRender: true,
  props: {
    message: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.message) {
        _push(`<div${ssrRenderAttrs(mergeProps({
          class: "flex items-start gap-3 p-4",
          style: { "border-left": "2px solid var(--gf-accent)", "background": "color-mix(in srgb, var(--gf-accent) 8%, transparent)" },
          role: "alert"
        }, _attrs))} data-v-a2819ab8><p class="text-[13.5px] leading-relaxed" style="${ssrRenderStyle({ color: "var(--gf-fg)" })}" data-v-a2819ab8>${ssrInterpolate(__props.message)}</p></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/base/Error.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const __nuxt_component_2 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$4, [["__scopeId", "data-v-a2819ab8"]]), { __name: "BaseError" });
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "ButtonNavigate",
  __ssrInlineRender: true,
  props: {
    text: { type: String, required: true, default: "" },
    href: { type: String, required: true }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<a${ssrRenderAttrs(mergeProps({
        href: props.href,
        target: "_blank",
        rel: "noopener",
        class: "inline-block px-6 py-3.5 text-[11px] uppercase tracking-[0.12em] font-semibold transition-colors",
        style: { "border": "1px solid var(--gf-accent)", "color": "var(--gf-accent)" }
      }, _attrs))}>${ssrInterpolate(props.text)}</a>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/base/ButtonNavigate.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main$3, { __name: "BaseButtonNavigate" });
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "success",
  __ssrInlineRender: true,
  props: {
    show: { type: Boolean, required: true },
    email: { type: String, default: "" },
    calendar: { type: String }
  },
  setup(__props) {
    const props = __props;
    function paletteColors() {
      return ["#B5563A"];
    }
    watch(() => props.show, (newVal) => {
      if (!newVal) return;
      confetti({
        particleCount: 90,
        spread: 62,
        startVelocity: 34,
        gravity: 0.9,
        scalar: 0.9,
        origin: { y: 0.55 },
        colors: paletteColors()
      });
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_baseButtonNavigate = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "w-full text-center py-6" }, _attrs))} data-v-69179972><div class="w-14 h-14 mx-auto mb-7 flex items-center justify-center rounded-full" style="${ssrRenderStyle({ background: "var(--gf-accent)" })}" data-v-69179972><svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--gf-bg)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" data-v-69179972><path d="M20 6 9 17l-5-5" data-v-69179972></path></svg></div><h3 class="gf-display text-[28px] mb-3" data-v-69179972>Thank you</h3><p class="text-[14.5px] leading-relaxed mb-9 max-w-[34ch] mx-auto" style="${ssrRenderStyle({ "color": "var(--gf-muted)" })}" data-v-69179972> We&#39;ve sent a confirmation to <span style="${ssrRenderStyle({ color: "var(--gf-fg)" })}" data-v-69179972>${ssrInterpolate(__props.email)}</span>. You&#39;ll hear back shortly. </p>`);
      if (__props.calendar) {
        _push(`<div class="pt-7" style="${ssrRenderStyle({ "border-top": "1px solid var(--gf-hair)" })}" data-v-69179972><p class="gf-eyebrow mb-4" style="${ssrRenderStyle({ "color": "var(--gf-muted)" })}" data-v-69179972>Rather not wait?</p>`);
        _push(ssrRenderComponent(_component_baseButtonNavigate, {
          href: __props.calendar,
          text: "Book a time directly"
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/app/success.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_3 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$2, [["__scopeId", "data-v-69179972"]]), { __name: "AppSuccess" });
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
const useImageCompression = async (file) => {
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
      return "Missing Data: Need email";
    default:
      return "Error 500, something went wrong.";
  }
}
const on_market = [
  { id: "name", label: "What's your name?", type: "text" },
  { id: "email", label: "What's your email?", type: "text" },
  { id: "phone", label: "What's your phone number?", type: "text" },
  { id: "address", label: "What's your home address?", type: "text" },
  { id: "notes", label: "Other things to note?", type: "text" }
];
const data_entry = [
  { id: "name", label: "What's your name?", type: "text" },
  { id: "email", label: "What's your email?", type: "text" },
  { id: "phone", label: "What's your phone number?", type: "text" },
  { id: "source", label: "How did you discover our business?", type: "text" },
  { id: "address", label: "What's your home address?", type: "text" },
  { id: "notes", label: "Other things to note?", type: "text" }
];
const open_house = [
  { id: "name", label: "What's your name?", type: "text" },
  { id: "email", label: "What's your email?", type: "text" },
  { id: "phone", label: "What's your phone number?", type: "text" },
  { id: "best_communication_method", label: "Best way to contact you?", type: "text" },
  { id: "seeing_an_agent", label: "Are you currently seeing an agent?", type: "text" },
  { id: "notes", label: "Other things to note?", type: "text" }
];
const data_active = [
  { id: "name", label: "What's your name?", type: "text" },
  { id: "email", label: "What's your email?", type: "text" },
  { id: "phone", label: "What's your phone number?", type: "text" },
  { id: "age", label: "What's your age?", type: "number" },
  { id: "best_communication_method", label: "Best way to contact you?", type: "text" },
  { id: "address", label: "What's your home address?", type: "text" },
  { id: "want_to_move", label: "Are you thinking about moving, if so when?", type: "text" },
  { id: "buy_sell_both", label: "Are you looking to buy, sell, or both?", type: "text" },
  { id: "price", label: "If you are selling your home, what do you think your home is worth?", type: "number" },
  { id: "sqft", label: "What would be the square footage of your home?", type: "number" },
  { id: "bedrooms", label: "How many bedrooms does your home have", type: "number" },
  { id: "bathrooms", label: "How many bathrooms does your home have", type: "number" },
  { id: "budget", label: "What is your estimated budget?", type: "number" },
  { id: "notes", label: "Are there any other details about your home?", type: "text" }
];
function useQuestions(source) {
  switch (true) {
    case source.includes("on_market"):
      return on_market;
    case source.includes("open_house"):
      return open_house;
    case source.includes("data_active"):
      return data_active;
    default:
      return data_entry;
  }
}
class GhostFormQueueDB extends Dexie {
  queue;
  constructor() {
    super("GhostFormQueueDB");
    this.version(1).stores({
      queue: "++id, createdAt"
    });
  }
}
const db = new GhostFormQueueDB();
function useFormOffline() {
  const isSyncing = ref(false);
  async function stageFormOffline(category, answers, company, imageFile) {
    try {
      await db.queue.add({
        category,
        answersJson: JSON.stringify({ ...answers, category }),
        companyJson: JSON.stringify(company),
        imageBlob: imageFile ? new Blob([imageFile], { type: imageFile.type }) : null,
        createdAt: Date.now()
      });
      return true;
    } catch (err) {
      console.error("❌ IndexedDB staging pipeline broken:", err);
      return false;
    }
  }
  async function processOfflineQueue() {
    if (isSyncing.value || !(void 0).onLine) return;
    const items = await db.queue.orderBy("createdAt").toArray();
    if (items.length === 0) return;
    isSyncing.value = true;
    console.log(`🔄 Flushing local storage: ${items.length} items staged for delivery...`);
    for (const record of items) {
      try {
        const fd = new FormData();
        fd.append("answers", new Blob([record.answersJson], { type: "application/json" }));
        fd.append("company", new Blob([record.companyJson], { type: "application/json" }));
        if (record.imageBlob) {
          fd.append("image", record.imageBlob, "offline_capture.jpg");
        }
        await $fetch("/api/lead", {
          method: "POST",
          body: fd
        });
        await db.queue.delete(record.id);
        console.log(`✅ Cached entry index #${record.id} securely transferred to database.`);
      } catch (err) {
        console.error(`❌ Dispatch block failed for record #${record.id}:`, err);
        break;
      }
    }
    isSyncing.value = false;
  }
  return {
    stageFormOffline,
    processOfflineQueue,
    isSyncing
  };
}
const LAST_KEY = "ghostform:lastConfigId";
function readStore() {
  return {};
}
function isCompleteConfig(q) {
  return Boolean(q?.id && q?.company_email && q?.category);
}
function useFormConfig() {
  const store = readStore();
  function saveConfig(query, label) {
    return;
  }
  function listConfigs() {
    return Object.values(readStore()).sort((a, b) => b.savedAt - a.savedAt);
  }
  function lastConfig() {
    return null;
  }
  function resolveConfig(query) {
    if (isCompleteConfig(query)) {
      return {
        config: {
          category: String(query.category || "realtor"),
          source: String(query.source || "default"),
          id: String(query.id),
          company_name: String(query.company_name || ""),
          company_email: String(query.company_email || ""),
          calendar: query.calendar ? String(query.calendar) : void 0,
          background_color: query.background_color ? String(query.background_color) : void 0,
          font_color: query.font_color ? String(query.font_color) : void 0,
          use_image_upload: query.use_image_upload ? String(query.use_image_upload) : void 0,
          savedAt: Date.now()
        },
        fromCache: false
      };
    }
    const cached = lastConfig();
    return { config: cached, fromCache: Boolean(cached) };
  }
  function useConfig(id) {
    const all = readStore();
    if (!all[id]) return null;
    try {
      localStorage.setItem(LAST_KEY, id);
    } catch {
    }
    return all[id];
  }
  function forgetConfig(id) {
  }
  return {
    saveConfig,
    listConfigs,
    lastConfig,
    resolveConfig,
    useConfig,
    forgetConfig,
    isCompleteConfig,
    hasSaved: computed(() => Object.keys(store).length > 0)
  };
}
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
    const { resolveConfig } = useFormConfig();
    const { config } = resolveConfig(props.routeData);
    const notConfigured = computed(() => !config);
    const category = config?.category ?? "realtor";
    const source = config?.source ?? "default";
    const id = config?.id ?? "";
    const company_name = config?.company_name ?? "";
    const company_email = config?.company_email ?? "";
    const calendar = config?.calendar;
    const use_image_upload = config?.use_image_upload;
    const step = ref(0);
    const answers = ref(leadData(category).data);
    ref({ category, id, company_name, company_email });
    const loading = ref(false);
    const setError = ref("");
    const aiResult = ref(null);
    const useUploadImage = ref(false);
    const selectedFile = ref(null);
    const userEmail = ref("");
    const showSuccess = ref(false);
    const isOnline = ref(true);
    useFormOffline();
    const questions = computed(() => useQuestions(source));
    const handleImageSelection = async (file) => {
      loading.value = true;
      try {
        const compressed = await useImageCompression(file);
        selectedFile.value = compressed;
      } catch (err) {
        console.error("Compression failed, using original file", err);
        selectedFile.value = file;
      } finally {
        loading.value = false;
      }
    };
    computed(() => selectedFile.value);
    const fieldError = ref("");
    const touched = ref(false);
    const currentField = computed(() => questions?.value?.[step.value]);
    const currentValue = computed(() => answers.value[currentField.value?.id]);
    const currentRequired = computed(() => isRequired(currentField.value?.id));
    watch(currentValue, () => {
      if (!touched.value) return;
      const res = validateField(currentField.value?.id, currentValue.value);
      fieldError.value = res.valid ? "" : res.message || "";
    });
    watch(step, () => {
      fieldError.value = "";
      touched.value = false;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_baseLoading = __nuxt_component_0$1;
      const _component_appImageUpload = __nuxt_component_1$1;
      const _component_baseError = __nuxt_component_2;
      const _component_appSuccess = __nuxt_component_3;
      let _temp0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "w-full max-w-[440px] mx-auto px-6 py-8 font-sans" }, _attrs))} data-v-9ae13943>`);
      if (notConfigured.value) {
        _push(`<div class="text-center py-10" data-v-9ae13943><p class="gf-display text-[26px] mb-3" data-v-9ae13943>This form isn&#39;t set up yet</p><p class="text-[14px] leading-relaxed" style="${ssrRenderStyle({ "color": "var(--gf-muted)" })}" data-v-9ae13943> Open your GhostForm link once while you have signal. After that it works offline, and you can add it to your home screen. </p></div>`);
      } else if (!aiResult.value) {
        _push(`<div data-v-9ae13943><div class="flex items-center gap-2.5 mb-8" data-v-9ae13943><span class="gf-eyebrow" style="${ssrRenderStyle({ "color": "var(--gf-muted)" })}" data-v-9ae13943>`);
        if (!isOnline.value) {
          _push(`<!--[--><span class="w-1.5 h-1.5 rounded-full shrink-0" style="${ssrRenderStyle({ background: isOnline.value ? "var(--gf-accent)" : "var(--gf-muted)" })}" data-v-9ae13943></span><span data-v-9ae13943>Offline — saved and sent when signal returns</span><!--]-->`);
        } else {
          _push(`<!---->`);
        }
        _push(`</span></div><div class="flex items-baseline justify-between mb-3" data-v-9ae13943><span class="gf-eyebrow" style="${ssrRenderStyle({ "color": "var(--gf-muted)" })}" data-v-9ae13943>${ssrInterpolate(String(step.value + 1).padStart(2, "0"))} — ${ssrInterpolate(String(questions.value?.length || 0).padStart(2, "0"))}</span><span class="gf-eyebrow" style="${ssrRenderStyle({ "color": "var(--gf-muted)" })}" data-v-9ae13943>${ssrInterpolate(Math.round((step.value + 1) / (questions.value?.length || 1) * 100))}% </span></div><div class="h-px w-full mb-10" style="${ssrRenderStyle({ "background": "var(--gf-hair)" })}" data-v-9ae13943><div class="h-px transition-all duration-500 ease-out" style="${ssrRenderStyle({ width: `${(step.value + 1) / (questions.value?.length || 1) * 100}%`, background: "var(--gf-accent)" })}" data-v-9ae13943></div></div><div data-v-9ae13943><label${ssrRenderAttr("for", questions.value[step.value]?.id)} class="gf-display block text-[27px] leading-[1.2] mb-2" data-v-9ae13943>${ssrInterpolate(questions.value[step.value]?.label)}</label><p class="gf-eyebrow mb-6" style="${ssrRenderStyle({ "color": "var(--gf-muted)" })}" data-v-9ae13943>${ssrInterpolate(currentRequired.value ? "Required" : "Optional — skip if you like")}</p><input${ssrRenderAttrs((_temp0 = mergeProps({
          id: questions.value[step.value]?.id
        }, unref(inputAttrs)(questions.value[step.value]?.id, questions.value[step.value]?.type), {
          name: questions.value[step.value]?.id,
          "aria-invalid": Boolean(fieldError.value),
          "aria-describedby": fieldError.value ? `${questions.value[step.value]?.id}-error` : void 0,
          class: "gf-input",
          style: fieldError.value ? { borderBottomColor: "var(--gf-accent)" } : void 0,
          autofocus: ""
        }), mergeProps(_temp0, ssrGetDynamicModelProps(_temp0, answers.value[questions.value[step.value]?.id]))))} data-v-9ae13943>`);
        if (fieldError.value) {
          _push(`<p${ssrRenderAttr("id", `${questions.value[step.value]?.id}-error`)} class="text-[13px] mt-3 leading-relaxed" style="${ssrRenderStyle({ "color": "var(--gf-accent)" })}" role="alert" data-v-9ae13943>${ssrInterpolate(fieldError.value)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        if (loading.value) {
          _push(ssrRenderComponent(_component_baseLoading, { class: "z-10" }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="mt-10" data-v-9ae13943><div class="flex items-center gap-3" data-v-9ae13943>`);
        if (step.value > 0) {
          _push(`<button class="px-5 py-3.5 text-[11px] uppercase tracking-[0.12em] font-semibold transition-colors" style="${ssrRenderStyle({ "border": "1px solid var(--gf-hair)", "color": "var(--gf-muted)" })}" data-v-9ae13943> Back </button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<button class="flex-1 px-6 py-3.5 text-[11px] uppercase tracking-[0.12em] font-semibold transition-opacity hover:opacity-90" style="${ssrRenderStyle({ background: "var(--gf-accent)", color: "var(--gf-bg)" })}" data-v-9ae13943>${ssrInterpolate(step.value === questions.value?.length - 1 ? "Send it" : "Next")}</button></div>`);
        if (unref(use_image_upload)) {
          _push(`<button class="mt-4 gf-eyebrow transition-opacity hover:opacity-70" style="${ssrRenderStyle({ "color": "var(--gf-muted)" })}" data-v-9ae13943>${ssrInterpolate(useUploadImage.value ? "— Cancel upload" : "+ Add a photo")}</button>`);
        } else {
          _push(`<!---->`);
        }
        if (useUploadImage.value) {
          _push(`<div class="mt-5" data-v-9ae13943>`);
          _push(ssrRenderComponent(_component_appImageUpload, { onFileSelected: handleImageSelection }, null, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        if (setError.value) {
          _push(`<div class="mt-6" data-v-9ae13943>`);
          _push(ssrRenderComponent(_component_baseError, {
            message: unref(errors)(setError.value)
          }, null, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<div data-v-9ae13943>`);
        _push(ssrRenderComponent(_component_appSuccess, {
          show: showSuccess.value,
          email: userEmail.value,
          calendar: unref(calendar)
        }, null, _parent));
        _push(`</div>`);
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
const __nuxt_component_1 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$1, [["__scopeId", "data-v-9ae13943"]]), { __name: "AppGhostForm" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const formId = route.params.id;
    const qualifyLeadId = computed(() => String(route.query.lead || ""));
    const isQualify = computed(() => route.query.source.includes("qualify"));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_appQualify = __nuxt_component_0$2;
      const _component_appGhostForm = __nuxt_component_1;
      if (unref(isQualify)) {
        _push(ssrRenderComponent(_component_appQualify, { "lead-id": unref(qualifyLeadId) }, null, _parent));
      } else {
        _push(ssrRenderComponent(_component_appGhostForm, {
          routeData: unref(route).query,
          id: unref(formId)
        }, null, _parent));
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-d7dfb7c1"]]);

export { index as default };
//# sourceMappingURL=index-Bk5KmtnD.mjs.map
