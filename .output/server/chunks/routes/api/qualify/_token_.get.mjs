import { d as defineEventHandler, c as createError } from '../../../nitro/nitro.mjs';
import { c as connectDB, L as LeadModelImport } from '../../../_/Lead.mjs';
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
import 'mongoose';

const LeadModel = LeadModelImport;
const _token__get = defineEventHandler(async (event) => {
  var _a, _b, _c;
  const token = ((_a = event.context.params) == null ? void 0 : _a.token) || "";
  const parsed = readQualifyToken(token);
  if (!parsed) {
    throw createError({ statusCode: 401, message: "This link is not valid or has expired." });
  }
  await connectDB();
  const lead = await LeadModel.findById(parsed.leadId).lean();
  if (!lead) throw createError({ statusCode: 404, message: "We could not find that record." });
  const intent = ((_b = lead == null ? void 0 : lead.qualification) == null ? void 0 : _b.intent) || (lead == null ? void 0 : lead.buy_sell_both) || "buy";
  return {
    firstName: String(lead.name || "").split(" ")[0] || "",
    intent,
    // Already done? The capture app shows a "thanks, already received" state
    // rather than letting them fill it in twice.
    completed: Boolean((_c = lead == null ? void 0 : lead.qualification) == null ? void 0 : _c.completedAt),
    questions: questionsFor(intent).map((q) => {
      var _a2;
      return {
        id: q.id,
        label: q.label,
        type: q.type,
        options: (_a2 = q.options) != null ? _a2 : null
      };
    })
  };
});

export { _token__get as default };
//# sourceMappingURL=_token_.get.mjs.map
