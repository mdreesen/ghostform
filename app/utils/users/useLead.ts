import { leadConstruction, testDataConstruction } from "./lead/leadConstruction";
import { leadRealtor, testLeadRealtor } from "./lead/leadRealtor";

export function leadData(category: any) {
    switch(true) {
        case category.includes('realtor'):
            return {
                data: leadRealtor,
                test: testLeadRealtor
            };
        case category.includes('construction'):
            return {
                data: leadConstruction,
                test: testDataConstruction
            };
    }
}