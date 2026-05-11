export const useRealtorCompanyEmailFormatting = (data, text) => `
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
`;