import { leadConstruction } from "./lead/leadConstruction";
import { leadRealtor } from "./lead/leadRealtor";
import { testDataConstruction } from "./lead/testData";

export const leadData = (category: any) => {
    console.log(category)
    switch(true) {
        case category.includes('realtor'):
            return leadRealtor;
        case category.includes('construction'):
            return leadConstruction;
    }
}