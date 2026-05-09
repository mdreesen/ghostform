import { lead_construction } from '~/utils/analyze/leads/leadConstruction'
import { lead_realtor } from '~/utils/analyze/leads/leadRealtor'

export function analyze_lead(data) {
    switch(true) {
        case data.category.includes('realtor'):
            return lead_realtor(data);
        case data.category.includes('construction'):
            return lead_construction(data);
    }
}