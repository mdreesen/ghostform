import type { Lead } from "~/types/user";
export const useRealtorCompanyEmailFormatting = (data: Lead) => `
    <h1>Lead Information</h1>

    <div>Source: ${data?.source ?? 'N/A'}</div>
    <div>Name: ${data?.name ?? 'N/A'}</div>
    <div>Age: ${data?.age ?? 'N/A'}</div>
    <div>Email: ${data?.email ?? 'N/A'}</div>
    <div>Phone: ${data?.phone ?? 'N/A'}</div>
    <div>Best Communication Method: ${data?.best_communication_method ?? 'N/A'}</div>
    <div>Address: ${data?.address}</div>
    <div>Want To Move: ${data?.want_to_move ?? 'N/A'}</div>
    <div>Buy, Sell, or Both: ${data?.buy_sell_both ?? 'N/A'}</div>
    <div>Estimated Home Price: ${data?.price ?? 'N/A'}</div>
    <div>Estimated sqft: ${data?.sqft ?? 'N/A'}</div>
    <div>Bedrooms: ${data?.bedrooms ?? 'N/A'}</div>
    <div>Bathrooms: ${data?.bathrooms ?? 'N/A'}</div>
    <div>Budget: ${data?.budget ?? 'N/A'}</div>
    <div>Notes: ${data?.notes ?? 'N/A'}</div>
    <div>Seeing An Agent: ${data?.seeing_an_agent ?? 'N/A'}</div>
`;