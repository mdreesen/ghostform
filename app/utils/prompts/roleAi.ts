import { use_realtor } from "./realtor/ai_job";
import { use_construction_contractor } from "./construction/ai_job";

export const use_ai_category_role = (data: any) => {
    switch (true) {
        case data.category.includes('realtor'):
            return use_realtor(data);
        case data.category.includes('construction'):
            return use_construction_contractor(data)
    }
};