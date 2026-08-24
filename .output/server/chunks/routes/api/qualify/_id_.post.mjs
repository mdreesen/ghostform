import { d as defineEventHandler, c as createError, a as readBody } from '../../../nitro/nitro.mjs';
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
const _id__post = defineEventHandler(async (event) => {
  var _a, _b;
  const id = (_a = event.context.params) == null ? void 0 : _a.id;
  if (!id || !/^[a-f0-9]{24}$/i.test(id)) {
    throw createError({ statusCode: 400, message: "That link does not look right." });
  }
  const body = await readBody(event);
  const answers = body == null ? void 0 : body.answers;
  if (!answers || typeof answers !== "object") {
    throw createError({ statusCode: 400, message: "No answers were received." });
  }
  await connectDB();
  const lead = await LeadModel.findById(id);
  if (!lead) throw createError({ statusCode: 404, message: "We could not find that record." });
  const intent = ((_b = lead == null ? void 0 : lead.qualification) == null ? void 0 : _b.intent) || (lead == null ? void 0 : lead.buy_sell_both) || "buy";
  await LeadModel.updateOne({ _id: id }, {
    $set: {
      "qualification.answers": answers,
      "qualification.completedAt": /* @__PURE__ */ new Date(),
      "qualification.intent": intent
    }
  });
  return { success: true };
});

export { _id__post as default };
//# sourceMappingURL=_id_.post.mjs.map
