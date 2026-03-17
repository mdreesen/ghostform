import { defineComponent, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrInterpolate, ssrRenderDynamicModel, ssrRenderAttr } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const step = ref(0);
    const answers = ref({ name: "", goal: "", budget: "" });
    ref(false);
    const aiResult = ref(null);
    const questions = [
      { id: "name", label: "What's your name?", type: "text" },
      { id: "goal", label: "What can we help you build?", type: "text" },
      { id: "budget", label: "What is your estimated budget?", type: "number" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-zinc-950 text-white flex items-center justify-center p-6 font-sans" }, _attrs))} data-v-e167a4b6>`);
      if (!unref(aiResult)) {
        _push(`<div class="max-w-md w-full space-y-8" data-v-e167a4b6><div class="h-1 bg-zinc-800 rounded-full" data-v-e167a4b6><div class="h-1 bg-blue-500 transition-all duration-500" style="${ssrRenderStyle({ width: `${(unref(step) + 1) / questions.length * 100}%` })}" data-v-e167a4b6></div></div><div class="space-y-4" data-v-e167a4b6><label class="block text-2xl font-medium" data-v-e167a4b6>${ssrInterpolate(questions[unref(step)].label)}</label><input${ssrRenderDynamicModel(questions[unref(step)].type, unref(answers)[questions[unref(step)].id], null)}${ssrRenderAttr("type", questions[unref(step)].type)} class="w-full bg-transparent border-b-2 border-zinc-700 py-2 text-xl focus:border-blue-500 outline-none transition-colors" autofocus data-v-e167a4b6></div><button class="bg-blue-600 px-6 py-2 rounded-lg hover:bg-blue-500 transition" data-v-e167a4b6>${ssrInterpolate(unref(step) === questions.length - 1 ? "Finish" : "Next")}</button></div>`);
      } else {
        _push(`<div class="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 max-w-lg" data-v-e167a4b6><h2 class="text-green-400 font-bold mb-2" data-v-e167a4b6>AI Analysis Complete</h2><p class="text-zinc-400 mb-4 italic" data-v-e167a4b6>&quot;${ssrInterpolate(unref(aiResult).suggestedReply)}&quot;</p><div class="flex gap-4" data-v-e167a4b6><span class="px-3 py-1 bg-zinc-800 rounded text-sm capitalize" data-v-e167a4b6>Priority: ${ssrInterpolate(unref(aiResult).priority)}</span></div></div>`);
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
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-e167a4b6"]]);

export { index as default };
//# sourceMappingURL=index-Cc1Zf1V8.mjs.map
