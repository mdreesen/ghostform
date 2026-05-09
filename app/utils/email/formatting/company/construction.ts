export const useConstructionCompanyEmailFormatting = (data, text) => `
    <h1>Lead Information</h1>
    <div>Lead Name: ${data?.name}</div>
    <div>Lead Email: ${data?.email}</div>
    <div>Project Goal: ${data?.goal}</div>
    <div>Square Footage: ${data?.sqft}</div>
    <div>Budget: ${data?.budget}</div>
    <div>Message Details: ${data?.message}</div>

    <h2>AI Analysis:</h2>
    ${text}
`;