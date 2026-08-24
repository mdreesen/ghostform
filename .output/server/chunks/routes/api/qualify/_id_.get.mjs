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

const BUYER_QUESTIONS = [
  {
    id: "q_timeline",
    label: "When would you ideally like to be in a new place?",
    type: "choice",
    options: ["Within 30 days", "1-3 months", "3-6 months", "6-12 months", "Just exploring"]
  },
  {
    id: "q_financing",
    label: "Where are you at with financing?",
    type: "choice",
    options: ["Paying cash", "Fully pre-approved", "Pre-qualified, not yet approved", "Talked to a lender, nothing formal", "Haven't started"]
  },
  { id: "q_lender", label: "Who are you working with for the loan? (if anyone)", type: "text" },
  { id: "q_budget_max", label: "What is the most you would be comfortable spending?", type: "number" },
  { id: "q_must_haves", label: "What are your absolute must-haves?", type: "long" },
  { id: "q_deal_breakers", label: "What would rule a house out completely?", type: "long" },
  {
    id: "q_current_situation",
    label: "What is your current living situation?",
    type: "choice",
    options: ["Renting - lease ends soon", "Renting - flexible", "Own, need to sell first", "Own, do not need to sell first", "Other"]
  },
  { id: "q_areas", label: "Which areas are you considering?", type: "text" },
  { id: "q_seen_anything", label: "Have you seen anything you liked so far?", type: "long" },
  { id: "q_decision", label: "Is anyone else involved in the decision?", type: "text" },
  { id: "q_motivation", label: "What is prompting the move?", type: "long" },
  { id: "q_concerns", label: "Anything worrying you about the process?", type: "long" }
];
const SELLER_QUESTIONS = [
  {
    id: "q_timeline",
    label: "When would you like to have it sold?",
    type: "choice",
    options: ["As soon as possible", "1-3 months", "3-6 months", "6-12 months", "Just considering"]
  },
  { id: "q_reason", label: "What is prompting the sale?", type: "long" },
  { id: "q_price_expectation", label: "What do you think the home is worth?", type: "number" },
  { id: "q_price_basis", label: "What is that based on?", type: "text" },
  { id: "q_mortgage", label: "Roughly how much is still owed on the property?", type: "number" },
  { id: "q_condition", label: "What condition is it in? Anything that needs work?", type: "long" },
  { id: "q_improvements", label: "What have you updated while you have owned it?", type: "long" },
  {
    id: "q_listed_before",
    label: "Has it been listed before?",
    type: "choice",
    options: ["No", "Yes - expired", "Yes - withdrew it", "Yes - currently listed"]
  },
  {
    id: "q_buying_too",
    label: "Are you buying something else as well?",
    type: "choice",
    options: ["Yes, locally", "Yes, out of the area", "No", "Not sure yet"]
  },
  { id: "q_flexibility", label: "How flexible are you on timing and price?", type: "long" },
  { id: "q_decision", label: "Is anyone else involved in the decision?", type: "text" },
  { id: "q_concerns", label: "Anything worrying you about selling?", type: "long" }
];
function questionsFor(intent) {
  return String(intent).toLowerCase().includes("sell") ? SELLER_QUESTIONS : BUYER_QUESTIONS;
}

const LeadModel = LeadModelImport;
const _id__get = defineEventHandler(async (event) => {
  var _a, _b, _c;
  const id = (_a = event.context.params) == null ? void 0 : _a.id;
  if (!id || !/^[a-f0-9]{24}$/i.test(id)) {
    throw createError({ statusCode: 400, message: "That link does not look right." });
  }
  await connectDB();
  const lead = await LeadModel.findById(id).lean();
  if (!lead) throw createError({ statusCode: 404, message: "We could not find that record." });
  const intent = ((_b = lead == null ? void 0 : lead.qualification) == null ? void 0 : _b.intent) || (lead == null ? void 0 : lead.buy_sell_both) || "buy";
  return {
    firstName: String(lead.name || "").split(" ")[0] || "",
    intent,
    completed: Boolean((_c = lead == null ? void 0 : lead.qualification) == null ? void 0 : _c.completedAt),
    questions: questionsFor(intent)
  };
});

export { _id__get as default };
//# sourceMappingURL=_id_.get.mjs.map
