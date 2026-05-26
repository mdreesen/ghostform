import { on_market, data_entry, open_house } from "~/utils/questions/realtor";

export function useQuestions(source: string) {
    switch(true) {
        case source.includes('on_market'):
            return on_market;
        case source.includes('open_house'):
            return open_house;
        default:
            return data_entry;
    }
}