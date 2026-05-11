import { use_realtor } from "./realtor/ai_job";
import { use_construction_contractor } from "./construction/ai_job";

export const use_ai_category_role = (answers: any) => {
    switch (true) {
        case answers.category.includes('realtor'):
            return use_realtor(answers);
        case answers.category.includes('construction'):
            return use_construction_contractor(answers)
    }
};