export const lead_realtor = (answers) =>`
If there is a picture attached:
Based on the attached photo analyze the image of their home along with where the house is located ${answers.address}.
If no picture do not analyze a photo and do not do that step.

Analyze the following lead answers:
Address: ${answers.address}
Lead wants to move: ${answers.want_to_move}
Lead wants to buy, sell, buy and sell: ${answers.buy_sell_both}
Lead's estimated home price: ${answers.price}
Lead's estimated home sqft: ${answers.sqft}
Leads's bedrooms count: ${answers.bedrooms}
Lead's bathroom count: ${answers.bathrooms}
Budget: $${answers.budget}
Message: ${answers.message}

Please wrap each seperated section with <div></div> as this uses resend email.
Also have it have an extra space per each section.
`;