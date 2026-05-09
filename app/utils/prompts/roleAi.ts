import { use_realtor } from "./realtor/ai_job";
import { use_construction_contractor } from "./construction/ai_job";
import lead from "~~/server/api/lead";

export const use_ai_category_role = (leadData) => {
    console.log(leadData);
}

export const roleAiConstruction = `
    Analyze the provided form data and categorize the lead into exactly one of these three labels: [Tier 1, Tier 2, Tier 3].
    Evaluation Rules:

    SCORING RUBRIC (0-100) for tiers
    1. Intent (40%): Does the lead have a specific problem they need solved now or does budget is >$50k AND project is 'Commercial'?
    2. Technical Fit (30%): Does their project align with our technical capabilities?
    3. Urgency (30%): Are they looking to start within 30 days or if timeline is 'ASAP'?

    If the message is vague or 'just testing', Label - analyze this and see where the rank is on preference.

    Output Format: Provide the Label followed by a 1-sentence reasoning.
`;