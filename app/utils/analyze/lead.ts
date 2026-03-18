export const analyze_lead = (data) =>`
Analyze the following lead data:
1. Lead Name: ${data?.name}
2. Project Goal: ${data?.goal}
3. Approximate Square Footage: ${data?.sqft}
4. Budget Provided: ${data?.budget}
5. Message Provided: ${data?.message}
`;