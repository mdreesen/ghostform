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
    console.log("emailing: Email sent to lead");
  } catch (error) {
    console.log(error);
    throw createError({
      statusCode: 401,
      message: "Please try again"
    });
  }
}
async function emailCompany(aiOutput, data) {
  try {
    await resend.emails.send({
      from: "NoReply@ascendpod.com",
      to: [data == null ? void 0 : data.company_email],
      subject: "Your Lead Inquiry",
      html: aiOutput
    });
    console.log("emailing: Email sent to Company");
  } catch (error) {
    console.log(error);
    throw createError({
      statusCode: 401,
      message: "Please try again"
    });
  }
}

const leadData = {
  name: "",
  email: "",
  address: "",
  goal: "",
  sqft: "",
  budget: "",
  message: ""
};

const companyData = {
  category: "",
  company_name: "",
  company_email: ""
};

const analyze_lead = (data) => `
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

function date() {
  return (/* @__PURE__ */ new Date()).toISOString();
}

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
The "skin" of the building now requires integrated energy management. In this ${date}, TPO (Thermoplastic Polyolefin) is the preferred commercial roofing choice for its heat-reflective properties.
Commercial Roofing: Weatherbond TPO White Membrane offers energy efficiency and a tough, leak-resistant seal. For edge details, TPO Coated Metal provides a seamless transition from roof to fascia.
Insulation: Aerogel panels and high-R-value spray foams to meet the stricter ${date} energy codes.

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

const role = `
    Analyze the provided form data and categorize the lead into exactly one of these three labels: [Tier 1, Tier 2, Tier 3].
    Evaluation Rules:

    If budget is >$50k AND project is 'Commercial', Label = 'Tier 1'.
    If timeline is 'ASAP', upgrade one Tier.
    If the message is vague or 'just testing', Label = 'Tier 3'.

    Output Format: Provide the Label followed by a 1-sentence reasoning.
`;

const construction_role = (address) => `You are a Senior Project Estimator. Your only job is to analyze lead data and output structured business intel.
Keep in mind a bunch of materials: 
${materials}
${materials_expanded}

Instructions:
1. ${role}
2. Determine the area conditions for this project using their address ${address}
3. Determine the project category (e.g., Deck, Remodel, New Build).
4. Calculate an estimated price based on $200/sqft for interior and $50/sqft for exterior.
5. Identify specific company needs (e.g., "Needs site visit," "Needs architectural plans").
6. Constraint: Do not be conversational. Do not say "Thanks for reaching out." Only provide the analysis.
`;

async function aiClient(data) {
  const { text } = await generateText({
    model: openai("gpt-4o-mini"),
    system: `You are an assistant for a Construction Company. 
         Be professional and helpful`,
    prompt: `A new lead named ${data == null ? void 0 : data.name}. 
         Write a 3-sentence email thanking them, 
         mentioning one specific detail you see in the message, 
         and telling them a human will call them shortly.

        End the email with:
        Best regards,
        ${data == null ? void 0 : data.company_name}
         
        Let new lines be wrapped in a <div></div> element
        `
  });
  return text;
}
async function aiCompany(data) {
  var _a;
  const useLeadAnalysis = analyze_lead(data);
  const useRole = construction_role(data == null ? void 0 : data.address);
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
  const aiOutput = `
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
  return aiOutput;
}

const index = defineEventHandler(async (event) => {
  try {
    console.log(event);
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
    await emailCompany(useAiCompany, company);
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
