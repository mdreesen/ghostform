export const lead_realtor = (data) =>`
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