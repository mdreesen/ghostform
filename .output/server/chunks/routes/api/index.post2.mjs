import { c as createError, d as defineEventHandler, r as readMultipartFormData } from '../../nitro/nitro.mjs';
import { Resend } from 'resend';
import mongoose, { Schema } from 'mongoose';
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

const useRealtorCompanyEmailFormatting = (data) => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o;
  return `
    <h1>Lead Information</h1>

    <div>Source: ${(_a = data == null ? void 0 : data.source) != null ? _a : "N/A"}</div>
    <div>Name: ${(_b = data == null ? void 0 : data.name) != null ? _b : "N/A"}</div>
    <div>Age: ${(_c = data == null ? void 0 : data.age) != null ? _c : "N/A"}</div>
    <div>Email: ${(_d = data == null ? void 0 : data.email) != null ? _d : "N/A"}</div>
    <div>Phone: ${(_e = data == null ? void 0 : data.phone) != null ? _e : "N/A"}</div>
    <div>Best Communication Method: ${(_f = data == null ? void 0 : data.best_communication_method) != null ? _f : "N/A"}</div>
    <div>Address: ${data == null ? void 0 : data.address}</div>
    <div>Want To Move: ${(_g = data == null ? void 0 : data.want_to_move) != null ? _g : "N/A"}</div>
    <div>Buy, Sell, or Both: ${(_h = data == null ? void 0 : data.buy_sell_both) != null ? _h : "N/A"}</div>
    <div>Estimated Home Price: ${(_i = data == null ? void 0 : data.price) != null ? _i : "N/A"}</div>
    <div>Estimated sqft: ${(_j = data == null ? void 0 : data.sqft) != null ? _j : "N/A"}</div>
    <div>Bedrooms: ${(_k = data == null ? void 0 : data.bedrooms) != null ? _k : "N/A"}</div>
    <div>Bathrooms: ${(_l = data == null ? void 0 : data.bathrooms) != null ? _l : "N/A"}</div>
    <div>Budget: ${(_m = data == null ? void 0 : data.budget) != null ? _m : "N/A"}</div>
    <div>Notes: ${(_n = data == null ? void 0 : data.notes) != null ? _n : "N/A"}</div>
    <div>Seeing An Agent: ${(_o = data == null ? void 0 : data.seeing_an_agent) != null ? _o : "N/A"}</div>
`;
};

function useCleanString(str) {
  return str.replace(/[^a-zA-Z0-9]/g, "");
}

const resend = new Resend(`${process.env.RESEND_KEY}`);
async function emailLead(companyName, leadEmail) {
  try {
    const useCompanyName = useCleanString(companyName);
    await resend.emails.send({
      from: `${useCompanyName}@ascendpod.com`,
      to: [leadEmail],
      subject: "Your Inquiry Has Been Received!",
      html: `<div>Inquiry received.</div>
                    <div>Thank you, a specialist is currently reviewing your specifications and will provide a status update shortly.</div>
                    <div>${companyName}</div>`
    });
  } catch (error) {
    console.log(error);
    throw createError({
      statusCode: 401,
      message: "Please try again"
    });
  }
}
async function emailCompany(answers, companyEmail, imagePart) {
  try {
    await resend.emails.send({
      from: "NoReply@ascendpod.com",
      to: [companyEmail],
      subject: "\u{1F525} New Lead Inquiry \u{1F525}",
      html: useRealtorCompanyEmailFormatting(answers),
      attachments: (imagePart == null ? void 0 : imagePart.filename) ? [
        {
          filename: imagePart == null ? void 0 : imagePart.filename,
          content: imagePart == null ? void 0 : imagePart.data
          // Resend handles the Buffer automatically
        }
      ] : []
    });
  } catch (error) {
    console.log(error);
    throw createError({
      statusCode: 401,
      message: "Please try again"
    });
  }
}

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

const companyData = {
  category: "",
  company_name: "",
  company_email: ""
};

