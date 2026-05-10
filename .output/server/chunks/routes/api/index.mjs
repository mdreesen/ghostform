import { c as createError, d as defineEventHandler, r as readMultipartFormData } from '../../nitro/nitro.mjs';
import { Resend } from 'resend';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
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

const resend = new Resend(`${process.env.RESEND_KEY}`);
async function emailLead(aiOutput, data) {
  try {
    await resend.emails.send({
      from: "NoReply@ascendpod.com",
      to: [data == null ? void 0 : data.email],
      subject: "Your Job Inquiry",
      html: aiOutput
    });
  } catch (error) {
    console.log(error);
    throw createError({
      statusCode: 401,
      message: "Please try again"
    });
  }
}
async function emailCompany(aiOutput, data, image) {
  try {
    await resend.emails.send({
      from: "NoReply@ascendpod.com",
      to: [data == null ? void 0 : data.company_email],
      subject: "Your Lead Inquiry",
      html: aiOutput,
      attachments: (image == null ? void 0 : image.filename) ? [
        {
          filename: image == null ? void 0 : image.filename,
          content: image == null ? void 0 : image.data
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

const lead_construction = (data) => `
Lead Name: ${data.name}
Project Goal: ${data.goal}
Budget: $${data.budget}
Message: ${data.message}
Address: ${data.address}

If there is a picture attached:
Based on the attached photo of the current deck, identify potential structural issues, 
confirm if the ${data.sqft} sqft estimate looks accurate, and suggest 2-3 next steps.
If no picture do not analyze a photo and do not do that step.

Analyze the following lead data:
1. Lead Name: ${data == null ? void 0 : data.name}
2. Project Goal: ${data == null ? void 0 : data.goal}
3. Approximate Square Footage: ${data == null ? void 0 : data.sqft}
4. Budget Provided: ${data == null ? void 0 : data.budget}
5. Message Provided: ${data == null ? void 0 : data.message}

Please wrap each seperated section with <div></div> as this uses resend email.
Also have it have an extra space per each section.
`;

const lead_realtor = (data) => `
If there is a picture attached:
Based on the attached photo analyze the image of their home along with where the house is located ${data.address}.
If no picture do not analyze a photo and do not do that step.

Analyze the following lead data:
Address: ${data.address}
Lead wants to move: ${data.want_to_move}
Lead wants to buy, sell, buy and sell: ${data.buy_sell_both}
Lead's estimated home price: ${data.price}
Lead's estimated home sqft: ${data.sqft}
Leads's bedrooms count: ${data.bedrooms}
Lead's bathroom count: ${data.bathrooms}
Budget: $${data.budget}
Message: ${data.message}

Please wrap each seperated section with <div></div> as this uses resend email.
Also have it have an extra space per each section.
`;

function analyze_lead(data) {
  switch (true) {
    case data.category.includes("realtor"):
      return lead_realtor(data);
    case data.category.includes("construction"):
      return lead_construction(data);
  }
}

function date() {
  return (/* @__PURE__ */ new Date()).toISOString();
}

const materials$1 = `
Member of NAR: Unlike general real estate agents, Realtors must join the National Association of Realtors, which pledges them to a higher ethical standard.
Roles and Responsibilities: Seller's Agent (Listing Agent): Advises on pricing, staging, and markets the home to secure the best price.
Buyer's Agent: Locates properties, arranges viewings, and prepares strong offers.
Transactional Agent: Manages inspections, coordinates with lenders, handles paperwork, and ensures a smooth closing process.
Expertise: Realtors possess in-depth local market knowledge, including property taxes, zoning, and neighborhood trends.
Compensation: They are generally paid a commission, which is a percentage of the total sale price, often split between the buyer's and seller's agents.
Realtor.com OverviewRealtor.com is a leading, officially affiliated website that provides comprehensive real estate listings, tools, and resources for property hunters. 
It helps users search for homes, estimate budgets, and connect with professionals.
`;
const materials_expanded$1 = `
A REALTOR\xAE is a licensed real estate professional who is a member of the National Association of REALTORS\xAE (NAR). 
The term REALTOR\xAE is a registered collective membership mark, distinguishing them from general real estate agents. They are bound by a strict Code of Ethics that requires them to prioritize their clients' interests and operate with honesty and integrity.
Broader Scope of ServicesBeyond simply showing homes, a REALTOR\xAE provides comprehensive services across the real estate spectrum: Residential & Commercial: They handle buying, selling, or renting properties, including residential homes, commercial properties, and land.
Advisory & Strategy: They advise clients on market conditions, property pricing through comparative market analysis, and investment potential.
Marketing & Listing: They promote properties via the Multiple Listing Service (MLS), social media, and professional staging, ensuring maximum exposure.
Transaction Management: They handle the complex paperwork, including purchase agreements, disclosures, and closing statements.
Negotiation & Advocacy: They act as intermediaries, negotiating on behalf of their clients to secure the best price and terms.
Specialized Expertise: Many hold designations (e.g., SRES for seniors, CIPS for international) to serve specific client needs.
The "REALTOR Difference"Ethics & Professionalism: They must follow the NAR Code of Ethics, which includes putting clients first.
Expertise: They maintain high standards through ongoing education and in-depth knowledge of local laws, market trends, and regulations.
Consumer Protection: Their training helps clients navigate complex legal and financial risks, such as disclosures, inspections, and appraisals.
Key DistinctionsREALTOR\xAE vs. Agent: While all REALTORS\xAE are agents, not all agents are REALTORS\xAE. Those who are not members of NAR cannot use the trademarked title.
Broker vs. Agent: A real estate broker has completed additional training and can manage their own firm, while agents must work under a broker.
With over 1.5 million members as of ${date}, REALTORS\xAE are significant players in the US real estate industry, providing guidance from initial approval to closing
`;

const ai_job$1 = `
You are the a Strategic Lead Analyst. You specialize in high-stakes residential and commercial real estate logistics. 
Your objective is to dissect raw data and produce an "Investment Grade" brief. 
You are not just summarizing; you are calculating Conversion Velocity and Equity Potential.

Expanded Analysis Parameters:
Tier 1 (Immediate Acquisition):
Indicators: Move timeline < 90 days. Budget is \u2265 15% of estimated home value (indicating serious intent or high equity).
Focus: Immediate physical meeting/contracting.

Tier 3 (Information Only / Low-Value):
Indicators: Budget is < 5% of project scope (delusional expectations). Timeline is "Just exploring."
Focus: Automated drip campaign; low-touch.
`;
const use_realtor = (data) => `
Your Job: ${ai_job$1}
${materials$1}
${materials_expanded$1}

Instructions:
1. ${ai_job$1}
2. Use their address ${data.address} to determine house rate and interest
3. Calculate an estimated house price they could afford based off of the latest ${date()} intesting rate, where they are ${data.address}, and their budget ${data.budget}.
4. Constraint: Do not be conversational. Do not say "Thanks for reaching out." Only provide the analysis.
`;

const materials = `
Concrete & Masonry: Concrete materials, admixtures, repair products, cement, masonry units, and mortar.
Structural Materials & Metals: Structural steel, reinforcing bars (rebar), wood/composites, and aluminum products.
Building Envelope (Thermal & Moisture Protection): Waterproofing membranes, insulation, cladding, roofing systems, sealants, and adhesives.
Openings (Doors & Windows): Doors, windows, hardware, and glazing systems.
Finishes & Interior: Drywall, flooring systems (epoxy, tile), paint, and ceiling materials.
MEP Systems: Plumbing fixtures, HVAC units, fire suppression, and electrical equipment.
Specialties & Equipment: Specialized construction components, signage, and construction machinery.
Site Work & Infrastructure: Earthwork materials, site improvement materials (paving), and underground utilities.
`;
const materials_expanded = `
1. Advanced Structural & Framing Materials
Modern builds are shifting toward materials that offer both speed and sustainability. Cross-Laminated Timber (CLT) and Engineered Wood are becoming standard for mid-rise projects due to their strength and carbon-sequestering properties.
Reinforcement: Steel Rebars and mesh for high-tensile concrete foundations and slabs.
Framing: Engineered lumber, Bamboo Plywood, and structural steel beams for wide-span commercial areas.
Walling: AAC (Autoclaved Aerated Concrete) Blocks for lightweight, fire-resistant, and soundproof interior partitions.

2. High-Performance Building Envelope
The "skin" of the building now requires integrated energy management. In this ${date()}, TPO (Thermoplastic Polyolefin) is the preferred commercial roofing choice for its heat-reflective properties.
Commercial Roofing: Weatherbond TPO White Membrane offers energy efficiency and a tough, leak-resistant seal. For edge details, TPO Coated Metal provides a seamless transition from roof to fascia.
Insulation: Aerogel panels and high-R-value spray foams to meet the stricter ${date()} energy codes.

3. Precision Equipment & Earthmoving
Miniaturization and hybrid power are the key trends for site equipment. These units are essential for precision trenching and foundation work in confined residential or commercial sites.
Compact Machinery: The Mountain Road Excavator WM-WJJ25 is a multi-functional unit capable of 360\xB0 rotation and specialized digging up to 2291mm.
Heavy Duty: For larger civil projects, units like the Liugong 933E Crawler Excavator provide the 33-ton power needed for massive excavation and material handling.

4. Site Technology & Digital TwinsDigital Project Delivery (DPD) is now a contractually expected standard. Drones are used daily for volumetric analysis and progress tracking.Mapping Drones: The DJI Matrice 4E automates large-site surveys with 5-directional oblique capture, significantly reducing manual surveying time.Safety & Inspection: The Matrice 4T Survey Package includes thermal imaging to detect insulation gaps or equipment overheating before they become liabilities.Software: DJI Terra and BIM (Building Information Modeling) platforms are used to create 3D "Digital Twins" of the job site for real-time coordination.

5. Specialized Safety & PPE
Safety gear has evolved into "wearable tech" that prioritizes both impact protection and worker comfort.
Smart Helmets: The Studson SHK-1 Full Brim Vented Helmet uses integrated Koroyd technology for better energy absorption and is dual-certified for both Type 1 and Type 2 impacts.
On-Site PPE: High-visibility gear like the Pyramex HP241 Full Brim Hard Hat remains a staple for budget-conscious site compliance.
`;

const ai_job = `
    Analyze the provided form data and categorize the lead into exactly one of these three labels: [Tier 1, Tier 2, Tier 3].
    Evaluation Rules:

    SCORING RUBRIC (0-100) for tiers
    1. Intent (40%): Does the lead have a specific problem they need solved now or does budget is >$50k AND project is 'Commercial'?
    2. Technical Fit (30%): Does their project align with our technical capabilities?
    3. Urgency (30%): Are they looking to start within 30 days or if timeline is 'ASAP'?

    If the message is vague or 'just testing', Label - analyze this and see where the rank is on preference.

    Output Format: Provide the Label followed by a 1-sentence reasoning.
`;
const use_construction_contractor = (data) => `You are a Senior Project Estimator. Your only job is to analyze lead data and output structured business intel.
Keep in mind a bunch of materials: 
${materials}
${materials_expanded}

Instructions:
1. ${ai_job}
2. Determine the area conditions for this project using their address ${data.address}
3. Determine the project category (e.g., Deck, Remodel, New Build).
4. Calculate an estimated price based on $200/sqft for interior and $50/sqft for exterior.
5. Identify specific company needs (e.g., "Needs site visit," "Needs architectural plans").
6. Constraint: Do not be conversational. Do not say "Thanks for reaching out." Only provide the analysis.
`;

const use_ai_category_role = (data) => {
  switch (true) {
    case data.category.includes("realtor"):
      return use_realtor(data);
    case data.category.includes("construction"):
      return use_construction_contractor(data);
  }
};

const useRealtorLeadEmailFormatting = (data) => `
    A new lead named ${data == null ? void 0 : data.name}. 
    Write a 3-sentence email thanking them, 
    mentioning one specific detail you see in the message, 
    and telling them a human will call them shortly.

    End the email with:
    Best regards,
    ${data == null ? void 0 : data.company_name}

    Let new lines be wrapped in a <div></div> element
`;

const useConstructionLeadEmailFormatting = (data) => `
    A new lead named ${data == null ? void 0 : data.name}. 
    Write a 3-sentence email thanking them, 
    mentioning one specific detail you see in the message, 
    and telling them a human will call them shortly.

    End the email with:
    Best regards,
    ${data == null ? void 0 : data.company_name}

    Let new lines be wrapped in a <div></div> element
`;

const useRealtorCompanyEmailFormatting = (data, text) => `
    <h1>Lead Information</h1>
    <div>Lead Name: ${data.name}</div>
    <div>Age: ${data.age}</div>
    <div>Email: ${data.email}</div>
    <div>Phone: ${data.phone}</div>
    <div>Address: ${data.address}</div>
    <div>Lead wants to move: ${data.want_to_move}</div>
    <div>Lead wants to buy, sell, buy and sell (both): ${data.buy_sell_both}</div>
    <div>Lead's estimated home price: ${data.price}</div>
    <div>Lead's estimated home sqft: ${data.sqft}</div>
    <div>Leads's bedroom count: ${data.bedrooms}</div>
    <div>Lead's bathroom count: ${data.bathrooms}</div>
    <div> Budget: $${data.budget}</div>
    <div>Message: ${data.message}</div>

    <h2>AI Analysis:</h2>
    ${text}
    Let new lines be wrapped in a <div></div> element
`;

const useConstructionCompanyEmailFormatting = (data, text) => `
    <h1>Lead Information</h1>
    <div>Lead Name: ${data == null ? void 0 : data.name}</div>
    <div>Lead Email: ${data == null ? void 0 : data.email}</div>
    <div>Project Goal: ${data == null ? void 0 : data.goal}</div>
    <div>Square Footage: ${data == null ? void 0 : data.sqft}</div>
    <div>Budget: ${data == null ? void 0 : data.budget}</div>
    <div>Message Details: ${data == null ? void 0 : data.message}</div>

    <h2>AI Analysis:</h2>
    ${text}
`;

function useLeadEmailFormatting(data) {
  switch (true) {
    case data.category.includes("realtor"):
      return useRealtorLeadEmailFormatting(data);
    case data.category.includes("construction"):
      return useConstructionLeadEmailFormatting(data);
  }
}
function useCompanyEmailFormatting(data, text) {
  switch (true) {
    case data.category.includes("realtor"):
      return useRealtorCompanyEmailFormatting(data, text);
    case data.category.includes("construction"):
      return useConstructionCompanyEmailFormatting(data, text);
  }
}

async function aiClient(data) {
  const { text } = await generateText({
    model: openai("gpt-4o-mini"),
    system: `You are an assistant for a Construction Company. 
         Be professional and helpful`,
    prompt: useLeadEmailFormatting(data)
  });
  return text;
}
async function aiCompany(data) {
  var _a;
  const useLeadAnalysis = analyze_lead(data);
  const useRole = use_ai_category_role(data);
  const { text } = await generateText({
    model: openai("gpt-4o-mini"),
    system: useRole,
    messages: ((_a = data == null ? void 0 : data.imagePart) == null ? void 0 : _a.data) ? [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: useLeadAnalysis
          },
          {
            type: "image",
            image: new Uint8Array(data.imagePart.data),
            mediaType: data.imagePart.type || "image/jpeg"
          }
        ]
      }
    ] : [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: useLeadAnalysis
          }
        ]
      }
    ]
  });
  const aiOutput = useCompanyEmailFormatting(data, text);
  return aiOutput;
}

const index = defineEventHandler(async (event) => {
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
    const imagePart = formData == null ? void 0 : formData.find((item) => item.name === "image");
    const useAiClient = await aiClient({ ...answers, ...company });
    const useAiCompany = await aiCompany({ ...imagePart, ...answers, ...company });
    if (!(answers == null ? void 0 : answers.email)) throw createError({ statusCode: 400, message: "Missing data" });
    await emailLead(useAiClient, answers);
    await emailCompany(useAiCompany, company, imagePart);
    return { status: "success", aiResponse: useAiCompany };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Validation Details:", JSON.stringify(error.cause, null, 2));
    } else {
      console.log("An unknown error occurred");
    }
    throw error;
  }
});

export { index as default };
//# sourceMappingURL=index.mjs.map
