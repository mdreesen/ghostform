export const useConstructionLeadEmailFormatting = (data) => `
    A new lead named ${data?.name}. 
    Write a 3-sentence email thanking them, 
    mentioning one specific detail you see in the message, 
    and telling them a human will call them shortly.

    End the email with:
    Best regards,
    ${data?.company_name}

    Let new lines be wrapped in a <div></div> element
`;