const { MONGO_URI } = process.env;
const connectDB = async () => {
  try {
    const { connection } = await mongoose.connect(MONGO_URI);
    if (connection.readyState === 1) {
      return Promise.resolve(true);
    }
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

const userSchema = new Schema({
  company: String,
  company_hashed: String,
  role: String,
  category: String,
  category_hashed: String,
  qr_code_slug: String,
  total_scans: { type: Number, default: 0 },
  leads_captured: { type: Number, default: 0 },
  name: String,
  email: { type: String, unique: true, required: true },
  email_hashed: String,
  phone: String,
  password: String,
  region: String,
  country: String,
  reset_password_token: String,
  privacy_policy: Boolean,
  paid: { type: Boolean, default: false },
  paid_tier: String,
  // Which plan they subscribed to ('shadow' | 'phantom'), set by the Stripe webhook.
  plan: { type: String, default: null },
  // Stripe subscription lifecycle - required so we can cancel on account deletion.
  stripeCustomerId: { type: String, default: null },
  stripeSubscriptionId: { type: String, default: null },
  subscriptionStatus: {
    type: String,
    // mirrors Stripe subscription statuses; 'none' = never subscribed
    enum: ["none", "active", "trialing", "past_due", "canceled", "incomplete", "incomplete_expired", "unpaid"],
    default: "none"
  },
  calendar_link: String,
  // IANA timezone (e.g. 'America/Denver'). Used so scheduled sends fire
  // at the realtor's local morning, not the server's UTC hour.
  // Falls back to 'America/Denver' when unset.
  timezone: { type: String, default: "America/Denver" },
  // How many days of silence before a lead is considered "cold" and
  // resurfaced in the daily briefing. Per-realtor tunable.
  cold_lead_after_days: { type: Number, default: 14 },
  // Whether the realtor has finished (or skipped) the guided tour.
  tour_completed: { type: Boolean, default: false },
  // ============================================================
  // Branding — used by outgoing emails AND the social card
  // generator. These belong to the REALTOR: a lead should never
  // see software branding they don't recognise.
  // ============================================================
  headshot_url: { type: String, default: "" },
  brand_color: { type: String, default: "#B5563A" },
  title_line: { type: String, default: "" },
  website: { type: String, default: "" },
  // Saved social-card look, so every card an agent makes matches the last one.
  // Consistency across a feed is the actual point of these graphics.
  cardStyle: {
    theme: { type: String, default: "light" },
    // light | dark | accent | custom
    bg: { type: String, default: "#F7F4EF" },
    fg: { type: String, default: "#1F1B16" },
    accent: { type: String, default: "#B5563A" },
    showAvatar: { type: Boolean, default: true },
    showBar: { type: Boolean, default: true },
    ratio: { type: String, default: "square" }
    // square | story | landscape
  },
  // ============================================================
  // Social voice profile — captured once, then used to make every
  // generated post sound like this specific realtor rather than
  // generic real-estate filler. Without it, AI posts all read the
  // same and agents stop using the feature.
  // ============================================================
  voice: {
    // How they talk: 'warm' | 'straight' | 'playful' | 'polished'
    tone: { type: String, default: "warm" },
    // Free text: "former teacher, two kids, obsessed with trail running"
    about: { type: String, default: "" },
    // What they want to be known for locally
    focus: { type: String, default: "" },
    // 'none' | 'some' | 'lots'
    emoji: { type: String, default: "some" },
    // 'none' | 'few' | 'many'
    hashtags: { type: String, default: "few" },
    // Words/phrases they actually use, and ones to avoid
    phrases: { type: String, default: "" },
    avoid: { type: String, default: "" },
    // Pasted samples of their real posts — by far the strongest signal
    samples: { type: String, default: "" }
  }
}, { timestamps: true });
const UserModel = mongoose.models.User || mongoose.model("User", userSchema);

const User = UserModel;
async function useUser(data) {
  if (!(data == null ? void 0 : data.company_email)) {
    throw createError({
      statusCode: 400,
      message: "Form is missing its company_email parameter \u2014 the link is incomplete."
    });
  }
  try {
    await connectDB();
  } catch (error) {
    console.error("[lead] Mongo connection failed:", error);
    throw createError({
      statusCode: 503,
      message: "Database unavailable. Check MONGO_URI."
    });
  }
  const findUser = await User.findOne({ email_hashed: data.company_email }).lean();
  if (!findUser) {
    console.error(
      "[lead] No company matched email_hashed:",
      String(data.company_email).slice(0, 12) + "\u2026",
      "- the form link may be stale, or the account regenerated its hash."
    );
    throw createError({
      statusCode: 404,
      message: "This form is not linked to an active account. Regenerate the form link."
    });
  }
  return findUser;
}

function date() {
  return (/* @__PURE__ */ new Date()).toISOString();
}

const leadSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
    // Vital index for instant dashboard lookup grouping
  },
  company_name: String,
  // Attach company name to lead
  company_email: String,
  // Attach compnay email to lead
  source: String,
  name: String,
  age: Number,
  email: String,
  phone: String,
  // Kept as string to preserve leading zeros or symbols safely
  best_communication_method: String,
  address: String,
  want_to_move: String,
  buy_sell_both: String,
  price: Number,
  sqft: Number,
  bedrooms: Number,
  bathrooms: Number,
  budget: Number,
  notes: String,
  seeing_an_agent: String,
  // ── Qualification (the deep-dive questionnaire) ──────────────
  // Sent once a lead gets serious. Answers are keyed by question id
  // (q_timeline, q_financing, ...) — see server/utils/qualificationQuestions.ts
  qualification: {
    sentAt: Date,
    completedAt: Date,
    intent: String,
    // 'buy' | 'sell'
    answers: { type: Object, default: {} }
  },
  // Cached analysis so the dashboard doesn't re-run (and re-bill) the model
  // on every page view. Regenerated only when asked or on new answers.
  analysis: {
    readiness: Number,
    readinessLabel: String,
    financingRisk: String,
    signals: [String],
    gaps: [String],
    read: String,
    nextSteps: [String],
    source: String,
    generatedAt: Date
  },
  ai_analysis: String,
  status: { type: String, default: "new" },
  date: { type: String, default: () => (/* @__PURE__ */ new Date()).toISOString() },
  reminderSent: { type: Boolean, default: false },
  reminderStatus: {
    type: String,
    enum: ["none", "scheduled", "sent"],
    default: "none"
    // 'none' means automation is disabled for this specific lead
  },
  reminderScheduledAt: {
    type: Date,
    required: false
  },
  // ============================================================
  // Contact tracking — powers the daily "who to contact" briefing.
  // lastContactedAt is stamped every time we email a lead (manual
  // reminder, campaign blast) OR the realtor logs an outreach.
  // Older leads created before this field existed fall back to
  // createdAt / updatedAt inside the briefing engine.
  // ============================================================
  lastContactedAt: {
    type: Date,
    required: false,
    index: true
    // Indexed so cold-lead scans stay fast at volume
  },
  contactCount: {
    type: Number,
    default: 0
    // How many touches this lead has received from us
  }
}, { timestamps: true });
const LeadModel = mongoose.models.Lead || mongoose.model("Lead", leadSchema);

