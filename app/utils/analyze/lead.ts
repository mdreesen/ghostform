import { lead_construction } from '~/utils/analyze/leads/leadConstruction'
import { lead_realtor } from '~/utils/analyze/leads/leadRealtor'

export function analyze_lead(answers) {
    switch(true) {
        case answers.category.includes('realtor'):
            return lead_realtor(answers);
        case answers.category.includes('construction'):
            return lead_construction(answers);
    }
}