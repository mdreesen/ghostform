import { useRealtorLeadEmailFormatting } from '~/utils/email/formatting/lead/realtor';
import { useConstructionLeadEmailFormatting } from '~/utils/email/formatting/lead/construction';
import { useRealtorCompanyEmailFormatting } from './formatting/company/realtor';
import { useConstructionCompanyEmailFormatting } from './formatting/company/construction';

export function useLeadEmailFormatting(data) {
    switch (true) {
        case data.category.includes('realtor'):
            return useRealtorLeadEmailFormatting(data);
        case data.category.includes('construction'):
            return useConstructionLeadEmailFormatting(data);
    }
};

export function useCompanyEmailFormatting(data, text) {
    switch (true) {
        case data.category.includes('realtor'):
            return useRealtorCompanyEmailFormatting(data, text)
        case data.category.includes('construction'):
            return useConstructionCompanyEmailFormatting(data, text)
    }
}