const Lead = LeadModel;
async function useLead(companyId, companyEmail, companyName, answers) {
  if (!companyId) {
    throw createError({
      statusCode: 400,
      message: "Cannot save a lead without a company id."
    });
  }
  try {
    await connectDB();
    const created = await Lead.create({
      userId: companyId,
      company_email: companyEmail,
      company_name: companyName,
      ...answers,
      date: date()
    });
    return created;
  } catch (error) {
    if ((error == null ? void 0 : error.name) === "ValidationError") {
      const fields = Object.keys(error.errors || {}).join(", ");
      console.error("[lead] Validation failed on:", fields, error.message);
      throw createError({
        statusCode: 400,
        message: `Lead rejected \u2014 invalid or missing: ${fields || "unknown field"}`
      });
    }
    console.error("[lead] Save failed:", error);
    throw createError({
      statusCode: 500,
      message: (error == null ? void 0 : error.message) || "Could not save the lead."
    });
  }
}

const index_post = defineEventHandler(async (event) => {
  var _a, _b;
  const formData = await readMultipartFormData(event);
  const answersPart = formData == null ? void 0 : formData.find((item) => item.name === "answers");
  const companyPart = formData == null ? void 0 : formData.find((item) => item.name === "company");
  const imagePart = formData == null ? void 0 : formData.find((item) => item.name === "image");
  let answers = leadData;
  let company = companyData;
  try {
    if (answersPart) answers = JSON.parse(answersPart.data.toString("utf-8"));
    if (companyPart) company = JSON.parse(companyPart.data.toString("utf-8"));
  } catch (error) {
    throw createError({ statusCode: 400, message: "Malformed form payload." });
  }
  if (!(answers == null ? void 0 : answers.email)) {
    throw createError({ statusCode: 400, message: "Missing data: Need email" });
  }
  const findCompany = await useUser(company);
  const companyId = findCompany == null ? void 0 : findCompany._id;
  const companyEmail = findCompany == null ? void 0 : findCompany.email;
  const companyName = (_a = findCompany == null ? void 0 : findCompany.company) != null ? _a : "NoReply";
  const leadEmail = answers == null ? void 0 : answers.email;
  const savedLead = await useLead(companyId, companyEmail, companyName, answers);
  const notifications = await Promise.allSettled([
    emailLead(companyName, leadEmail),
    emailCompany(answers, companyEmail, imagePart)
  ]);
  notifications.forEach((result, i) => {
    var _a2;
    if (result.status === "rejected") {
      console.error(
        `[lead] Notification ${i === 0 ? "to lead" : "to company"} failed:`,
        ((_a2 = result.reason) == null ? void 0 : _a2.message) || result.reason
      );
    }
  });
  const emailsFailed = notifications.some((n) => n.status === "rejected");
  return {
    status: "success",
    leadId: String((_b = savedLead == null ? void 0 : savedLead._id) != null ? _b : ""),
    // Surfaced so the UI could warn if desired; the capture itself is safe.
    emailsFailed
  };
});

export { index_post as default };
//# sourceMappingURL=index.post2.mjs.map
