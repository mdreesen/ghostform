export const role = `
    Analyze the provided form data and categorize the lead into exactly one of these three labels: [Tier 1, Tier 2, Tier 3].
    Evaluation Rules:

    If budget is >$50k AND project is 'Commercial', Label = 'Tier 1'.
    If timeline is 'ASAP', upgrade one Tier.
    If the message is vague or 'just testing', Label = 'Tier 3'.

    Output Format: Provide the Label followed by a 1-sentence reasoning.
`;