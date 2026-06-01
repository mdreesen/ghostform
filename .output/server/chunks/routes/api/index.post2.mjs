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
  calendar_link: String
}, { timestamps: true });
const UserModel = mongoose.models.User || mongoose.model("User", userSchema);

const User = UserModel;
async function useUser(data) {
  try {
    await connectDB();
    const findUser = await User.find({ email_hashed: data.company_email }).lean();
    if (findUser[0]) {
      return findUser[0];
    }
    ;
  } catch (error) {
    console.log(error);
    throw createError({
      statusCode: 500,
      statusMessage: "Something went wrong."
    });
  }
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
  }
}, { timestamps: true });
const LeadModel = mongoose.models.Lead || mongoose.model("Lead", leadSchema);

const Lead = LeadModel;
async function useLead(companyId, companyEmail, companyName, answers) {
  try {
    await connectDB();
    await Lead.create({ userId: companyId, company_email: companyEmail, company_name: companyName, ...answers, date: date() });
  } catch (error) {
    console.log(error);
    throw createError({
      statusCode: 500,
      statusMessage: "Something went wrong."
    });
  }
}

const index_post = defineEventHandler(async (event) => {
  var _a;
  try {
    const formData = await readMultipartFormData(event);
    const answersPart = formData == null ? void 0 : formData.find((item) => item.name === "answers");
    const companyPart = formData == null ? void 0 : formData.find((item) => item.name === "company");
    let answers = leadData;
    let company = companyData;
    if (answersPart) {
      const jsonString = answersPart.data.toString("utf-8");
      answers = JSON.parse(jsonString);
    }
    ;
    if (companyPart) {
      const jsonString = companyPart.data.toString("utf-8");
      company = JSON.parse(jsonString);
    }
    ;
    if (!(answers == null ? void 0 : answers.email)) throw createError({ statusCode: 400, message: "Missing data: Need email" });
    const findCompany = await useUser(company);
    const imagePart = formData == null ? void 0 : formData.find((item) => item.name === "image");
    const companyId = findCompany == null ? void 0 : findCompany._id;
    const companyEmail = findCompany == null ? void 0 : findCompany.email;
    const companyName = (_a = findCompany == null ? void 0 : findCompany.company) != null ? _a : "NoReply";
    const leadEmail = answers == null ? void 0 : answers.email;
    await useLead(companyId, companyEmail, companyName, answers);
    await emailLead(companyName, leadEmail);
    await emailCompany(answers, companyEmail, imagePart);
    return { status: "success" };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Validation Details:", JSON.stringify(error.cause, null, 2));
    } else {
      console.log("An unknown error occurred");
    }
    throw error;
  }
});

export { index_post as default };
//# sourceMappingURL=index.post2.mjs.map
