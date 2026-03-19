export const analyze_lead = (data) =>`
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
1. Lead Name: ${data?.name}
2. Project Goal: ${data?.goal}
3. Approximate Square Footage: ${data?.sqft}
4. Budget Provided: ${data?.budget}
5. Message Provided: ${data?.message}

Please wrap each seperated section with <div></div> as this uses resend email.
Also have it have an extra space per each section.
`;